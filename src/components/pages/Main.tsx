"use client";

import { useState } from "react";
import useWallet from "@/hooks/useWallet";
import WalletModal from "@/components/wallet/WalletModal";
import Button from "@/components/common/Button";
import Portal from "@/components/Portal";

const Main = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { active, disconnect } = useWallet();

  const handleOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Portal>
        <WalletModal
          className="bg-white rounded-[10px] max-w-[400px] max-h-[320px] px-[20px] pt-[40px] pb-[40px]"
          isOpen={isOpen}
          handleOpen={handleOpen}
          backdrop="blur"
        />
      </Portal>
      {active && <Button onClick={() => disconnect()}>Disconnect</Button>}
    </div>
  );
};

export default Main;
