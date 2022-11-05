import React, { Component } from "react";
import { ethers } from "ethers";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { Button, Icon, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

class EmployeeTable extends Component<any , any> {
    constructor(props: any) {
        super(props);

        this.state = {
            employees: [],
            employeesLength: 0,
        };
    }

    async componentDidMount() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);
        const employeesLength = await payroll.totalEmployees();
        const employees = await payroll.getEmployees();

        this.setState({ employees: employees,  employeesLength: employeesLength.toString()});


    }

    async removeEmployee(address: string) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const removeEmployee = await payroll.removeEmployee(address);

        const receipt = await removeEmployee.wait();
        console.log(receipt);
    }

    renderRow() {
        return this.state.employees.map((employee: any, index: any) => {
            return (
                <Table.Row key={index}>
                    <Table.Cell>{index}</Table.Cell>
                    <Table.Cell>{employee[0].toString()}</Table.Cell>
                    <Table.Cell>{employee[1].toString()}</Table.Cell>
                    <Table.Cell>{employee[2].toString()}</Table.Cell>
                    <Table.Cell>{employee[3].toString()}</Table.Cell>
                    <Table.Cell>
                        <Button floated='right' icon labelPosition='left' color="red" size='small' onClick={() => this.removeEmployee(employee[0].toString())}>
                            <Icon name='edit' />
                                Remove Employee
                        </Button>
                    </Table.Cell>
                </Table.Row>
            );
        });
    }


    render() {
        return (
            <Table celled compact definition style={{ minWidth: "1330px" }}>
                                <Table.Header fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Adress</Table.HeaderCell>
                                    <Table.HeaderCell>Salary</Table.HeaderCell>
                                    <Table.HeaderCell>Last Payment</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Count</Table.HeaderCell>
                                    <Table.HeaderCell>Remove Employee</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.renderRow()}
                                </Table.Body>
                                <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='6'>
                                    <Link to="/add-employee">
                                        <Button
                                            floated='right'
                                            icon
                                            labelPosition='left'
                                            primary
                                            size='big'
                                        >
                                            <Icon name='user' /> Add An Employee
                                        </Button>
                                    </Link>
                                    </Table.HeaderCell>
                                </Table.Row>
                                </Table.Footer>
                            </Table>
        );
    }
}


export default EmployeeTable;