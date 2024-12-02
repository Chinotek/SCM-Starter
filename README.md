# Dice Game Next/Hardhat Project

This repo is a fork of [SCM-Starter](https://github.com/MetacrafterChris/SCM-Starter) from MetaCrafters

## Mechanics
- A user and the dealer will role a die and whoever scores a higher number wins. Winning doubles the balance while losing halfs the balance.

## Setup
1. Install dependencies with
  ```bash
  npm i
  ```
2. Start a hardhat node on another terminal
  ```bash
  npx hardhat node
  ```
> [!NOTE]
> Keep in mind the `address` that displays and the `private key` of `Account #0` when it is run, those will be used to setup Metamask

> Started HTTP and WebSocket JSON-RPC server at `http://127.0.0.1:8545/`
    
> Private Key: `0x********************`

3. Deploy the contract on another terminal
  ```bash
  npx hardhat run --network localhost scripts/deploy.js
  ```
4. Start the website at http://localhost:3000
  ```bash
  npm run dev
  ```
5. Install Metamask wallet and setup an account
- Add a new account by importing one using the private key of `Account #0`
> [!NOTE]
> you may need to setup an initial new account first before you can import a new one
6. Add a network manually in Metamask
- On the settings page of the metamask extension, add a network manually and fill up the following fields

  `Network name`: (any)
  
  `New RPC URL`: http://127.0.0.1:8545/
  
  `Chain ID`: 31337
  
  `Currency symbol`: ETH or GO

> [!IMPORTANT]
> Make sure the imported account is selected in the Metamask extension when pressing the connect wallet button on the webstie

> [!TIP]
> When getting a nonce error or an error when connecting the wallet or performing a transaction, try clearing the activity tab data in the metamask extension and refresh the website page,
> Metamask Extension > three dots on the top right > Settings > Advanced > Clear activity tab data
