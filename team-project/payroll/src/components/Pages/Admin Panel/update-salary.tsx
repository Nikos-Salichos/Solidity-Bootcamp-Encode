import { ethers } from 'ethers';
import React, { useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react';
import { payrollAddress } from '../../../assets/PayrollAddress';
import { payrollContract } from '../../../assets/PayrollContract';

function UpdateEmployeeSalary() {
    const [employeeAddress, setEmployeeAddress] = useState("");
    const [employeeSalary, setemployeeSalary] = useState(0);
    const [transactionHash, setTransactionHash] = useState("");
  
    const handleEmployeeAddress = (event: { target: { value: any } }) => {
      setEmployeeAddress(event.target.value);
    };
  
    const handleEmployeeSalary = (event: { target: { value: any } }) => {
      setemployeeSalary(event.target.value);
    };

    async function updateEmployeeSalary() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        const updateEmployeeSalary = await payroll.updateEmployeeSalary(employeeAddress, employeeSalary);

        const receipt = await updateEmployeeSalary.wait();
        console.log(receipt);
    }

    
    return (
        <>
            <div className="section">
                <div className="container-default">
                    <div className="inner-container-left">
                        <div className="header-container">
                                <h1>Update Employee Salary</h1>
                            </div>
                            <div className="input-container">
                                <h2>Employee Address</h2>
                                <Input type='text' placeholder='Employee Address' fluid>
                                    <input type="text" onChange={handleEmployeeAddress} value={employeeAddress} />
                                </Input>
                                <h2>Employee Salary</h2>
                                <Input type='number' placeholder='Employee Salary' fluid>
                                    <input type="number" onChange={handleEmployeeSalary} value={employeeSalary} />
                                </Input>
                                <div className="buttons-container-single">
                                    <Button floated='left' icon labelPosition='left' color="yellow" size='big' onClick={updateEmployeeSalary}>
                                        <Icon name='edit' />
                                            Update Salary
                                    </Button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateEmployeeSalary;