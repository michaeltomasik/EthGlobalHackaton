import React, { useState, useMemo } from 'react';
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import EventCreation from './EventCreation'
import Balance from './balance'

import './Profile.css'

const Profile = ({ config }) => {
    const { address, connector, isConnected } = useAccount();
    const { connect, connectors, error } = useConnect();
    const { disconnect } = useDisconnect();
  
    if (isConnected) {
      return (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-title">Connected to {connector?.name}</div>
            <div className="profile-address">{address}</div>
            <button className="disconnect-button" onClick={disconnect}>
              Disconnect
            </button>
          </div>
          {/* <Balance /> */}
          <EventCreation config={config} />
        </div>
      );
    } else {
      return (
        <div className="profile-container">
          <div className="connect-container">
            {connectors.map((connector) => (
              <button className="connect-button" key={connector.id} onClick={() => connect({ connector })}>
                {connector.name}
              </button>
            ))}
          </div>
          {error && <div className="error-message">{error.message}</div>}
        </div>
      );
    }
  }

export default Profile;