import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { WagmiProvider, useWriteContract, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { rootstockTestnet } from 'wagmi/chains';
import { abi } from './abi'
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from './graphql/queries';

import './EventsList.css'
const web3 = new Web3('https://rpc.testnet.rootstock.io/ipfSWKMvAyIqYyIEijfQrSpZ2JGn8s-T');
const CONTRACT_ADDRESS = '0x233C9256A80732B734F6924A03fBB10Eb3a7Cf13';

const BlockchainData = () => {

    const { address, connector, isConnected } = useAccount();
    const { loading, data } = useQuery(GET_EVENTS);

    const [blockData, setBlockData] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [contractCalls, setContractCalls] = useState([]);
    const { writeContract, isPending, isSuccess, error } = useWriteContract();

    useEffect(() => {
        const getBlockData = async () => {
          try {
            const blockNumber = 5494996 // Specify the desired block number
            const block = await web3.eth.getBlock(blockNumber);
            setBlockData(block);
    
            const fromBlock = 5494996;
            const toBlock = 'latest';
            const eventSignature = 'EventCreated(uint256 eventId, string name, address creator)'; // Specify the event signature

            // Calculate the Keccak-256 hash of the event signature
            const eventTopic = web3.utils.sha3(eventSignature);
    
            const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
            const calls = await contract.getPastEvents('EventCreated', {
                toBlock: 'latest',
              });
            setContractCalls(calls);
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
        getBlockData();
      }, []);
    
    const handleJoinEvent = (eventId) => {
        console.log('eventId', eventId)

        writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'joinEvent',
            args: [eventId],
            account: address,
            chainId: rootstockTestnet.id,
            value: web3.utils.toWei('0.01', 'ether'), // Specify the sign-up fee in ether
        });
    };

if (loading) return <p>Loading...</p>;
return (
  <div className="events-container">
    <h1 className="events-title">Upcoming Events Data</h1>
    {data.EventManagement_EventCreated.map(({ creator, eventId, name }) => (
      <div className="event-card" key={eventId}>
        <h2 className="event-name">{name}</h2>
        <p className="event-creator">
          made by{' '}
          <a href={`https://explorer.testnet.rootstock.io/address/${creator}`}
            target="_blank"
            rel="noopener noreferrer"
            className="event-creator-link"
          >
            {creator}
          </a>
        </p>
        <button
          className="join-event-button"
          onClick={() => handleJoinEvent(eventId)}
        >
          {isPending ? 'Joining...' : 'Join Event'}
        </button>
      </div>
    ))}
    </div>
    );
};

export default BlockchainData;