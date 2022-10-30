import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function PayEmployees({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [transactionHash, setTransactionHash] = useState("");

  async function payEmployeesAsync() {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const removeEmployee = await payroll.payEmployees();
      const receipt = await removeEmployee.wait();
      console.log(`receipt.transactionHash ${receipt.transactionHash}`);

      if (receipt.transactionHash !== "undefined") {
        setTransactionHash(receipt.transactionHash);
      } else {
        setTransactionHash("Transaction failed");
      }
    }
  }
  return (
    <div>
      <button className="button" onClick={payEmployeesAsync}>
        Pay Employees
      </button>
      <div>
        <b>Transaction Hash:</b> <p>{transactionHash}</p>
      </div>
    </div>
  );
}

export default PayEmployees;
