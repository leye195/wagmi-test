import {
  Connector,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from "wagmi";
import { useEffect, useState } from "react";
import type { NextPage } from "next";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const {
    signMessage,
    isLoading: signMessageLoading,
    error: signMessageError,
  } = useSignMessage({
    message: "wallet login",
    onError(err) {
      setError(err);
      disconnect();
    },
  });
  const { connect, connectors, isConnecting, pendingConnector } = useConnect({
    onConnect() {
      signMessage();
    },
    onError(err) {
      setError(err);
    },
  });
  const { disconnect } = useDisconnect();
  const { data: account } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();
  const { data: balance, isLoading } = useBalance({
    addressOrName: account?.address,
  });

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = (connector: Connector) => () => {
    connect(connector);
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
          {account && activeChain && !signMessageLoading && (
            <div>
              <p>Address: {account?.address}</p>
              <p>ChainId: {activeChain?.id}</p>
              <p>Network: {activeChain?.name}</p>
              <p>
                Balance:{" "}
                {isLoading
                  ? "Loading"
                  : `${Number(balance?.formatted).toFixed(4)}  ${
                      balance?.symbol
                    }`}
              </p>
            </div>
          )}
          <div className={styles.buttonGroup}>
            {!account &&
              connectors.map((connector) => (
                <button
                  className={styles.connectButton}
                  key={connector.id}
                  onClick={handleConnect(connector)}
                >
                  {connector.name}
                  {isConnecting &&
                    pendingConnector?.id === connector.id &&
                    " (connecting)"}
                </button>
              ))}
            {account && !signMessageLoading && (
              <>
                <button onClick={() => disconnect()}>Disconnect</button>
                <button onClick={handleSwitch(1)}>Switch to Mainnet</button>
                <button onClick={handleSwitch(3)}>Switch to Ropsten</button>
                <button onClick={handleSwitch(80001)}>Switch to Mumbai</button>
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
