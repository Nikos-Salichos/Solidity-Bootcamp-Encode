import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function AddEmployee({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeSalary, setemployeeSalary] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");

  const handleEmployeeAddress = (event: { target: { value: any } }) => {
    setEmployeeAddress(event.target.value);
  };

  const handleEmployeeSalary = (event: { target: { value: any } }) => {
    setemployeeSalary(event.target.value);
  };

  async function addEmployeeAsync() {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const addEmployee = await payroll.addEmployee(employeeAddress, ethers.utils.parseEther(employeeSalary.toString()));
      const receipt = await addEmployee.wait();
      console.log(`receipt.transactionHash ${receipt.transactionHash}`);

      setEmployeeAddress("");
      setemployeeSalary(0);

      if (receipt.transactionHash !== "undefined") {
        setTransactionHash(receipt.transactionHash);
      } else {
        setTransactionHash("Transaction failed");
      }
    }
  }

 
}

export default AddEmployee;
