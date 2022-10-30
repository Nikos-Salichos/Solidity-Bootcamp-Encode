import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tokenName, tokenSymbol, initialCapital } from "../payrollConstructor/arguments";
import { PayrollToken__factory } from "../typechain-types";

describe("Payroll", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPayrollFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, employee, funder] = await ethers.getSigners();

    const Payroll = await ethers.getContractFactory("Payroll");
    Payroll.connect(owner);
    const payroll = await Payroll.deploy(tokenName, tokenSymbol, initialCapital.toString());

    const receipt = await payroll.deployed();
    console.log(`Payroll contract deployed at ${receipt.address}`);
    return { payroll, initialCapital, owner, employee, funder };
  }

  describe("Deployment", function () {
    it("Should set the right initialCapital", async function () {
      const { payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);

      const tokenBalance = await payroll.tokenBalance();
      expect(tokenBalance).to.equal(initialCapital);
      console.log(`Token balance ${tokenBalance}`);

      const companyAcc = await payroll.companyAcc();
      expect(companyAcc).to.equal(owner.address);
      console.log(`Company account ${companyAcc}`);
    });

    it("Should add 1 employee, check employee details, pay employees,  update his salary ,fund company account, pay him the new salary then remove him", async function () {
      const { payroll, initialCapital, owner, employee } = await loadFixture(deployPayrollFixture);
      const employeeSalary = initialCapital;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);
      console.log(`1 employee added at hash ${addEmployee.hash} with payment address ${employee.address} and salary ${employeeSalary}`);

      let totalEmployees = await payroll.totalEmployees();
      expect(totalEmployees).to.equal(1);
      console.log(`Total Employees ${totalEmployees}`);

      const getEmployees = await payroll.getEmployees();
      expect(getEmployees[0][0]).to.equal(1);
      console.log(`Employee Id ${getEmployees[0][0]}`);
      expect(getEmployees[0][1]).to.equal(employee.address);
      console.log(`Employee payment address ${getEmployees[0][1]}`);
      expect(getEmployees[0][2]).to.equal(employeeSalary);
      console.log(`Employee salary ${getEmployees[0][2]}`);

      let tokenBalance = await payroll.tokenBalance();
      expect(tokenBalance).to.equal(employeeSalary);
      console.log(`Token balance ${tokenBalance}`);

      const claim = await payroll.connect(employee).claim();
      console.log(`Employee claimed at hash ${claim.hash}`);

      payroll.connect(owner);
      let totalSalary = await payroll.totalSalaries();
      expect(totalSalary).to.equal(employeeSalary);
      console.log(`Token Salaries ${totalSalary}`);

      let totalPayments = await payroll.totalPayments();
      expect(totalPayments).to.equal(1);
      console.log(`Total Payment is 1`);

      tokenBalance = await payroll.tokenBalance();
      expect(tokenBalance).to.equal(0);
      console.log(`Token balance ${tokenBalance}`);

      const newSalary = 2000000000000000000n;
      const updateEmployeeSalary = await payroll.updateEmployeeSalary(employee.address, newSalary.toString());
      console.log(`Employee salary updatred to ${newSalary} at hash ${updateEmployeeSalary.hash}`);

      const fundCompanyAccount = await payroll.fundCompanyAccount(newSalary);
      console.log(`Company account has been funded with ${newSalary} at hash ${fundCompanyAccount.hash}`);

      expect(await payroll.tokenBalance()).to.equal(newSalary.toString());
      console.log(`New Token balance after funding ${tokenBalance}`);

      const payAnEmployee = await payroll.payAnEmployee(employee.address);
      console.log(`Pay employee with address ${employee.address} at hash ${payAnEmployee.hash}`);

      totalSalary = await payroll.totalSalaries();
      expect(totalSalary).to.equal(newSalary);
      console.log(`Token Salaries ${totalSalary}`);

      const removeEmployee = await payroll.removeEmployee(employee.address);
      console.log(`Remove employee at hash ${removeEmployee.hash}`);

      totalEmployees = await payroll.totalEmployees();
      expect(totalEmployees).to.equal(0);
      console.log(`Total Employees ${totalEmployees}`);
    });

    it("Should close company", async function () {
      const { payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);
      expect(await payroll.tokenBalance()).to.equal(initialCapital);
      expect(await payroll.companyAcc()).to.equal(owner.address);
      let paymentToken = await payroll.paymentToken();
      expect(paymentToken).to.not.equal("0x0000000000000000000000000000000000000000");
      console.log(`Payment Token ${paymentToken}`);

      const payrollToken = PayrollToken__factory.connect(paymentToken, owner);
      const shutDownCompany = await payroll.closeCompany();
      console.log(`Closed company at hash ${shutDownCompany.hash}`);

      const tokenBalanceOfOwner = await payrollToken.balanceOf(owner.address);
      expect(tokenBalanceOfOwner).to.equal(initialCapital);
      console.log(`Balance of company owner account ${owner.address} is ${tokenBalanceOfOwner} after company closed`);
    });
  });
});
