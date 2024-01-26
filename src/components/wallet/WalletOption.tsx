import { Connector, useConnect } from "wagmi";
import Button from "@/components/common/Button";

type Props = {
  connector: Connector;
  selected: string | null;
  onClick: () => void;
};

const WalletOption = ({ connector, selected, onClick }: Props) => {
  const { isLoading } = useConnect();

  return (
    <Button
      className={`border p-2 rounded-lg bg-white w-full disabled:cursor-not-allowed ${
        selected === connector.id
          ? ""
          : "disabled:bg-black/25 disabled:text-white"
      }`}
      disabled={isLoading || !!selected}
      key={connector.id}
      onClick={onClick}
    >
      {selected === connector.id ? "Connecting..." : connector.name}
    </Button>
  );
};

export default WalletOption;
