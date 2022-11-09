import { ethers } from 'ethers';
import React, { useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react';
import { payrollAddress } from '../../../assets/PayrollAddress';
import { payrollContract } from '../../../assets/PayrollContract';

function GiveBonus() {
    const [employeeAddress, setEmployeeAddress] = useState("");
    const [employeeBonus, setEmployeeBonus] = useState(0);
  
    const handleEmployeeAddress = (event: { target: { value: any } }) => {
      setEmployeeAddress(event.target.value);
    };
  
    const handleEmployeeBonus = (event: { target: { value: any } }) => {
      setEmployeeBonus(event.target.value);
    };

    async function giveBonus() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());

        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

        await payroll.payAnEmployee(employeeAddress, employeeBonus);
    }

    
    return (
        <>
            <div className="section">
                <div className="container-default">
                    <div className="inner-container-left">
                        <div className="header-container">
                                <h1>Give Bonus To Employee</h1>
                            </div>
                            <div className="input-container">
                                <h2>Employee Address</h2>
                                <Input type='text' placeholder='Employee Address' fluid>
                                    <input type="text" onChange={handleEmployeeAddress} value={employeeAddress} />
                                </Input>
                                <h2>Bonus Amount</h2>
                                <Input type='number' placeholder='Employee Salary' fluid>
                                    <input type="number" onChange={handleEmployeeBonus} value={employeeBonus} />
                                </Input>
                                <div className="buttons-container-single">
                                    <Button floated='left' icon labelPosition='left' color="green" size='big' onClick={giveBonus}>
                                        <Icon name='money' />
                                            Give Bonus
                                    </Button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GiveBonus;