# Decentralized Dead Man's Switch

## Project Description

This project is an implementation of a [dead man's switch](https://en.wikipedia.org/wiki/Dead_man%27s_switch) on the blockchain. Because this very simple can be uploaded to IPFS and the template contract can be used over and over it theoretically can never be censored. The flow of how this should of been used (**please don't use this, will cover it down below**) is as follows: 

- Upload your encrypted files somewhere public and distribute it to as many people as possible. Uploading to IPFS would be preferable since it is a more permanent and decentralized way of storing files.
- Deploy the Dead Man's Switch contract with the decryption key and cadence of when the switch should be checked up on. The decryption key is not visible until the switch activates.
- The switch only activates if the you haven't checked in on it in time.
- Once activated, anyone will able to see the decryption phrase.
Keep note of the address of the smart contract. You will need this in order to interact with the contract using this website, otherwise you can look at your transactions and find the contract again that way.

The purpose of this project was to explore Web3 developement from top to bottom. My goal was to to make my very first smart contract from the start, get more React experience, writing tests for smart contract interactions and explore the AntD design library. Coming back to this project months later with a lot more Web3 developement experience has taught me the different holes of this design.

## *Everything on the blockchain is public*

Just because something is declared as *private*, atleast in contracts deployed on EVM chains to my knowledge, does not mean that they are actually private. The contract's storage is stored on the blockchain and therefore is able to be read if you know the [storage slot](https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-12-reading-the-storage/topic/reading-the-ethereum-storage/). This can trivally be done with a library like web3js or ethersjs. Furthermore, the [construction arguements are public](https://github.com/BoxedFruits/dead-mans-switch/blob/master/dead-mans-switch-contracts/contracts/DeadMansContract.sol#L15). Someone would easily be able to read the description key with a block explorer.

![Screenshot 2022-08-10 143919](https://user-images.githubusercontent.com/34636700/183991439-354aaebe-6e6c-485b-8f84-9d13272708dc.png)
![Screenshot 2022-08-10 144233](https://user-images.githubusercontent.com/34636700/183995061-1f48be78-a763-4ac9-aa52-ef84313aa289.png)

