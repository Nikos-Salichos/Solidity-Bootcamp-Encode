import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function PayAnEmployee({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [employeeId, setEmployeeId] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleEmployeeId = (event: { target: { value: any } }) => {
    setEmployeeId(event.target.value);
  };

  async function payAnEmployeeAsync() {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const removeEmployee = await payroll.payAnEmployee(employeeId);
      const receipt = await removeEmployee.wait();
      console.log(`receipt.transactionHash ${receipt.transactionHash}`);

      setEmployeeId("");

      if (receipt.transactionHash !== "undefined") {
        setTransactionHash(receipt.transactionHash);
      } else {
        setTransactionHash("Transaction failed");
      }
    }
  }
  return (
    <div>
      <div>
        <p>Pay an employee</p>
        <input type="text" id="employeeId" name="employeeId" onChange={handleEmployeeId} value={employeeId} placeholder="Type an employee id" />
      </div>
      <button className="button" onClick={payAnEmployeeAsync}>
        Fund Company Account
      </button>
      <div>
        <b>Transaction Hash:</b> <p>{transactionHash}</p>
      </div>
    </div>
  );
}

export default PayAnEmployee;
