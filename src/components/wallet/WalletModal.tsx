"use client";

import Modal, { ModalProps } from "@/components/common/Modal";
import WalletList from "@/components/wallet/WalletList";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import useWallet from "@/hooks/useWallet";

type Props = ModalProps;

const WalletModal = ({ isOpen, handleOpen, ...props }: Props) => {
  const { active } = useWallet();

  useIsomorphicLayoutEffect(() => {
    if (active) {
      handleOpen(false);
    }
  }, [active]);

  return (
    <Modal {...props} isOpen={isOpen} handleOpen={handleOpen}>
      <WalletList />
    </Modal>
  );
};

export default WalletModal;
