import { Connector, useConnect } from "wagmi";

type Props = {
  connector: Connector;
  onClick: () => void;
};

const WalletOption = ({ connector, onClick }: Props) => {
  const { isLoading, pendingConnector } = useConnect();
  return (
    <button
      className="border p-2 rounded-lg bg-white max-w-[300px] w-full"
      disabled={isLoading && pendingConnector?.id === connector.id}
      key={connector.id}
      onClick={onClick}
    >
      {connector.name}
    </button>
  );
};

export default WalletOption;
