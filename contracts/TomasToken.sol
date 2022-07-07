//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TomasToken is ERC20 {

  address private contractOwner = 0xC5c6BE1Fc71CB9b6aE7696e0A68b0eAb4aa4A2E7;
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(msg.sender, 100 * (10**18));
  }

  function transfer(address to, uint256 amount) public override returns (bool) {
    _transfer(contractOwner, to, amount);
    return true;
  }

}