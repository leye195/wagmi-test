"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi1/react";
import WalletOption from "@/components/WalletOption";

const WalletList = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-center gap-2 max-x-[400px] w-full">
      {isConnected && (
        <div className="text-center">
          <p>address: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
      {connectors
        .filter(({ id }) => id !== "injected" && id !== "eip6963")
        .map((connector) => (
          <WalletOption
            key={connector.name}
            connector={connector}
            onClick={() =>
              connector.id === "walletConnect" ? open() : connect({ connector })
            }
          />
        ))}
    </div>
  );
};

export default WalletList;
