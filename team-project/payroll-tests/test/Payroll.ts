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

    const Payroll = await ethers.getContractFactory("Payroll");
    Payroll.connect(owner);
    const initialCapital = 0;
    const payroll = await Payroll.deploy(tokenName, tokenSymbol, initialCapital.toString());

    const receipt = await payroll.deployed();
    console.log(`Payroll contract deployed at ${receipt.address}`);

    const paymentTokenAddress = await payroll.paymentToken();
    console.log(`paymentToken address`, paymentTokenAddress);

    const PayrollToken = await ethers.getContractFactory("PayrollToken");
    const payrollToken = PayrollToken.attach(paymentTokenAddress);

    return { payrollToken, payroll, initialCapital, owner, employee, funder };
  }

  describe("Deployment", function () {
    it("Should set the right arguments", async function () {
      const { payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);
      const tokenBalance = await payroll.tokenBalance();
      console.log(`Token balance ${tokenBalance}`);
      expect(tokenBalance).to.equal(initialCapital);

      const companyAcc = await payroll.companyAcc();
      console.log(`Company account ${companyAcc}`);
      expect(companyAcc).to.equal(owner.address);
    });

    it("Should add 1 employee, and confirm employee details", async function () {
      const { payroll, employee } = await loadFixture(deployPayrollFixture);
      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);
      console.log(`1 employee added with payment address ${employee.address} and salary ${employeeSalary}`);

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
    });

    it("Should fund with 1000 capital", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const minterRole = await payrollToken.MINTER_ROLE();
      console.log(`minterRole ${minterRole}`);

      const companyAddressHasMinterRole = await payrollToken.hasRole(minterRole, payroll.address);
      console.log(`companyAddressHasMinterRole ${companyAddressHasMinterRole}`);

      let tokenBalance = await payroll.tokenBalance();
      console.log(`Token balance before funding: ${tokenBalance}`);
      expect(tokenBalance).to.equal(0);

      const fundAmount = 1000;
      const fundCompanyAccount = await payroll.connect(funder).fundCompanyAccount(fundAmount);

      tokenBalance = await payroll.tokenBalance();
      console.log(`Token balance after funding: ${tokenBalance}`);
      const currentSupply = initialCapital + fundAmount;
      expect(tokenBalance).to.equal(currentSupply.toString());
    });

    it("Employee should claim his salary", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const fundAmount = 1000;
      const fundCompanyAccount = await payroll.connect(funder).fundCompanyAccount(fundAmount);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const claim = await payroll.connect(employee).claim();

      const employeeBalance = await payroll.connect(employee).employeeTokenBalance();
      console.log(`Employee token balance ${employeeBalance}`);
      expect(employeeBalance).to.equal(employeeSalary);
    });

    it("Employee should get approval and stake his salary", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const fundAmount = 1000;
      const fundCompanyAccount = await payroll.connect(funder).fundCompanyAccount(fundAmount);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const claim = await payroll.connect(employee).claim();

      const approve = await payrollToken.connect(employee).approve(payroll.address, employeeSalary);
      console.log(`approve address ${payroll.address} to spend ${employeeSalary} of the employee address ${employee.address}`);

      const allowance = await payrollToken.allowance(employee.address, payroll.address);
      console.log(`${allowance} allowance of ${payroll.address} to spend ${employee.address}`);

      const stake = await payroll.connect(employee).stake(employeeSalary);
      const getStake = await payroll.stakes([1]);
      expect(getStake[0]).to.equal(1);

      const employeeBalance = await payrollToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      expect(employeeBalance).to.equal(0);
    });

    it("Employee should unstake", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const fundAmount = 10000;
      const fundCompanyAccount = await payroll.connect(funder).fundCompanyAccount(fundAmount);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const claim = await payroll.connect(employee).claim();

      const approve = await payrollToken.connect(employee).approve(payroll.address, employeeSalary);
      console.log(`approve address ${payroll.address} to spend ${employeeSalary} of the employee address ${employee.address}`);

      const allowance = await payrollToken.allowance(employee.address, payroll.address);
      console.log(`${allowance} allowance of ${payroll.address} to spend ${employee.address}`);

      const stake = await payroll.connect(employee).stake(employeeSalary);
      const getStake = await payroll.stakes([1]);
      expect(getStake[0]).to.equal(1);

      let employeeBalance = await payrollToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      expect(employeeBalance).to.equal(0);

      const stakeId = 1;
      const unstake = await payroll.connect(employee).unstake(stakeId);

      employeeBalance = await payrollToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      const interest = employeeSalary / 10;
      const employeeBalanceAndInterest = employeeSalary + interest;
      expect(employeeBalance).to.equal(employeeBalanceAndInterest);
    });

    it("Should update employee salary", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const newSalary = 2000;
      const updateEmployeeSalary = await payroll.connect(owner).updateEmployeeSalary(employee.address, newSalary.toString());

      const employeeUpdated = await payroll.employeesAddress(employee.address);
      expect(employeeUpdated[1]).to.equal(newSalary);
      console.log(`Employee salary updated to ${employeeUpdated[1]}`);

      const getEmployees = await payroll.getEmployee(employee.address);
      console.log(`Employee payment address ${getEmployees[0]}`);
      console.log(`Employee salary ${getEmployees[1]}`);
      console.log(`Employee Last payment ${getEmployees[2]}`);
      console.log(`Employee payment count ${getEmployees[3]}`);
    });

    it("Should pay an employee", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const fundAmount = 1000;
      const fundCompanyAccount = await payroll.connect(funder).fundCompanyAccount(fundAmount);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const payAnEmployee = await payroll.payAnEmployee(employee.address);
      console.log(`Pay employee with address ${employee.address} at hash ${payAnEmployee.hash}`);

      const tokenBalance = await payroll.tokenBalance();
      console.log(`New Token balance after pay employee  ${tokenBalance}`);
      expect(tokenBalance).to.equal(0);

      const employeeBalance = await payrollToken.connect(employee).balanceOf(employee.address);
      console.log(`${employee.address} has balance of ${employeeBalance}`);
      expect(employeeBalance).to.equal(employeeSalary);

      payroll.connect(owner);
      let totalSalary = await payroll.totalSalaries();
      expect(totalSalary).to.equal(employeeSalary);
      console.log(`Token Salaries ${totalSalary}`);
    });

    it("Should remove an employee", async function () {
      const { payrollToken, payroll, initialCapital, owner, employee, funder } = await loadFixture(deployPayrollFixture);

      const employeeSalary = 1000;
      const addEmployee = await payroll.addEmployee(employee.address, employeeSalary);

      const removeEmployee = await payroll.removeEmployee(employee.address);

      const totalEmployees = await payroll.totalEmployees();
      expect(totalEmployees).to.equal(0);
      console.log(`Total Employees ${totalEmployees}`);
    });

    it("Should close company", async function () {
      const { payrollToken, payroll, initialCapital, owner } = await loadFixture(deployPayrollFixture);

      const fundAmount = 1000;
      const fundCompanyAccount = await payroll.fundCompanyAccount(fundAmount);

      expect(await payroll.tokenBalance()).to.equal(fundAmount);
      expect(await payroll.companyAcc()).to.equal(owner.address);

      let paymentToken = await payroll.paymentToken();
      expect(paymentToken).to.not.equal("0x0000000000000000000000000000000000000000");
      console.log(`Payment Token ${paymentToken}`);

      const shutDownCompany = await payroll.closeCompany();
      console.log(`Closed company at hash ${shutDownCompany.hash}`);

      const tokenBalanceOfOwner = await payrollToken.balanceOf(owner.address);
      expect(tokenBalanceOfOwner).to.equal(fundAmount);
      console.log(`Balance of company owner account ${owner.address} has ${tokenBalanceOfOwner} tokens after company closed`);
    });
  });
});
