import { Modal, Button, Space, Input, Spin, Typography, Divider, Tooltip } from 'antd';
import React from 'react';
import DeadMansContract from '../utils/DeadMansContract.abi.json';
import { ethers } from "ethers";
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 92, width: 100 }} spin />;
const { Text, Paragraph } = Typography;

class ContractInteraction extends React.Component {

    constructor() {
        super();
        this.state = {
            active: false,
            url: "",
            decryptionKey: "",
            nextTimeStamp: "",
            pendingTx: false,
            showTickText: false,
            showGetDecryptionText: false,
            isModalRenounceVisible: false,
            isModalDefuseVisible: false
        };
    }

    initContract = () => {
        if (this.state.contract == undefined) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(this.props.address, DeadMansContract.abi, signer);
            this.setState({ contract: contract });
            return contract;
        } else {
            return this.state.contract;
        }
    }

    isActive = async () => {
        try {
            const tx = await this.initContract().isActive();

            this.setState({ pendingTx: false, active: tx });
        } catch (e) {
            setTimeout(() => {
                // For some reason when this compontent init's this function doesn't properly execute when initing the contract. This is a temp fix
                this.isActive();
            }, 100);
        }
    };

    tick = async () => {
        try {
            const tx = await this.initContract().tick();

            this.setState({ pendingTx: true });

            await tx.wait();
            this.setState({ pendingTx: false })
            this.getNextTimeStamp();
        } catch (e) {
            console.log(e);
        }
    };

    getNextTimeStamp = async () => {
        try {
            const tx = await this.initContract().getNextTimeStamp();
            this.setState({ pendingTx: false, nextTimeStamp: Date(parseInt(BigInt(tx))).toString() });
        } catch (e) {

        }
    }

    setUrl = async () => {
        try {
            const newUrl = document.getElementById("setUrl").value;
            const tx = await this.initContract().setUrl(newUrl);

            this.setState({ pendingTx: true });
            await tx.wait();
            this.setState({ pendingTx: false });
            this.getUrl();
        } catch (e) {
            console.log(e);
        }
    };

    getUrl = async () => {
        try {
            const tx = await this.initContract().getUrl();
            this.setState({ pendingTx: true });

            this.setState({ pendingTx: false, url: tx });
        } catch (e) {
            console.log(e);
        }
    };

    getDecryptionKey = async () => {
        try {
            const tx = await this.initContract().getDecryptionKey();

            await tx.wait();
            this.setState({ showDecryptionKeyText: true, decryptionKey: tx });
        } catch (e) {
            this.setState({ showDecryptionKeyText: true, decryptionKey: "The switch has not been activated yet" });
        }
    };

    renounceOwnershipModal = () => {
        this.setState({ isModalRenounceVisible: true });
    }

    renounceOwnership = async () => {
        const tx = await this.initContract().renounceOwnership();

        await tx.wait();
        this.handleRenounceCancel();
    };

    handleRenounceCancel = () => {
        this.setState({ isModalRenounceVisible: false });
    };

    defuse = async () => {
        const tx = await this.initContract().defuse();

        await tx.wait();
        this.getNextTimeStamp();
        this.isActive();
        this.handleDefuseCancel();
    };

    defuseModal = () => {
        this.setState({ isModalDefuseVisible: true });
    }

    handleDefuseCancel = () => {
        this.setState({ isModalDefuseVisible: false });
    }

    async componentDidMount() {
        try {
            await this.isActive();
            await this.getUrl();
            await this.getNextTimeStamp();
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        // Add error message if user denies transactions
        return (
            <div>
                {/* Give more emphasis to this */}
                <Divider plain>Interact with Smart Contract</Divider>
                <Paragraph>Contract Address: <Text underline>{this.props.address}</Text></Paragraph>
                {this.state.pendingTx ? <Spin indicator={antIcon} style={{ width: "100%", marginTop: "4rem" }} /> : (
                    <Space direction="vertical">

                        <Paragraph>Status of switch: <Text underline>{this.state.active === true ? "still " : "not "} being monitored. </Text></Paragraph>
                        <Paragraph>Next timestamp: <Text underline>{this.state.nextTimeStamp}</Text></Paragraph>
                        <Paragraph>URL to file: <Text underline>{this.state.url === "" ? "There was no URL set or was left blank" : this.state.url}</Text></Paragraph>

                        <Tooltip title="Update the switch by updating the next timestamp of when the switch should activate">
                            <Button onClick={this.tick}>Check on Switch</Button>
                        </Tooltip>
                        <Tooltip title="Defuse the dead man's switch">
                            <Button onClick={this.defuse}>Defuse</Button>
                        </Tooltip>
                        <Tooltip title="Change the owner of the contract to 0x0. You will no longer be able to interact with the contract and will activate if not already defused">
                            <Button onClick={this.renounceOwnershipModal}>Renounce Ownership</Button>
                        </Tooltip>

                        <Tooltip title="Set the URL of the encrypted file">
                            <Button onClick={this.setUrl}>Set Url</Button>
                        </Tooltip>
                        <Input size="large" id="setUrl" />

                        <Button onClick={this.getDecryptionKey}>Reveal Decryption Key</Button>
                        {this.state.showDecryptionKeyText && <Paragraph>{this.state.decryptionKey}</Paragraph>}
                    </Space>
                )}

                <Modal id="renounce" title="Are you sure?" visible={this.state.isModalRenounceVisible}
                    footer={[
                        <Button key="back" onClick={this.handleRenounceCancel}>Cancel</Button>,
                        <Button key="submit" onClick={this.renounceOwnership}>Renounce Ownership</Button>
                    ]}>
                    <Paragraph>Renouncing the ownership of the Dead Man's Switch means that if not defused, there is no stopping the switch from activating.</Paragraph>
                    <Paragraph>This action is is irreversible.</Paragraph>
                </Modal>

                <Modal id="defuse" title="Are you sure?" visible={this.state.isModalDefuseVisible}
                    footer={[
                        <Button key="back" onClick={this.defuse} >Cancel</Button>,
                        <Button key="submit" onClick={this.handleDefuseCancel}>Defuse</Button>
                    ]}>
                    <Paragraph>Defusing the Dead Man's Switch means that the danger has passed and the use of the switch is no longer needed. The decryption key
                        will not be revealed and you will no longer need to check on the switch.</Paragraph>
                    <Paragraph>This action is is irreversible.</Paragraph>
                </Modal>
            </div>
        );
    };
}

export default ContractInteraction;