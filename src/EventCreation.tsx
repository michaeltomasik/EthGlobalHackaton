import React, { useState, useMemo } from 'react';

import { useAccount, useWriteContract, useSimulateContract, serialize } from 'wagmi';
import { rootstockTestnet } from 'wagmi/chains';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';


import { parseEther, formatEther } from 'viem';
import EventManagementABI from './artifacts/contracts/EventManagement.sol/EventManagement.json';
import { abi } from './abi'

import './EventCreation.css';

const CONTRACT_ADDRESS = '0x233C9256A80732B734F6924A03fBB10Eb3a7Cf13';
BigInt.prototype['toJSON'] = function () {
  return this.toString()
}
const EventCreation = ({ config }) => {
  const [eventDetails, setEventDetails] = useState({

  });

  const { address } = useAccount();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };


  const replacer = (key, value) =>
    typeof value === 'bigint' ? value.toString() : value;

  function bigIntReplacer(key, value) {
    if (typeof value === "bigint") {
      return value.toString() + 'n';
    }
    return value;
  }
  
  const generateMockContractArgs = () => {
    const eventName = "Test Event 2";
  const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const startTimestamp = BigInt(currentTimestamp + 3600); // Start time: 1 hour from now
  const endTimestamp = BigInt(currentTimestamp + 7200); // End time: 2 hours from now
  const location = "Test Location";
  const description = "Test Description";
  const capacity = 100; // This is a regular number, so no need to convert
  const signUpFeeWei = BigInt("100000000000000000"); // Example BigInt value for fee

  // Create an object with the contract arguments
  const contractArgs = [
    eventName,
    startTimestamp,
    endTimestamp,
    location,
    description,
    capacity,
    signUpFeeWei
  ];
  
  // const jsonString = JSON.stringify(contractArgs, replacer);
  // console.log('jsonString', jsonString)
  return contractArgs
  };
  

  const contractArgs = generateMockContractArgs()
 
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleCreateEvent = async () => {
    console.log('handleCreateEvent', !address)
    if (!address) {
      console.error("Please connect your wallet");
      return;
    }

    // if (simulateError) {
    //   console.error("Simulation error:", simulateError);
    //   return;
    // }
console.log('JSON.parse(contractArgs)', contractArgs)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: 'createEvent',
      args: contractArgs,
      account: address,
      chainId: rootstockTestnet.id,
    });
  };

  return (
    <div className="event-creation-container">
      <div className="event-details">
        <input
          type="text"
          name="eventName"
          placeholder="Event Name"
          value={eventDetails.eventName}
          onChange={handleInputChange}
          className="event-name-input"
        />
        <div className="date-time-selector">
          <div>
            <label>Start</label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="startTime"
              value={eventDetails.startTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>End</label>
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="endTime"
              value={eventDetails.endTime}
              onChange={handleInputChange}
            />
          </div>
          <span>GMT+02:00 Warsaw</span>
        </div>
        <input
          type="text"
          name="location"
          placeholder="Add Event Location"
          value={eventDetails.location}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Add Description"
          value={eventDetails.description}
          onChange={handleInputChange}
        />
        <div className="event-options">
          <h3>Event Options</h3>
          <div className="option">
            <span>Tickets</span>
            <select name="ticketType" value={eventDetails.ticketType} onChange={handleInputChange}>
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>
          {eventDetails.ticketType === 'Paid' && (
            <div className="option">
              <span>Sign-up Fee (ETH)</span>
              <input
                type="number"
                name="signUpFee"
                value={eventDetails.signUpFee}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          )}
          <div className="option">
            <span>Capacity</span>
            <select name="capacity" value={eventDetails.capacity} onChange={handleInputChange}>
              <option>Unlimited</option>
              <option>Limited</option>
            </select>
          </div>
          {eventDetails.capacity === 'Limited' && (
            <div className="option">
              <span>Max Capacity</span>
              <input
                type="number"
                name="capacity"
                value={eventDetails.capacity}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          )}
        </div>
        <button onClick={handleCreateEvent} disabled={isPending} className="create-event-button">
          {isPending ? 'Creating...' : 'Create Event'}
        </button>
        {isSuccess && <div>Event created successfully!</div>}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
};

export default EventCreation;