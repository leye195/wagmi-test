import { Address, WalletClient } from "wagmi";
import { formatEther } from "viem";

type SignMessage = {
  account: string;
  walletClient: WalletClient;
  message: string;
};

export const signMessage = ({
  account,
  message,
  walletClient,
}: SignMessage) => {
  return walletClient.signMessage({
    account: account as Address,
    message,
  });
};

export const convertBigIntToNumber = (input: string | bigint | number) =>
  formatEther(BigInt(input));
