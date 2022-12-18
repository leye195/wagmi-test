import Torus, { TorusInpageProvider } from "@toruslabs/torus-embed";
import { normalizeChainId, UserRejectedRequestError } from "@wagmi/core";
import { Chain, Connector, ConnectorData } from "wagmi";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { Options } from "./interfaces";

const IS_SERVER = typeof window === "undefined";

export class ToursConnector extends Connector {
  readonly id = "torus";
  readonly name = "torus";

  ready = !IS_SERVER;

  provider: TorusInpageProvider | null = null;

  torusInstance?: Torus;

  torusOptions: Options;

  network = {
    host: "mainnet",
    chainId: 1,
    networkName: "Ethereum Mainnet",
    blockExplorer: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  };

  constructor(config: { chains?: Chain[]; options: Options }) {
    super(config);
    this.torusOptions = config.options;

    const chainId = config.options?.chainId ?? 1;
    const host = config.options.host ? config.options.host : "mainnet";
    this.torusInstance = new Torus({
      buttonPosition: config.options.buttonPosition || "bottom-left",
    });

    const chain = this.chains.find((c) => c.id === chainId);

    if (chain) {
      this.network = {
        host,
        chainId,
        networkName: chain.name,
        blockExplorer: chain.blockExplorers?.default.url ?? "",
        ticker: chain.nativeCurrency?.symbol,
        tickerName: chain.nativeCurrency?.name,
      };
      return;
    }

    this.emit("disconnect");
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      this.emit("message", {
        type: "connecting",
      });

      if (!this.provider) {
        if (!this.torusInstance?.isInitialized) {
          await this.torusInstance?.init({
            ...this.torusOptions.TorusParams,
            network: this.network,
          });
        } else if (this.torusOptions.TorusParams?.showTorusButton !== false) {
          this.torusInstance?.showTorusButton();
        }

        if (this.torusInstance) await this.torusInstance.login();
      }

      const isLoggedIn = await this.isAuthorized();

      if (isLoggedIn) {
        const provider = await this.getProvider();

        if (provider.on) {
          provider.on("accountChanged", this.onAccountsChanged);
          provider.on("chainChanged", this.onChainChanged);
        }

        const chainId = await this.getChainId();

        return {
          provider,
          chain: {
            id: chainId,
            unsupported: this.isChainUnsupported(chainId),
          },
          account: await this.getAccount(),
        };
      }
      throw new Error("Failed to login, Please try again");
    } catch (err) {
      if (this.torusInstance?.isInitialized) {
        this.torusInstance.hideTorusButton();
      }

      throw new UserRejectedRequestError("Something went wrong");
    }
  }

  async disconnect(): Promise<void> {
    await this.torusInstance?.logout();
    this.torusInstance?.hideTorusButton();
    this.provider = null;
  }

  async getAccount(): Promise<`0x${string}`> {
    try {
      const provider = new ethers.providers.Web3Provider(
        await this.getProvider()
      );
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      return account as `0x${string}`;
    } catch (err) {
      throw err;
    }
  }

  async getChainId(): Promise<number> {
    try {
      const provider = await this.getProvider();

      if (!provider && this.network.chainId) {
        return normalizeChainId(this.network.chainId);
      }

      if (provider) {
        const chainId = await this.provider?.request({ method: "eth_chainId" });

        if (chainId) {
          return normalizeChainId(chainId as string);
        }
      }

      throw new Error("Chain ID is not defined");
    } catch (err) {
      throw err;
    }
  }

  async getProvider(): Promise<any> {
    if (!this.provider && this.torusInstance) {
      this.provider = this.torusInstance.provider;
    }

    return this.provider;
  }

  async getSigner(): Promise<any> {
    try {
      const provider = new ethers.providers.Web3Provider(
        await this.getProvider()
      );
      const signer = provider.getSigner();
      return signer;
    } catch (err) {
      throw err;
    }
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount();
      return !!(account && this.provider);
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number) {
    try {
      const chain = this.chains.find((x) => x.id === chainId);
      if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);
      if (!this.isAuthorized()) throw new Error("Please login first");

      await this.torusInstance?.setProvider({
        host: chain.name,
        chainId,
        networkName: chain.name,
      });
      return chain;
    } catch (error) {
      throw error;
    }
  }

  protected isChainUnsupported(chainId: number): boolean {
    return !this.chains.some((x) => x.id === chainId);
  }

  protected onAccountsChanged(accounts: `0x${string}`[]): void {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: getAddress(accounts[0]) });
    }
  }

  protected onChainChanged(chain: string | number): void {
    const id = normalizeChainId(chain);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }
}
