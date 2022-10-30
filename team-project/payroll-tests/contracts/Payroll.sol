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

    mapping(address => bool) public isEmployee;
    EmployeeStruct[] employees;
    mapping(address => EmployeeStruct) public employeesAddress;

    modifier ownerOnly(){
        require(msg.sender == companyAcc, "Owner reserved only");
        _;
    }

    constructor(string memory tokenName, string memory tokenSymbol, uint initialCapital) {
        paymentToken = new PayrollToken(tokenName, tokenSymbol);
        companyAcc = msg.sender;
        paymentToken.mint(address(this), initialCapital);
    }

    function addEmployee( address employeeAddress,uint256 salary) public ownerOnly {
        require(salary > 0, "Salary cannot be zero!");
        require(!isEmployee[employeeAddress], "Employee already in payroll!");
    
        totalEmployees++;
        totalSalaries += salary;
        isEmployee[employeeAddress] = true;

        EmployeeStruct  memory employeeStruct = EmployeeStruct(totalEmployees,employeeAddress,salary,block.timestamp,0);
        employeesAddress[employeeAddress] = employeeStruct;
        employees.push(employeeStruct);
    }

    function removeEmployee(address employeeAddress) public ownerOnly {  
        for(uint i=0; i<employees.length; i++){
            if(employees[i].paymentAddress == employeeAddress){
                isEmployee[employeeAddress] = false;
                delete employees[i];
                delete employeesAddress[employeeAddress];
                totalSalaries -=  employeesAddress[employeeAddress].salary;
                totalEmployees--;
                break;
            }
        }
    }

    function getEmployees() external view returns (EmployeeStruct[] memory) {
        return employees;
    }

    function getEmployee(address employeeAddress) external view returns (EmployeeStruct memory) {
        return employeesAddress[employeeAddress];
    }

    function payTo(address to, uint256 amount) internal {
        paymentToken.transfer(to, amount);
    }

    function tokenBalance() public view ownerOnly returns (uint){
        return paymentToken.balanceOf(address(this));
    }

    function closeCompany() public ownerOnly {
        paymentToken.transfer(companyAcc, tokenBalance());
        selfdestruct(payable(companyAcc));
    }

    function updateEmployeeSalary(address employeeAddress,uint newSalary) public ownerOnly{
        totalSalaries -= employeesAddress[employeeAddress].salary;
        employeesAddress[employeeAddress].salary = newSalary;
        totalSalaries += newSalary;
    }

    function claim() payable public{
        require(totalSalaries <= paymentToken.balanceOf(address(this)), "Insufficient balance to pay all employees");
        require(isEmployee[msg.sender] == true, "You are not an employee");
        uint employeeSalary = employeesAddress[msg.sender].salary;

        payTo(employeesAddress[msg.sender].paymentAddress, employeeSalary);
        employeesAddress[msg.sender].paymentCount++;
        totalPayments++;

        emit Paid(totalPayments,companyAcc,block.timestamp);
    }

    function payAnEmployee(address employeeAddress) payable public ownerOnly {
        require(employeesAddress[employeeAddress].salary <= tokenBalance(), "Insufficient balance to pay an employee");
        require(isEmployee[employeeAddress] == true, "This address does not belong to an employee");
        payTo(employeesAddress[employeeAddress].paymentAddress, employeesAddress[employeeAddress].salary);
        employeesAddress[employeeAddress].paymentCount++;
        emit Paid(totalPayments,companyAcc,block.timestamp);
    }

    function fundCompanyAccount(uint amount) payable public {
        paymentToken.mint(address(this), amount);
        emit Fund(msg.sender, amount, block.timestamp);
    }


    fallback() external{}

    receive() payable external{}
   
}