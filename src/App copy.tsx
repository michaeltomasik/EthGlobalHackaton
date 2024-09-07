// WAGMI Libraries
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { rootstockTestnet } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { SendTransaction } from "./sendTransaction";
import { SwitchChain } from "./switchNetwork";
import { Balance } from "./balance";
import { WriteContract } from "./writeContract";
import { HypersyncClient, presetQueryLogsOfEvent } from "@envio-dev/hypersync-client";
import EventCreation from "./EventCreation.tsx";
import BlockchainData from "./BlockchainData.tsx"

import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import "./App.css";
import { useEffect } from "react";

const queryClient = new QueryClient() 

// Set up client
const config = createConfig({
  chains: [rootstockTestnet],
  transports: {
    [rootstockTestnet.id]: http(),
  },
  connectors: [
    // walletConnect({
    //   projectId: "3314f39613059cb687432d249f1658d2",
    //   showQrModal: true,
    // }),
    // coinbaseWallet({ appName: 'wagmi' }),
    // Web3AuthConnectorInstance([rootstockTestnet]),
  ],
  structuralSharing: false,
});


function Profile() {
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
        {/* <SendTransaction /> */}
        <Balance />

        <EventCreation config={config} />
        {/* <WriteContract />
        <SwitchChain /> */}
      </div>
    );
  } else {
    return (
      <div className="main">
        <EventCreation />
        {connectors.map((connector) => {
          return (
            <button className="card" key={connector.id} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
          );
        })}
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
            <nav>
              <ul>
                <li>
                  <Link to="/">Profile</Link>
                </li>
                <li>
                  <Link to="/data">Blockchain Data</Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/data" element={<BlockchainData />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;