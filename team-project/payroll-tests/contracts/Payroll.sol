//SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PayrollToken is ERC20, ERC20Burnable, AccessControl {
    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint8 constant _decimals = 18;

    constructor(string memory name, string memory symbol) ERC20 (name, symbol) {        
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }
}

contract Payroll{
    PayrollToken public paymentToken;
    address public companyAcc;
    uint256 public totalEmployees = 0;
    uint256 public totalSalaries = 0;
    uint256 public totalStakes = 0;
    uint256 public tokenRatioToEther = 1;
    uint256 public stakedTVL = 0;

    event Paid(
        address from,
        uint256 timestamp
    );

    event Fund(
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    struct EmployeeStruct {
        address paymentAddress;
        uint256 salary;
        uint256 lastPayment;
        uint256 paymentCount;
    }

    struct StakeStruct{
        uint stakeId;
        address employeeAddress;
        uint createdDate;
        uint amount;
        bool open;
    }

    StakeStruct[] public activeStakes;
    mapping(uint256 => StakeStruct) public stakes;

    mapping(address => bool) public isEmployee;
    EmployeeStruct[] employees;
    mapping(address => EmployeeStruct) public employeesAddress;

    modifier ownerOnly(){
        require(msg.sender == companyAcc, "Owner reserved only");
        _;
    }

    modifier enoughBalance() {
        require(tokenBalance() >= totalSalaries, "Not enough balance to pay employees!");
        _;
    }

    modifier IsEmployee(address employeeAddress) {
        require(isEmployee[employeeAddress] == true, "The employee couldn't found");
        _;
    }

   constructor(string memory tokenName, string memory tokenSymbol, uint initialCapital, uint ratio) {
        paymentToken = new PayrollToken(tokenName,tokenSymbol);
        companyAcc = msg.sender;
        paymentToken.mint(address(this), initialCapital);
        tokenRatioToEther = ratio;
    }

    function thirtyDaysHavePassed(uint256 lastPayment) public view returns (bool) {
        return (block.timestamp >= lastPayment + 30 days);
    }

    function addEmployee( address employeeAddress,uint256 salary) public ownerOnly {
        require(salary > 0, "Salary cannot be zero!");
        require(!isEmployee[employeeAddress], "Employee already in payroll!");
    
        totalEmployees++;
        totalSalaries += salary;
        isEmployee[employeeAddress] = true;

        EmployeeStruct  memory employeeStruct = EmployeeStruct(employeeAddress,salary,0,0);
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

    function employeeTokenBalance() public view returns (uint){
        return paymentToken.balanceOf(msg.sender);
    }

    function closeCompany() public ownerOnly {
        paymentToken.transfer(companyAcc, tokenBalance());
        (bool sent, ) = msg.sender.call{value: getCompanyEtherBalance()}("");
        require(sent, "Failed to send Ether");
        selfdestruct(payable(companyAcc));
    }

    function updateEmployeeSalary(address employeeAddress,uint newSalary) public ownerOnly{
        totalSalaries -= employeesAddress[employeeAddress].salary;
        employeesAddress[employeeAddress].salary = newSalary;
        totalSalaries += newSalary;
    }

    function claim() public IsEmployee(msg.sender){
        require(totalSalaries <= paymentToken.balanceOf(address(this)), "Insufficient balance to pay all employees");
       // require(thirtyDaysHavePassed(employeesAddress[msg.sender].lastPayment) == true, "You cannot claim in timespan of less than 30 days");
        
        employeesAddress[msg.sender].lastPayment = block.timestamp;
        payTo(employeesAddress[msg.sender].paymentAddress, employeesAddress[msg.sender].salary);
        employeesAddress[msg.sender].paymentCount++;

        emit Paid(msg.sender,block.timestamp);
    }

    function payAnEmployee(address employeeAddress) public ownerOnly IsEmployee(employeeAddress){
        require(employeesAddress[employeeAddress].salary <= tokenBalance(), "Insufficient balance to pay an employee");
        payTo(employeeAddress, employeesAddress[employeeAddress].salary);
        employeesAddress[employeeAddress].paymentCount++;
        emit Paid(msg.sender,block.timestamp);
    }

    function clientGetEthPayTokens(uint amount) public  {
        require(amount <= getCompanyEtherBalance(), "Not enough ether in company");
        paymentToken.mint(address(this), tokenRatioToEther * amount);
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

   

    fallback() external{}

    receive() payable external{}
   
}
