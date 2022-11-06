import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import StakeTable from "./stake-table";
import { payrollTokenContract } from "../../../assets/PayrollTokenContract";

function EmployeePanel() {
    const [employeeAcc, setEmployeeAcc] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState("");
    const [employeeLastPayment, setEmployeeLastPayment] = useState("");
    const [employeePaymentCount, setEmployeePaymentCount] = useState("");
    const [employeeBalance, setEmployeeBalance] = useState("");
    const [stakeCount, setStakeCount] = useState("");

    async function readTheContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const accounts = await provider.listAccounts();
        const account = accounts[0];

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);
        const payrollTokenAddress = await payroll.paymentToken();

        const payrollToken = new ethers.Contract(payrollTokenAddress, payrollTokenContract.abi, signer);
        
        const isEmployee = await payroll.isEmployee(account);
        
        if (isEmployee) {
            setEmployeeAcc(account);
            console.log("You are an employee");

            const employee = await payroll.getEmployee(account);

            const salary = await employee[1];
            setEmployeeSalary(salary.toString() + " ETH");

            const lastPayment = await employee[2];
            const unixTime = lastPayment;
            const date = new Date(unixTime*1000);
            setEmployeeLastPayment(date.toUTCString());

            const paymentCount = await employee[3];
            setEmployeePaymentCount(paymentCount.toString());

            const balance = await payrollToken.balanceOf(account);
            setEmployeeBalance(balance.toString() + " ETH");

            const stakes = await payroll.getEmployeeStakes();
            setStakeCount(stakes.length.toString());
        }
        else {
            console.log("You are not an employee");
        }
    }

    async function claim() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const accounts = await provider.listAccounts();
        const account = accounts[0];

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const isEmployee = await payroll.isEmployee(account);

        if (isEmployee) {
            const claim = await payroll.claim();
            const receipt = await claim.wait();
            console.log(`claim.transactionHash ${receipt.transactionHash}`);
        }
        else {
            console.log("You are not an employee");
        }
    }

    return (
        <>
            <div className="employee-panel">
                <div className="section">
                    <div className="container-default">
                        <div className="header-container">
                            <h1>Employee Panel</h1>
                            <div className="buttons-container">
                                <Button size="big" onClick={readTheContract}>Read The Contract</Button>
                                <Button size="big" secondary onClick={claim}>Claim</Button>
                            </div>
                        </div>
                        <div className="inner-container">
                            <div className="inner-container-left">
                                <div className="inner-container-left-header">
                                    <h3>Employee Account Address</h3>
                                    <p>{employeeAcc}</p>
                                    <h3>Last Payment Time</h3>
                                    <p>{employeeLastPayment}</p>
                                    <h3>Balance</h3>
                                    <p>{employeeBalance}</p>
                                </div>
                            </div>
                            <div className="inner-container-right">
                                <div className="inner-container-right-header">
                                    <h3>Employee Salary</h3>
                                    <p>{employeeSalary}</p>
                                    <h3>Payment Count</h3>
                                    <p>{employeePaymentCount}</p>
                                    <h3>Stake Count</h3>
                                    <p>{stakeCount}</p>
                                </div>
                            </div>
                        </div>
                        <StakeTable />
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeePanel;