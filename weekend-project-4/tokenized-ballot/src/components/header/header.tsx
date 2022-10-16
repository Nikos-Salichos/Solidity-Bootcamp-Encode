import "./header.css";
import { useState } from "react";
import { ethers } from "ethers";

export default function Header() {
    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <h1>Group 8</h1>
                    <div className="navbar-link">
                        <a target="_blank" href="https://github.com/Nikos-Salichos/Encode-Solidity-Bootcamp-Weekend-Projects" className="link">Github</a>
                        <a target="_blank" href="https://goerli.etherscan.io/address/0x87386a22b91612902F84294186fb477cd2fF16bb" className="link">Etherscan</a>
                    </div>
                </div>
            </div>
        </>
    )
}