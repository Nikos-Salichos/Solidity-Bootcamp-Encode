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
    uint256 public totalSalary = 0;

    mapping(address => bool) IsEmployee;

    event Paid(
        uint256 indexed id,
        address from,
        uint256 totalSalary,
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
        totalSalary += salary;
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
                totalSalary -=  employees[i].salary;
                delete employees[i];
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

    fallback() external{}

    receive() payable external{}
   
}
