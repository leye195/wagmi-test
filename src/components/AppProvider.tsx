import { WagmiConfig, createClient, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  polygon,
  polygonMumbai,
  mainnet,
  goerli,
  bsc,
  bscTestnet,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

type Props = {
  children: React.ReactNode;
};

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: false,
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
