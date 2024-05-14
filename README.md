# Cronos Wallet Connections

## Overview

This is a boilerplate project using NextJS13+ (here, v14) to demonstrate Web3 wallet connection on Cronos and basic interaction with the Cronos blockchain.

Built with Node version: Node 20+

## Project creation

This project was created with `npx create-next-app@latest` with default settings (no src, no Tailwind, App Router, @ for alias)

Configure port in `package.json` to expose the localhost:3000 port for the browser:

```json
{
    "scripts": {
        "dev": "next dev -p 3000"
    }
}
```

Then, install and configure:

-   [Chakra UI](https://v2.chakra-ui.com/getting-started/nextjs-app-guide)
-   [Zustand for state management](https://github.com/pmndrs/zustand)
-   [Ethers.js] (https://docs.ethers.org/). Here we are using v6.
-   [Web3 Wallet](https://web3-wallet.github.io/web3-wallet/docs/getting-started) with `npm add @react-web3-wallet/react @react-web3-wallet/metamask @react-web3-wallet/brave-wallet @react-web3-wallet/defiwallet @react-web3-wallet/trust-wallet @react-web3-wallet/walletconnect`
-   [TypeChain](https://github.com/dethcrypto/TypeChain): TypeScript bindings for your smart contracts
-   Other imports: `npm install @chakra-ui/icons pino-pretty`

Web3 Wallet is an open-source wrapper developed especially to simplify the workflow of Cronos app developers, but it also supports other EVM compatible networks.

Then, create or update the /app directory.

## Env variables

See .env.example

## Contract arfifacts

When you compile a smart contract in hardhat, you get the artifacts directowy which contains the JSON artifacts for each smart contract. You need to extract the abi object from each JSON file in order to get the interface of your smart contracts. In this project, the ABI of a basic ERC20 contract is stored in the ./contracts/abis/crc20.json file of the project. You can replace it by your own ABI. (CRC20 is the frequently used denomination of ERC20 smart contracts on Cronos).

## To launch the project locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To use from another device, such as a mobile device, with ngrok (installed with Homebrew):

```bash
ngrok http --domain=domain-name.app 3000
```

## How to connect to Web3 wallet and Cronos blockchain

The Cronos blockchain is supported by Crypto.com DeFi Wallet, Rabby, MetaMask, Trust Wallet and a number of other wallets such as those listed [here](https://web3-wallet.github.io/web3-wallet/wallets/metamask).

In order to facilitate the use of these wallets by Cronos dapp developers, we recommend the use of [Web3-Wallet](https://web3-wallet.github.io/web3-wallet/docs/getting-started), a npm library used by several major Cronos dapps.

This repository uses Cronos mainnet, and demonstrates the use of Web3-Wallet with a NextJS 13 application:

-   The `./app/chains.ts` and `./app/wallets.ts` serve as configuration files
-   If you need to read data from the blockchain, you also need to enter a blockchain URL which is going to support your rate of requests in the .env file, under `NEXT_PUBLIC_CRONOS_MAINNET_RPC_URL`.
-   The `./app/components/Navbar` demonstrates how the app manages the user's connection to their preferred wallet using a basic Modal interface (in this example, Crypto.com DeFi Wallet, Rabby / MetaMask, Trust Wallet, and Wallet Connect).
-   The `./app/components/ReadChain` demonstrates how to read information from the Cronos blockchain, such as the latest block number and the crypto asset balance of a user.
-   The `./app/components/WriteChain` demonstrates how to send a transaction to the Cronos blockchain (there are two examples: "send 1 CRO to myself" and "send 1 USDC to myself").

## How to interact with smart contracts?

-   Add your smart contract [ABI](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html) to `./contracts/abis/[contractName].json`.
-   See `./app/components/ReadChain` or `./app/components/WriteChain` for how to create a contract object and interact with your smart contract through the contract object.
