# upsi - chain

This repository contains the smart contract for the bachelor thesis "upsi - A decentralized STI tracing approach"

OST - Eastern Switzerland University of Applied Sciences  
Author: Laurin Zubler [laurin.zubler@ost.ch](mailto:laurin.zubler@ost.ch)  
Advisor: Dr. Thomas Bocek [thomas.bocek@ost.ch](mailto:thomas.bocek@ost.ch)

## Project Dashboard
The documentation as well as other useful links are published on the project dashboard:  
https://laurinzubler.github.io/ba-documentation/

## Hardhat
This project is using Hardhat for smart contract development.
- [Hardhat Website](https://hardhat.org/)
- [Hardhat Documentation](https://hardhat.org/docs)

## Local Setup
node.js: `20.13.1` 

### Install Dependencies
```shell
npm install
```

## Testing
### Compile Smart Contract
```shell
npx hardhat compile
```

### Start Hardhat Node
```shell
npx hardhat node
```

### Run Tests
```shell
npx hardhat test
```

## Deployment
### Configuration variables
```shell
npx hardhat vars set INFURA_API_KEY
npx hardhat vars set OPTIMISM_SEPOLIA_PRIVATE_KEY
npx hardhat vars set ETHERSCAN_OPTIMISM_KEY
```
More information: https://hardhat.org/hardhat-runner/docs/guides/configuration-variables

### Deploy Smart Contract 
```shell
npx hardhat ignition deploy ./ignition/modules/Upsi.js --network optimismSepolia
```

### Verify Smart Contract
```shell
npx hardhat verify --network optimismSepolia <CONTRACT_ADDRESS>
```