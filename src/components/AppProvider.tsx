import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
  chain,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

type Props = {
  children: React.ReactNode;
};

const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.polygonMumbai, chain.polygon],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimChainChangedDisconnect: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const AppProvider = ({ children }: Props) => {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
};

export default AppProvider;
