// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.23;


contract Migrations {
  address public owner;
  uint public lastCompletedMigration;

  constructor() public {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted {
      lastCompletedMigration = completed;
  }

  function upgrade(address new_address) public restricted {
      Migrations upgraded = Migrations(new_address);
      upgraded.setCompleted(lastCompletedMigration);
  }
}
