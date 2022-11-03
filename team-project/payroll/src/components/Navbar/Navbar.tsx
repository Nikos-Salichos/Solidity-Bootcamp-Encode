import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Card } from "semantic-ui-react";
import jazzicon from "../../assets/jazzicon.png";
import "./Navbar.css";
import { payrollAddress } from "../../assets/PayrollAddress";
import { payrollContract } from "../../assets/PayrollContract";
import { Link } from "react-router-dom";

function Navbar() {
  const [accounts, setAccounts] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [companyAcc, setCompanyAcc] = useState("");
  const [ownerMatch, setOwnerMatch] = useState(false);
  const [employeeMatch, setEmployeeMatch] = useState(false);

  async function Connect() {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get Metamask!");
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      setAccounts(account);
      await isOwner(account);
      await isEmployee(account);
      console.log("Found an authorized account:", account);
    } else {
      console.log("No authorized account found");
    }
  }

  async function isOwner(string: string) {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const owner = await payroll.companyAcc();
      console.log("Owner:", owner);
      setCompanyAcc(owner);

      console.log("Account:", string);

      if (owner.toLowerCase() === string) {
        console.log("You're the owner of the contract");
        setOwnerMatch(true);
      } else {
        console.log("You are not the owner of this contract");
        setOwnerMatch(false);
      }
    }
  }

  async function isEmployee(string: string) {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      let employee = await payroll.isEmployee(string);

      if (employee) {
        console.log("You are an employee");
        setEmployeeMatch(true);
      } else {
        console.log("You are not an employee");
        setEmployeeMatch(false);
      }
    }
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-container">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <h1>N&E</h1>
          </Link>
          <div className="navbar-link">
            {ownerMatch === false ? (
              <a></a>
            ) : (
              // Redirect to the Admin Panel Page
              <Link to="admin-panel" style={{ textDecoration: "none", color: "black" }}>
                <a>Admin Panel</a>
              </Link>
            )}
            {employeeMatch === false ? (
              <a></a>
            ) : (
              // Redirect to the Employee Page
              <Link to="employee-panel" style={{ textDecoration: "none", color: "black" }}>
                <a>Employee</a>
              </Link>
            )}
            <a target="_blank" href={`https://goerli.etherscan.io/`} className="link">
              Etherscan
            </a>
            {accounts === "" ? (
              <div className="button-container">
                <Button size="large" fluid color="green" onClick={Connect} className="link">
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="wallet-connected">
                <img src={jazzicon}></img>
                <p>{accounts && `${accounts.slice(0, 6)}...${accounts.slice(accounts.length - 4, accounts.length)}`}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
