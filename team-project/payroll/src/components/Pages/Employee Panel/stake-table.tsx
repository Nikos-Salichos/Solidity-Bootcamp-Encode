import React from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { ethers } from "ethers";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { Link } from "react-router-dom";

class StakeTable extends React.Component <any, any> {
    constructor(props: any) {
        super(props);

        
    }

    render() {
        return (
            <Table celled compact definition style={{ minWidth: "1330px" }}>
                <Table.Header fullWidth>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Stake Amount</Table.HeaderCell>
                        <Table.HeaderCell>Receive Countdown</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
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