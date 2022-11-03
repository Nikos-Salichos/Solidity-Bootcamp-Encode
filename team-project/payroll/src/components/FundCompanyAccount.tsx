import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../assets/PayrollContract";
import { payrollAddress } from "../assets/PayrollAddress";

function FundCompanyAccount({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  const [fundAmount, setFundAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleFundAmount = (event: { target: { value: any } }) => {
    setFundAmount(event.target.value);
  };

  async function fundCompanyAccountAsync() {
    if (accounts[0] !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", signer.getAddress());

      const payroll = new ethers.Contract(payrollAddress, payrollContract.abi, signer);

      const options = { value: ethers.utils.parseEther("0") };
      const amount = ethers.utils.parseEther(fundAmount.toString());
      console.log(fundAmount);
      const fundCompanyAccount = await payroll.fundCompanyAccount(amount, options);
      const receipt = await fundCompanyAccount.wait();
      console.log(`receipt.transactionHash ${receipt.transactionHash}`);

      setFundAmount("");

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
        <p>Amount to fund company account</p>
        <input type="text" id="fundingAmount" name="fundingAmount" onChange={handleFundAmount} value={fundAmount} placeholder="Type an amount" />
      </div>
      <button className="button" onClick={fundCompanyAccountAsync}>
        Fund Company Account
      </button>
      <div>
        <b>Transaction Hash:</b> <p>{transactionHash}</p>
      </div>
    </div>
  );
}

export default FundCompanyAccount;
