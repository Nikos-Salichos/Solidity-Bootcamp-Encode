import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { Button, Icon, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

function AdminPanel() {
    const [companyAcc, setCompanyAcc] = useState("");
    const [totalEmployees, setTotalEmployees] = useState("");
    const [totalSalaries, setTotalSalaries] = useState("");
    const [employees, setEmployees] = useState([]);
    const [tokenBalance, setTokenBalance] = useState("");
    const [totalPayments, setTotalPayments] = useState("");

    async function readTheContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const companyAcc = await payroll.companyAcc();
        setCompanyAcc(companyAcc);

        const totalEmployees = await payroll.totalEmployees();
        setTotalEmployees(totalEmployees.toString());

        const totalSalaries = await payroll.totalSalaries();
        setTotalSalaries(totalSalaries.toString());

        const totalPayments = await payroll.totalPayments();
        setTotalPayments(totalPayments.toString());

        const getEmployees = await payroll.getEmployees();
        setEmployees(getEmployees.map((key: string, index: string) => index + ")" + key + " "));

        const tokenBalance = await payroll.tokenBalance();
        setTokenBalance(tokenBalance.toString() + " wei");
    }

    async function payAllEmployees() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);
        const payAll = await payroll.payAll();
        console.log("Paid all employees");
    }
    return (
        <>
            <div className="admin-panel">
                <div className="section">
                    <div className="container-default">
                        <div className="header-container">
                            <h1>Admin Panel</h1>
                            <div className="buttons-container">
                                <Button size="big" onClick={readTheContract}>Read The Contract</Button>
                            </div>
                        </div>
                        <div className="inner-container">
                            <div className="inner-container-left">
                                <div className="inner-container-left-header">
                                    <h3>Company Account Address</h3>
                                    <p>{companyAcc}</p>
                                    <h3>Token Balance</h3>
                                    <p>{tokenBalance}</p>
                                    <h3>Total Employee Amount</h3>
                                    <p>{totalEmployees}</p>
                                </div>
                            </div>
                            <div className="inner-container-right">
                                <div className="inner-container-right-header">
                                    <h3>Payroll Contract Address</h3>
                                    <p>{payrollAddress}</p>
                                    <h3>Total Salaries</h3>
                                    <p>{totalSalaries}</p>
                                    <h3>Total Payments</h3>
                                    <p>{totalPayments}</p>
                                </div>
                            </div>
                        </div>
                        <div className="inner-container">
                            <div className="employees-list">
                            <h2>Employees List</h2>
                            <Table celled compact definition>
                                <Table.Header fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell>ID</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Adress</Table.HeaderCell>
                                    <Table.HeaderCell>Salary</Table.HeaderCell>
                                    <Table.HeaderCell>Last Payment</Table.HeaderCell>
                                    <Table.HeaderCell>Payment Count</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                <Table.Row>
                                    <Table.Cell>0</Table.Cell>
                                    <Table.Cell>0x4aA8A5b66a16108894D086ab942B249cE8e85387</Table.Cell>
                                    <Table.Cell>1000 NET</Table.Cell>
                                    <Table.Cell>No</Table.Cell>
                                    <Table.Cell>No</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jamie Harington</Table.Cell>
                                    <Table.Cell>January 11, 2014</Table.Cell>
                                    <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
                                    <Table.Cell>Yes</Table.Cell>
                                    <Table.Cell>Yes</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Jill Lewis</Table.Cell>
                                    <Table.Cell>May 11, 2014</Table.Cell>
                                    <Table.Cell>jilsewris22@yahoo.com</Table.Cell>
                                    <Table.Cell>Yes</Table.Cell>
                                    <Table.Cell>No</Table.Cell>
                                </Table.Row>
                                </Table.Body>

                                <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5'>
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPanel;
