import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function AddEmployee({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeSalary, setemployeeSalary] = useState(0);
  const [transactionHash, setTransactionHash] = useState("");

 
}

export default AddEmployee;
