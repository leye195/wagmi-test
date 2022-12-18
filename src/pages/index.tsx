import {
  Connector,
  useAccount,
  useBalance,
  useBlockNumber,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import { useEffect, useState } from "react";
import type { NextPage } from "next";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { connect, connectors, pendingConnector, reset } = useConnect({
    onSuccess() {
      signMessage();
    },
    onError(err) {
      setError(err);
      reset();
    },
  });
  const { disconnect } = useDisconnect({
    onSuccess() {
      reset();
    },
  });

  const { address, isConnected, connector: activeConnector } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const { data: blockData, isLoading: isBlockLoading } = useBlockNumber({
    watch: true,
  });
  const { signMessage, isLoading: signMessageLoading } = useSignMessage({
    message: "Wallet Login Message",
    onError() {
      reset();
      disconnect();
    },
  });

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = (connector: Connector) => () => {
    connect({ connector });
  };

  const handleSwitch = (id: number) => () => {
    switchNetwork?.(id);
  };

  if (!isMounted) return null;

  return (
    <div className={styles.container}>
      <main>
        <div className={styles.connectBlock}>
          <p>Wallet Connect with Wagmi</p>
          {activeChain && isConnected && !signMessageLoading && (
            <p>
              {isBlockLoading
                ? "Fetching Block Number..."
                : `Current Block Number on ${activeChain?.name}: ${blockData}`}
            </p>
          )}
          {address && activeChain && !signMessageLoading && (
            <div>
              <p>Connected to {activeConnector?.name}</p>
              <p>Address: {address}</p>
              <p>ChainId: {activeChain?.id}</p>
              <p>Network: {activeChain?.name}</p>
              <p>
                Balance:{" "}
                {isBalanceLoading
                  ? "Balance Loading"
                  : `${Number(balance?.formatted).toFixed(4)}  ${
                      balance?.symbol
                    }`}
              </p>
            </div>
          )}
          <div className={styles.buttonGroup}>
            {(!isConnected || signMessageLoading) &&
              connectors.map((connector) => (
                <button
                  className={styles.connectButton}
                  key={connector.id}
                  onClick={handleConnect(connector)}
                  disabled={!connector.ready || !!pendingConnector}
                >
                  {connector.name}
                  {signMessageLoading &&
                    pendingConnector?.id === connector.id &&
                    " (connecting)"}
                </button>
              ))}
            {isConnected && !signMessageLoading && (
              <>
                <button onClick={() => disconnect()}>Disconnect</button>
                {activeConnector?.name !== "torus" &&
                  chains.map((chain) => (
                    <button
                      key={`switch-${chain.id}`}
                      onClick={handleSwitch(chain.id)}
                      disabled={chain.id === activeChain?.id}
                    >
                      {chain.id === activeChain?.id && "(Current)"} Switch to{" "}
                      {chain.name}
                    </button>
                  ))}
              </>
            )}
          </div>
          {error && <div>{error.message}</div>}
        </div>
      </main>
    </div>
  );
};

export default Home;
