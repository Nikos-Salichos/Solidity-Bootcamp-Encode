import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function RemoveEmployee({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  return <div></div>;
}

export default RemoveEmployee;
