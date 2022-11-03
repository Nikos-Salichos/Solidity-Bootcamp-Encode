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

      const companyAcc = await payroll.companyAcc();
      console.log(`Company account ${companyAcc}`);
      expect(companyAcc).to.equal(owner.address);

      const deployedToken = await payroll.paymentToken();
      expect(paymentToken.address).to.equal(deployedToken);
      console.log(`paymentToken address`, paymentToken.address);
    });

    it("Should add 1 employee, check employee details, pay employees,  update his salary ,fund company account, pay him the new salary then remove him", async function () {
      const { paymentToken, payroll, initialCapital, owner, employee } = await loadFixture(deployPayrollFixture);
      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);
      console.log(`1 employee added at hash ${addEmployee.hash} with payment address ${employee.address} and salary ${employeeSalary}`);

      let totalEmployees = await payroll.totalEmployees();
      expect(totalEmployees).to.equal(1);
      console.log(`Total Employees ${totalEmployees}`);

      const getEmployees = await payroll.getEmployees();
      expect(getEmployees[0][0]).to.equal(employee.address);
      console.log(`Employee payment address ${getEmployees[0][0]}`);
      expect(getEmployees[0][1]).to.equal(employeeSalary);
      console.log(`Employee salary ${getEmployees[0][1]}`);
      expect(getEmployees[0][2]).to.equal(0);
      console.log(`Employee Last payment ${getEmployees[0][2]}`);
      expect(getEmployees[0][3]).to.equal(0);
      console.log(`Employee payment count ${getEmployees[0][3]}`);

      let newSalary = employeeSalary;
      const fundCompanyAccount = await payroll.connect(owner).fundCompanyAccount(newSalary);
      console.log(`Company account has been funded with ${newSalary} at hash ${fundCompanyAccount.hash}`);
      expect(await payroll.tokenBalance()).to.equal(newSalary.toString());

      let tokenBalance = await payroll.tokenBalance();
      expect(tokenBalance).to.equal(employeeSalary);
      console.log(`Token balance ${tokenBalance}`);

      const claim = await payroll.connect(employee).claim();
      console.log(`Employee claimed at hash ${claim.hash}`);

      const deployedToken = await payroll.paymentToken();
      console.log(`paymentToken`, deployedToken);
      expect(paymentToken.address).to.equal(deployedToken);

      const approve = await paymentToken.connect(employee).approve(payroll.address, employeeSalary);
      console.log(`approve address ${payroll.address} to spend ${employeeSalary} of the employee address ${employee.address}`);
      const allowance = await paymentToken.allowance(employee.address, payroll.address);
      console.log(`${allowance} allowance of ${payroll.address} to spend ${employee.address}`);

      const stake = await payroll.connect(employee).stake(employeeSalary);
      const getStake = await payroll.stakes([1]);
      expect(getStake[0]).to.equal(1);

      let employeeBalance = await paymentToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      expect(employeeBalance).to.equal(0);

      let mint = await paymentToken.connect(owner).mint(payroll.address, employeeSalary);
      tokenBalance = await payroll.tokenBalance();
      console.log(`New Token balance after funding ${tokenBalance}`);

      const stakeId = 1;
      const unstake = await payroll.connect(employee).unstake(stakeId);
      employeeBalance = await paymentToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      expect(employeeBalance).above(employeeSalary);

      payroll.connect(owner);
      let totalSalary = await payroll.totalSalaries();
      expect(totalSalary).to.equal(employeeSalary);
      console.log(`Token Salaries ${totalSalary}`);

      let totalPayments = await payroll.totalPayments();
      expect(totalPayments).to.equal(1);
      console.log(`Total Payment is 1`);

      console.log(`Token balance ${tokenBalance}`);
      newSalary = 200;
      const updateEmployeeSalary = await payroll.updateEmployeeSalary(employee.address, newSalary.toString());
      console.log(`Employee salary updated to ${newSalary} at hash ${updateEmployeeSalary.hash}`);


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
