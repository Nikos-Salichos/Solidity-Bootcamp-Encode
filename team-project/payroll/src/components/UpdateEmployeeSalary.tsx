import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function UpdateEmployeeSalary({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeNewSalary, setEmployeeNewSalary] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");

  const handleEmployeeAddress = (event: { target: { value: any } }) => {
    setEmployeeAddress(event.target.value);
  };

  const handleEmployeeNewSalary = (event: { target: { value: any } }) => {
    setEmployeeNewSalary(event.target.value);
  };

  async function updateEmployeeSalaryAsync() {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const removeEmployee = await payroll.updateEmployeeSalary(employeeAddress, employeeNewSalary);
      const receipt = await removeEmployee.wait();
      console.log(`receipt.transactionHash ${receipt.transactionHash}`);

      setEmployeeAddress("");
      setEmployeeNewSalary(0);

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
        <p>Update an employee salary</p>
        <input type="text" id="employeeAddress" name="employeeAddress" onChange={handleEmployeeAddress} value={employeeAddress} placeholder="Type employee address" />
        <input type="text" id="employeeSalary" name="employeeSalary" onChange={handleEmployeeNewSalary} value={employeeNewSalary} />
      </div>
      <button className="button" onClick={updateEmployeeSalaryAsync}>
        Update Employee Salary
      </button>
      <div>
        <b>Transaction Hash:</b> <p>{transactionHash}</p>
      </div>
    </div>
  );
}

export default UpdateEmployeeSalary;
