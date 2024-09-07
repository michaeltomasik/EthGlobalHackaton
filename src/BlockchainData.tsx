import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { WagmiProvider, useWriteContract, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { rootstockTestnet } from 'wagmi/chains';
import { abi } from './abi'

import './EventsList.css'
const web3 = new Web3('https://rpc.testnet.rootstock.io/ipfSWKMvAyIqYyIEijfQrSpZ2JGn8s-T');
const CONTRACT_ADDRESS = '0x233C9256A80732B734F6924A03fBB10Eb3a7Cf13';

const BlockchainData = () => {
    // const CONTRACT_ADDRESS = '0x233c9256A80732B734f6924A03fbB10eb3A7CF13'; // Latest Event COntract

    const { address, connector, isConnected } = useAccount();

    const [blockData, setBlockData] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [contractCalls, setContractCalls] = useState([]);
    const { writeContract, isPending, isSuccess, error } = useWriteContract();
    console.log('isSuccess', isSuccess, error)
    // const contractABI = [
    //     {
    //         "anonymous": false,
    //         "inputs": [
    //           {
    //             "indexed": false,
    //             "internalType": "uint256",
    //             "name": "eventId",
    //             "type": "uint256"
    //           },
    //           {
    //             "indexed": false,
    //             "internalType": "string",
    //             "name": "name",
    //             "type": "string"
    //           },
    //           {
    //             "indexed": false,
    //             "internalType": "address",
    //             "name": "creator",
    //             "type": "address"
    //           }
    //         ],
    //         "name": "EventCreated",
    //         "type": "event"
    //       },
    //       {
    //         "inputs": [
    //           {
    //             "internalType": "uint256",
    //             "name": "_eventId",
    //             "type": "uint256"
    //           }
    //         ],
    //         "name": "joinEvent",
    //         "outputs": [],
    //         "stateMutability": "payable",
    //         "type": "function"
    //       },
    //       {
    //         "anonymous": false,
    //         "inputs": [
    //           {
    //             "indexed": true,
    //             "internalType": "uint256",
    //             "name": "_eventId",
    //             "type": "uint256"
    //           },
    //           {
    //             "indexed": true,
    //             "internalType": "address",
    //             "name": "_participant",
    //             "type": "address"
    //           }
    //         ],
    //         "name": "ParticipantJoined",
    //         "type": "event"
    //       },
    // ]
    useEffect(() => {
        const getBlockData = async () => {
          try {
            const blockNumber = 5494996 // Specify the desired block number
            const block = await web3.eth.getBlock(blockNumber);
            setBlockData(block);
    
            // const transactions = await Promise.all(
            //   block.transactions.map((txHash) => web3.eth.getTransaction(txHash))
            // );
            // setTransactionData(transactions);
    
            const fromBlock = 5494996;
            const toBlock = 'latest';
            const eventSignature = 'EventCreated(uint256 eventId, string name, address creator)'; // Specify the event signature

            // Calculate the Keccak-256 hash of the event signature
            const eventTopic = web3.utils.sha3(eventSignature);
            console.log('eventTopic', eventTopic)
    
            // const eventTopic = '0x40fb05b814a900c99fa0a76d919dfdeaf3389540e4ca70f97ba40ca9a38f3797' // Event Creation
 
            // const calls = await web3.eth.getPastLogs({
            //   fromBlock,
            //   toBlock,
            //   address: CONTRACT_ADDRESS,
            // //   topics: [eventTopic],
            // });
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
  return (
    <div className="events-container">
  <h1 className="events-title">Upcoming Events Data</h1>
  {contractCalls.map((eventData) => (
    <div className="event-card" key={eventData.returnValues[0]}>
      <h2 className="event-name">{eventData.returnValues[1]}</h2>
      <p className="event-creator">
        made by{' '}
        <a href={`https://explorer.testnet.rootstock.io/address/${eventData.returnValues[2]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="event-creator-link"
        >
          {eventData.returnValues[2]}
        </a>
      </p>
      <button
        className="join-event-button"
        onClick={() => handleJoinEvent(eventData.returnValues[0])}
      >
        {isPending ? 'Joining...' : 'Join Event'}
      </button>
    </div>
  ))}
</div>
  );
};

export default BlockchainData;