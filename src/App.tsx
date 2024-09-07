// WAGMI Libraries
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";

import { rootstockTestnet } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";

import { Balance } from "./balance";
import EventCreation from "./EventCreation";
import BlockchainData from "./BlockchainData";
import Profile from './Profile'

import "./App2.css";

const queryClient = new QueryClient();

// Set up client
const config = createConfig({
  chains: [rootstockTestnet, sepolia],
  transports: {
    [rootstockTestnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    Web3AuthConnectorInstance([sepolia]),
  ],
});

function Profile2() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected to {connector?.name}</div>
        <div>{address}</div>
        <button className="card" onClick={disconnect as any}>
          Disconnect
        </button>
        <Balance />
        <EventCreation config={config} />
      </div>
    );
  } else {
    return (
      <div className="main">
        <EventCreation config={config}/>
        {connectors.map((connector) => (
          <button className="card" key={connector.id} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
        {error && <div>{error.message}</div>}
      </div>
    );
  }
}

// Pass client to React Context Provider
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="container">
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/" className="nav-link">Create Event</Link>
                </li>
                <li>
                  <Link to="/data" className="nav-link">Event List</Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<Profile config={config} />} />
              <Route path="/data" element={<BlockchainData />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;