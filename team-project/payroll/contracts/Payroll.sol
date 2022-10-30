//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PayrollToken is ERC20, ERC20Burnable, AccessControl {
       bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

contract Payroll{
    PayrollToken public paymentToken;
    address public companyAcc;
    uint256 public totalEmployees = 0;
    uint256 public totalSalaries = 0;
    uint256 public totalPayments = 0;

    mapping(address => bool) IsEmployee;

    event Paid(
        uint256 indexed id,
        address from,
        uint256 timestamp
    );

    event Fund(
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    struct EmployeeStruct {
        uint256 id;
        address paymentAddress;
        uint256 salary;
        uint256 timestamp;
        uint256 paymentCount;
    }

    EmployeeStruct[] employees;

    modifier ownerOnly(){
        require(msg.sender == companyAcc, "Owner reserved only");
        _;
    }

    constructor(string memory tokenName, string memory tokenSymbol, uint initialCapital) {
        paymentToken = new PayrollToken(tokenName, tokenSymbol);
        companyAcc = msg.sender;
        paymentToken.mint(address(this), initialCapital);
    }

    function addEmployee( address employeeAddress,uint256 salary) public ownerOnly returns (bool) {
        require(salary > 0, "Salary cannot be zero!");
        require(!IsEmployee[employeeAddress], "Employee already in payroll!");
    
        totalEmployees++;
        totalSalaries += salary;
        IsEmployee[employeeAddress] = true;

        employees.push(
            EmployeeStruct(
                totalEmployees,
                employeeAddress,
                salary,
                block.timestamp,
                0
            )
        );
        
        return true;
    }

    function removeEmployee(address employeeAddress) public ownerOnly returns(bool){
        for (uint i = 0; i < employees.length; i++) {
            if (employees[i].paymentAddress == employeeAddress) {
                totalSalaries -=  employees[i].salary;
                delete employees[i];
                totalEmployees--;
                return true;
            }
        }
        return false;
    }

    function getEmployees() external view returns (EmployeeStruct[] memory) {
        return employees;
    }

    function getEmployee(address employeeAddress) external view returns (EmployeeStruct memory) {
        for (uint i = 0; i < employees.length; i++) {
            if (employees[i].paymentAddress == employeeAddress) {  
                return employees[i];
            }
        }
        revert('Not Found');
    }

    function payTo(address to, uint256 amount) internal returns (bool) {
        paymentToken.transfer(to, amount);
        return true;
    }

    function tokenBalance() public view ownerOnly returns (uint){
        return paymentToken.balanceOf(address(this));
    }

    function shutDownCompany() public ownerOnly {
        paymentToken.transfer(companyAcc, tokenBalance());
        selfdestruct(payable(companyAcc));
    }

    function updateEmployeeSalary(address employeeAddress,uint newSalary) public ownerOnly returns(bool){
        for (uint i = 0; i < employees.length; i++) {
            if (employees[i].paymentAddress == employeeAddress) {
                totalSalaries -= employees[i].salary;
                employees[i].salary = newSalary;
                totalSalaries += newSalary;
                return true;
            }
        }
        return false;
    }

    function payEmployees() payable public ownerOnly returns (bool) {
        require(totalSalaries <= tokenBalance(), "Insufficient balance to pay all employees");

        for(uint i = 0; i < employees.length; i++) {
            payTo(employees[i].paymentAddress, employees[i].salary);
            employees[i].paymentCount++;
        }
        totalPayments++;

        emit Paid(totalPayments,companyAcc,block.timestamp);
        return true;
    }

    function payAnEmployee(address employeeAddress) payable public ownerOnly returns (bool) {
        for(uint i = 0; i < employees.length; i++) {
            if (employees[i].paymentAddress == employeeAddress) {
                require(employees[i].salary <= tokenBalance(), "Insufficient balance to pay an employee");
                payTo(employees[i].paymentAddress, employees[i].salary);
                employees[i].paymentCount++;
            }
        }

        emit Paid(totalPayments,companyAcc,block.timestamp);
        return true;
    }

    function fundCompanyAccount(uint amount) payable public returns (bool) {
        paymentToken.transferFrom(msg.sender, address(this), amount);
        emit Fund(msg.sender, amount, block.timestamp);
        return true;
    }


    fallback() external{}

    receive() payable external{}
   
}
