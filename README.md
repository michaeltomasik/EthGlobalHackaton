# Web3vents - Decentralized Event Management on Rootstock

## Project Description

Web3vents is a decentralized event management platform built on the Rootstock (RSK) network, enabling users to create and manage events using smart contracts.

## DEMO

![pic 1](./Screenshot%202024-09-08%20at%2002.02.21.png)


![pic 2](./Screenshot%202024-09-08%20at%2002.02.25.png)

## Rootstock Integration

We chose to integrate our project with the Rootstock network because of its strong focus on Bitcoin compatibility. Many people have a strong sentiment towards Bitcoin and are more likely to use applications that are built on top of the Bitcoin ecosystem. By leveraging Rootstock, we can tap into this sentiment and attract a wider audience to our platform.

Our smart contracts are written in Solidity and deployed on the Rootstock testnet. We have successfully executed at least two on-chain transactions to demonstrate the functionality of our platform.

## Team

Our team consists of two members:

1. Michal Tomasik - Full-stack Developer
2. André Ringdorfer - Business Development

## Testing Instructions

To test the Web3vents platform:

1. Visit our website at [https://eth-global-hackaton.vercel.app/](https://eth-global-hackaton.vercel.app/).
2. Connect your Rootstock testnet wallet (e.g., Metamask) to the platform.
3. Create a new event by providing a name and date for the event. Other details are optional.
4. After creating an event, you should be able to see it listed on the event list page within a short period of time.

## Technology used

- We used Envio for indexing the RPC data, allowing us to access it quickly via GraphQL queries.
- We deployed smart contracts on the Rootstock blockchain for creating and attending events, ensuring the integrity and transparency of event management.
- We integrated Web3auth as a login option to cater to users coming from a web2 background who may not have a wallet set up.


## Links

- Smart Contract Address: [https://explorer.testnet.rootstock.io/address/0x233c9256a80732b734f6924a03fbb10eb3a7cf13](https://explorer.testnet.rootstock.io/address/0x233c9256a80732b734f6924a03fbb10eb3a7cf13)