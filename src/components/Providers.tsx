"use client";

import { PropsWithChildren } from "react";
import { mainnet, polygon, polygonMumbai } from "viem/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { TorusConnector } from "@toruslabs/torus-wagmi-connector";
import {
  WagmiConfig,
  createConfig,
  configureChains,
  createStorage,
} from "wagmi";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi1";
import { createWeb3Modal } from "@web3modal/wagmi1/react";

import { publicProvider } from "wagmi/providers/public";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { InjectedConnector } from "wagmi/connectors/injected";

const projectId = "c9c95ee83c783b6a550c7d36eeaa4846";
const chains = [mainnet, polygon, polygonMumbai];
const { publicClient, webSocketPublicClient } = configureChains(chains, [
  walletConnectProvider({ projectId }),
  publicProvider(),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: false,
      },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "AppName",
      },
    }),
    new TorusConnector({
      chains: chains,
      options: {
        chainId: 137,
        host: "Polygon",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

createWeb3Modal({ wagmiConfig, projectId, chains });

const Providers = ({ children }: PropsWithChildren) => {
  useIsomorphicLayoutEffect(() => {
    wagmiConfig.storage = createStorage({
      storage: window.sessionStorage,
    });
  }, []);

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default Providers;
