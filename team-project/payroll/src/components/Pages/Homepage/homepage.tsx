import React from "react";
import { ethers } from "ethers";
import "./homepage.css";
import {Button, Icon, Input, Label} from "semantic-ui-react";
import { payrollAddress } from "../../../assets/PayrollAddress";
import { payrollContract } from "../../../assets/PayrollContract";

function Homepage() {
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
            </div>     
        </>
    );
}

export default Homepage;