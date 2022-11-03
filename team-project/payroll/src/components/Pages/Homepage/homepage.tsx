import React from "react";
import { ethers } from "ethers";
import "./homepage.css";
import {Button, Icon, Input, Label} from "semantic-ui-react";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { payrollContract } from "../../../assets/PayrollContract";

function Homepage() {
    const[amount, setAmount] = React.useState("");

    const handleFundAmount = (event: { target: { value: any } }) => {
        setAmount(event.target.value);
    };

    async function fund() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", signer.getAddress());
      
        const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);
        const amount_inEther = ethers.utils.parseEther(amount);

        const fund = await payroll.fundCompanyAccount({value: ethers.BigNumber.from(amount)});
        const receipt = await fund.wait();
        console.log(`fund.transactionHash ${receipt.transactionHash}`);
    }

    return (
        <>
            <div className="section">
            <div className="homepage">
                <div className="homepage-container">
                    <h1>Manage Your Company With Our <span>Payroll</span> Dapp</h1>
                    <div className="buttons-container">
                        <Button secondary size="huge">Get Started</Button>
                    </div>
                </div>
            </div>    
                    <div className="container-default">
                        <h1>Fund To Company Account</h1>
                        <div className="input-container">
                            <Input type='number' placeholder='Amount Of ETH' action>
                                <input type="number" onChange={handleFundAmount} value={amount} />
                                <Button onClick={fund} secondary type='submit'>Fund</Button>
                            </Input>
                        </div>
                    </div>  
            </div>     
        </>
    );
}

export default Homepage;