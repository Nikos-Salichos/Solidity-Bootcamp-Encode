import "./navbar.css";
import { useState } from "react";
import { ethers } from "ethers";
import { lotteryAddress } from "../../assets/lotteryAddress";

export default function Navbar() {
    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <h1>Group 8</h1>
                    <div className="navbar-link">
                        <a target="_blank" href="https://github.com/Nikos-Salichos/Encode-Solidity-Bootcamp-Weekend-Projects" className="link">Github</a>
                        <a target="_blank" href={`https://goerli.etherscan.io/address/${lotteryAddress}`} className="link">Etherscan</a>
                    </div>
                </div>
            </div>
        </>
    )
}