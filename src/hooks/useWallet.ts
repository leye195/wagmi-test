import { useCallback, useEffect, useState } from "react";
import {
  Connector,
  WalletClient,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi1/react";

const useWallet = () => {
  const { address, connector } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const connectWallet = useCallback(
    (connector: Connector) => () => {
      if (connector.id === "walletConnect") {
        open();
        return;
      }

      connect({ connector });
    },
    [open, connect]
  );

  const getWalletClient = useCallback(async () => {
    if (!connector) return;

    const signer = await connector.getWalletClient();
    setWalletClient(signer);
  }, [connector]);

  useEffect(() => {
    if (connector) {
      getWalletClient();
    }
  }, [connector, getWalletClient]);

  return {
    active: !!address,
    address: address ?? "",
    chainId: chain?.id,
    connector,
    walletClient,
    connectWallet,
    disconnect,
  };
};

export default useWallet;
