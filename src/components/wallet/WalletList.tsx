"use client";

import { useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi1/react";
import WalletOption from "@/components/wallet/WalletOption";
import { useState } from "react";

const WalletList = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { connectors, connect } = useConnect({
    onMutate: ({ connector }) => {
      setSelected(connector.id);
    },
    onSettled: () => {
      setSelected(null);
    },
  });
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full">
      {connectors
        .filter(({ id }) => id !== "injected" && id !== "eip6963")
        .map((connector) => (
          <WalletOption
            key={connector.name}
            connector={connector}
            selected={selected}
            onClick={() =>
              connector.id === "walletConnect" ? open() : connect({ connector })
            }
          />
        ))}
    </div>
  );
};

export default WalletList;
