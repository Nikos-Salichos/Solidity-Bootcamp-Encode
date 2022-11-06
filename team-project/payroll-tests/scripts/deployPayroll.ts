import { ethers } from "hardhat";
import { tokenName, tokenSymbol, initialCapital, tokenRatioToEther } from "../payrollConstructor/arguments";

namespace DeployPayroll {
  async function main() {
    let Payroll = await ethers.getContractFactory("Payroll");

    let payroll = await Payroll.deploy(tokenName, tokenSymbol, initialCapital.toString(), tokenRatioToEther);
    await payroll.deployed();

    console.log("Payroll deployed successfully Address: ", payroll.address);
    console.log(`tokenName : ${tokenName}`);
    console.log(`tokenSymbol : ${tokenSymbol}`);
    console.log(`initialCapital : ${initialCapital}`);
    console.log(`tokenRatioToEther : ${tokenRatioToEther}`);
  }
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
