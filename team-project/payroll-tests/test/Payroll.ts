import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tokenName, tokenSymbol } from "../payrollConstructor/arguments";
import { PayrollToken__factory } from "../typechain-types";

describe("Payroll", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPayrollFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, employee, funder] = await ethers.getSigners();

    const PaymentToken = await ethers.getContractFactory("PayrollToken");
    const paymentToken = await PaymentToken.deploy(tokenName, tokenSymbol);

    const Payroll = await ethers.getContractFactory("Payroll");
    Payroll.connect(owner);
    const initialCapital = 0;
    console.log(`initialCapital`, initialCapital);
    const payroll = await Payroll.deploy(tokenName, tokenSymbol, initialCapital.toString(), paymentToken.address);

    const receipt = await payroll.deployed();
    console.log(`Payroll contract deployed at ${receipt.address}`);

    return { paymentToken, payroll, initialCapital, owner, employee, funder };
  }

  describe("Deployment", function () {
    it("Should set the right arguments", async function () {
      const { paymentToken, payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);
      const tokenBalance = await payroll.tokenBalance();
      console.log(`Token balance ${tokenBalance}`);
      expect(tokenBalance).to.equal(initialCapital);
    });

    it("Should close company", async function () {
      // const { payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);
      // expect(await payroll.tokenBalance()).to.equal(0);
      // expect(await payroll.companyAcc()).to.equal(owner.address);
      // let paymentToken = await payroll.paymentToken();
      // expect(paymentToken).to.not.equal("0x0000000000000000000000000000000000000000");
      // console.log(`Payment Token ${paymentToken}`);
      // const payrollToken = PayrollToken__factory.connect(paymentToken, owner);
      // const shutDownCompany = await payroll.closeCompany();
      // console.log(`Closed company at hash ${shutDownCompany.hash}`);
      // const tokenBalanceOfOwner = await payrollToken.balanceOf(owner.address);
      // expect(tokenBalanceOfOwner).to.equal(initialCapital);
      // console.log(`Balance of company owner account ${owner.address} is ${tokenBalanceOfOwner} after company closed`);
    });
  });
});
