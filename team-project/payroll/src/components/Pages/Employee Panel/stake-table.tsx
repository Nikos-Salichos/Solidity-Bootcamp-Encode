import React from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { ethers } from "ethers";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { Link } from "react-router-dom";

class StakeTable extends React.Component <any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            stakes: [],
        }
    }

    async componentDidMount() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const accounts = await provider.listAccounts();
        const account = accounts[0];
        console.log(account);

        const stakesCall = await payroll.connect(account).getEmployeeStakes();
        console.log(stakesCall)

        this.setState({ stakes: stakesCall });
    }

    async unstake(id: number) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const unstake = await payroll.unstake(id);

        const receipt = await unstake.wait();
        console.log(receipt);
    }

    renderRow() {
        return this.state.stakes.map((stake: any, index: any) => {
            const unixTime = stake[2];
            const date = new Date(unixTime*1000);
            return (
                <Table.Row key={index}>
                    {stake[3] == 0 ? null : (<><Table.Cell>{stake[0].toString()}</Table.Cell><Table.Cell>{stake[3].toString()} ETH</Table.Cell><Table.Cell>{unixTime == 0 ? 0 : (date.toUTCString())}</Table.Cell><Table.Cell>{stake[4].toString()}</Table.Cell><Table.Cell>
                        <Button fluid floated='left' icon labelPosition='left' color="red" size='small' onClick={() => this.unstake(stake[0].toString())}>
                            <Icon name='trash' />
                            Unstake
                        </Button>
                    </Table.Cell></>)}
                </Table.Row>
            );
        });
    }

    render() {
        return (
            <Table celled compact definition style={{ minWidth: "1330px" }}>
                <Table.Header fullWidth>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Stake Amount</Table.HeaderCell>
                        <Table.HeaderCell>Creation Date</Table.HeaderCell>
                        <Table.HeaderCell>Open Status</Table.HeaderCell>
                        <Table.HeaderCell>Unstake</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.renderRow()}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Link to="/stake">
                                <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    color="green"
                                    size='big'
                                    >
                                    <Icon name='money' /> Stake
                                </Button>
                            </Link>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        )
    }
}

export default StakeTable;