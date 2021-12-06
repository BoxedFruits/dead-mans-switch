import DeadMansContract from '../utils/DeadMansContract.abi.json';
import { ethers, ContractFactory } from "ethers";
import { useState } from 'react';

import { Collapse, Button, Input, Typography, Divider, Spin } from 'antd';
import "antd/dist/antd.css";
import { LoadingOutlined } from '@ant-design/icons';
import ContractInteraction from './contractInteraction';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 92, width: 100 }} spin />;

function ContractSetup() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState();
    const [contractExists, setContractExists] = useState();
    const [contractAddress, setContractAddress] = useState();

    const connectWallet = async() => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("This app only works with MetaMask for now!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    const createContract = async() => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner();
                const decryptionKey = document.getElementById("decryptionKey").value;
                const cadence = document.getElementById("cadence").value;

                const factory = new ContractFactory(DeadMansContract.abi, DeadMansContract.bytecode, signer);

                const contract = await factory.deploy(decryptionKey, cadence);
                console.log("Transaction sent");
                setIsLoading(true);

                await contract.deployTransaction.wait().then(() => { // refactor to use async await
                    console.log(contract.address);
                    setIsLoading(false);
                    setContractExists(true);
                    setContractAddress(contract.address);
                });

            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getContract = () => {
        // Error if not the correct address
        const _contractAddress = document.getElementById("contractAddress").value;
        setContractAddress(_contractAddress);
        setContractExists(true);
    }

    return (
        <div>
            <Title style={{fontSize:"56px"}}>Dead Man's Switch</Title>
            {
                !currentAccount ? (
                    <Button size="large" style={{marginBottom: "24px"}} onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                ) : <Title level={2}><Text underline>Currently connected as: {currentAccount}</Text></Title>
            }

            <Title level={2} style={{marginTop: "2rem", marginBottom: "1.5rem"}}>What is a Dead Man's Switch?</Title>
            <Paragraph>
                A Dead Man's Switch is a switch that is designed to be activated or deactivated if the human operator becomes incapcitated such as through death, loss of consciousness,
                or being bodily removed from control. Originally applied to switches on a vehicle or machine, it has since come to be used to describe other intangible uses, as in computer software. &nbsp;
                <a href="https://en.wikipedia.org/wiki/Dead_man%27s_switch" target="_blank">
                    Source: Wikipedia (Dead Man's Switch)
                </a>
            </Paragraph>
            <Paragraph style={{marginBottom: "4rem"}}>
                This implementation of a Dead Man's Switch has two parts to it. The file/information that is being used as a contigency to ensure a person's safety and the smart contract which
                lives on the blockchain that has the decrption key to that file.
            </Paragraph>

            {
                isLoading ?
                    <Spin indicator={antIcon} style={{ width: "100%", marginTop: "4rem" }} /> :
                    (
                        <div>
                            {contractExists ? <ContractInteraction address={contractAddress} /> : (
                                <div className="inputs">
                                    <Divider plain>Check on deployed Dead Man's Switch</Divider>
                                    <div>
                                        <Input size="large" id="contractAddress" placeholder="Address of contract"></Input>
                                        <Button style={{ marginTop: "2rem" }} onClick={getContract}>Get Contract</Button>
                                    </div>

                                    <Divider plain>Deploy a new Dead Man's Switch</Divider>
                                    <div>
                                        <Input size="large" id="decryptionKey" placeholder="Decryption Key"></Input>
                                        <Input style={{ marginTop: "1.25rem" }} size="large" id="cadence" placeholder="When to check in hours" max="168"></Input>
                                        <Button style={{ marginTop: "2rem" }} onClick={createContract}>Create Dead Man's Switch</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
            }

            <div style={{ marginTop: "6rem" }}>
                <Title level={5}>Frequently Asked Questions</Title>
                <Collapse>
                    <Panel header="How it works">
                        This should be used a contingency if your life or reputation is in danger.
                        <Paragraph style={{marginTop: ".5rem"}}>
                            Prerequisites: <a href="https://www.youtube.com/watch?v=MfkqgXNPiHg" target="_blank">How to start using Metamask</a>
                        </Paragraph>

                        <ul style={{ marginTop: "1rem" }}>
                            <li>Upload your encrypted files somewhere public and distribute it to as many people as possible. Uploading to IPFS *link to IPFS* would be preferable since it is a more permanent and decentralized way of storing files.</li>
                            <li>Deploy the Dead Man's Switch contract with the decryption key and cadence of when the switch should be checked up on. The decryption key is not visible until the switch activates.</li>
                            <li>The switch only activates if the you haven't checked in on it in time.</li>
                            <li>Once activated, anyone will able to see the decryption phrase.</li>
                            <li>Keep note of the address of the smart contract. You will need this in order to interact with the contract using this website, otherwise you can look at your transactions and find the contract again that way.</li>
                        </ul>
                    </Panel>
                    <Panel header="Why is the Ethereuem Blockchain perfect for this?"><p>
                        Blockchains are (usually) open and immutable. Or in other words, transactions on a public blockchain are available for anyone to see and are permanent. On Ethereum, you can also
                        store logic for transactions by interacting with Smart Contracts *href to smart contracts*. Smart Contracts are very similar to programs, only that they run on and use the Ethereum Blockchain for data.
                        That means that you can store a limited amount of data in a Smart Contract.

                        Once this smart contract is deployed, there is no stopping it unless the deployer of the contract loses control of their wallet, in which case it was already probably too late for them.
                        If the switch activates, then *anyone* will be able to decrypt and view the information that the deployer wanted to use as contigency for their safety.
                    </p></Panel>
                    <Panel header="Does it cost anything?"><p>Nope. Only gas for transactions.</p></Panel>
                </Collapse>
            </div>
        </div>
    );
}

export default ContractSetup;
