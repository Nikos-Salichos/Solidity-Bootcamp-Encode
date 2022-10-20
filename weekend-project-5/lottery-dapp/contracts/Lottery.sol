//SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable{
    uint public closingTime;
    bool public betsOpen;

    constructor(uint _betPrice, uint _betFree){}

    function openBets(uint _closingTime) public onlyOwner{
        require(_closingTime > block.timestamp,"Closing time must be in the future");
        closingTime = _closingTime;
    } 
   
}