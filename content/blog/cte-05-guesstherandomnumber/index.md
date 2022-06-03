---
title: "Capture The Ether: Guess the Random Number on a Smart Contract"
date: "2022-01-10T22:12:03.284Z"
description: "Send ether to earn more ether (if the answer is right)"
---

[Link to Medium article](https://betterprogramming.pub/capture-the-ether-guess-the-random-number-2ebb8c9c0347)
<!-- 
Capture Ether: Guess the Random Number on a Smart Contract
Send ether to earn more ether (if the answer is right)

Photo by olieman.eth on Unsplash
Creating a random number on-chain is a complex task. In fact, there are some workarounds to do it but in general, it’s highly recommended to do it off-chain, as almost every input that may be used for entropy is public and/or can be manipulated to some degree.

Fortunately for us, this challenge asks us to guess a ‘random’ number that is created on-chain. How is that?


Guess the random number Challenge Smart Contract code
The first line of the contract is a uint8 variable, answer. Remember that uint8 variables contain up to 256 possible integers: 0 to 255.

This variable is assigned in the constructor to the keccak256 hash of two inputs: the blockhash of the previous block of the one in which our deploying transaction was included (block.blockhash(block.number - 1), of type bytes32) and the timestamp of when our block was mined (now, of type uint256).

Keep in mind that this contract uses compilator version ^0.4.21 and since then some syntax has changed: block.blockhash() is now blockhash() and now is block.timestamp. We’ll see this further on.

As we see in that line, the keccak256 function (a bytes32 fixed-size byte array) is then explicitly converted to uint8 and assigned to our variable.

So, this seems pretty random, right? How are we supposed to guess a number between 0 and 255 that comes from applying a hashing function to a hash of some block and timestamp of who knows when?!

Well, pretty easily, actually. Remember that everything that’s on the blockchain is public. So, let’s go ahead and look for the information we need.

Our objective is under function guess, we must call it and send a uint8 plus 1 ether (we’ve already sent one on deployment), then if our uint8 is equal to the answer variable, the contract will send us 2 ethers, draining the balance, therefore the isComplete() function will return true.

There are multiple ways to interact with a contract, but I’ve decided to do so via another contract. This is not the easiest way and in this case, not even necessary, but definitely the one we can take more advantage of.

This is the code I’ve written to solve the challenge:

// SPDX-License-Identifier: No License
pragma solidity ^0.8.0;
interface IGuessTheRandomNumberChallenge {
  function guess(uint8) external payable;
}
contract GuessTheRandomNumberSolver {
  IGuessTheRandomNumberChallenge public _interface;
  bytes32 public previousBlockHash = 0x66bcdb5e320c9e0c04a9fdeaa15de33a4c8a040db342f4f955fa54f170dba9ce;
  uint public previousTimestamp = 1641520092;
  constructor(address _interfaceAddress) {
    require(_interfaceAddress != address(0), "Address can not be Zero");
    _interface = IGuessTheRandomNumberChallenge(_interfaceAddress);
  }
  function solve() public payable {
    uint8 answer = uint8(uint256(keccak256(abi.encodePacked(previousBlockHash, previousTimestamp))));
    _interface.guess{value: 1 ether}(answer);
  }
  function getBalance() public view returns(uint){
    return address(this).balance;
  }
  function withdraw() public {
    payable(msg.sender).transfer(address(this).balance);
  }
  receive() external payable {}
}
The first thing you see after the compilator version is an interface. We can use these to interact with other contracts through our code. It basically is a simpler contract with some rules:

They cannot inherit from other contracts, but they can inherit from other interfaces.
All declared functions must be external.
They cannot declare a constructor.
They cannot declare state variables.
They cannot declare modifiers.
As we only need to call the ‘guess’ function, that’s the only one we’ve declared in our interface.

Then, in our GuessTheRandomNumberSolver contract we’ll declare a _interface variable and assign the challenge’s address (the one you got when deploying it in CTE) through our constructor.

That’s all we need for now to call the function in our deployed challenge, so let’s go ahead and gather the info to recreate the random number that was deployed with it.

It’s all available in etherscan, we just need to look for our challenge’s address.

Blockhash(block.number - 1): to get this, go to the Internal Txns tab and click on the block number on the same line that says Contract Creation. In my case, the block was #11766860:


Now, we can see a lot of information regarding that block, but we need to access the previous one, so go ahead and look for it. In my case, it’s #11766859.

Down below we can see the hash. That’s the first piece of information we need.

Block.timestamp: go back to our block and you’ll see the Timestamp on the second line. But wait, this is in a human-readable format and we need it in Unix Timestamp format. What is that? It’s basically the number of seconds that have elapsed since January 1st, 1970. And it’s a standard way of measuring time. At the time of writing, it’s a 10 digit number.

To convert this human-readable timestamp to Unix time I use a very convenient site called epochconverter. With this number, we finally have our last puzzle piece and we can make the call to solve the challenge.

Going back to the GuessTheRandomNumberSolver contract, let’s create a solve function that we’ll call in order to contact our challenge contract.

For readability purposes, I’ve also created two new variables:

bytes32 public previousBlockHash
uint public previousTimestamp.
Create them but assign your challenge’s values to them.

Then, in our solve function we’ll create the uint8 answer variable and assign it the value:

uint8(uint256(keccak256(abi.encodePacked(previousBlockHash, previousTimestamp))))
The change in syntax and formatting is because we are using compilator version ^0.8.0 and the challenge uses version ^0.4.21.

Now that we have the answer assigned to our variable, we just need to call the challenge via the interface. That’s what the next line does:

_interface.guess{value: 1 ether}(answer)
I assume that you are using remix, so go ahead, connect your metamask wallet via the Injected Web3 environment, and deploy your contract specifying your challenge’s address to assign to your interface.

Now, with 1 ether in the value input go ahead and call the guess function.

I’ve added a couple more functions:

getBalance()
withdraw()
receive()
This is because the challenge’s msg.sender will be our GuessTheRandomNumberSolver contract, not our EOA — so we need to receive the 2 ethers and be able to send them to our EOA.


In the next article, we’ll resolve the “Guess the new number” challenge. -->