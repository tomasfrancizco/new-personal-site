---
title: "Capture The Ether: retirement fund"
date: "2022-04-06T22:12:03.284Z"
description: "The solution for this challenge is very straight forward: wait for 10 years."
---

[Link to Medium article](https://medium.com/coinmonks/capture-the-ether-retirement-fund-f56f7bb2e4de)
<!-- 
Capture The Ether: retirement fund
The solution for this challenge is very straight forward: wait until the deployer is desperate enough to withdraw their funds before 10 years have passed, leaving 10% of them to us, or wait those 10 years and hope they remember about all of this.

Great! In the next article we’ll solv — Just kidding. There must be another way to win this challenge without waiting that long, right?

Let’s take a look at the contract:


I got a little confused at the beginning in terms of who was the beneficiary and the msg.sender. To clarify that, although we are the ones deploying this instance of the contract, the former is actually ourselves (the EOA used to deploy the contract) and the latter is someone else on the Capture The Ether’s team (or whoever, but not us). We could check that looking for our contract on etherscan.

Ok, now that we’ve cleared that, let’s dive into the challenge.

There are three callable (i.e. with public visibility) functions:

isComplete(): returns a boolean, true if the contract’s balance is 0 and false if it’s not. As we send 1 ether with the constructor, the default value is false, we need to change that by somehow draining its balance.
withdraw(): can only be called by the owner, and as we’ve seen, that’s not us. So we can forget about this one and i’m pretty sure that the owner will also forget about it and won’t call it either.
collectPenalty(): can only be called by us and then does a simple calculation: uint256 withdrawn = startBalance — address(this).balance.
Let’s focus on this last function and what the possibilities are.

The two variables at stake here are startBalance and address(this).balance, so, the basic scenarios would be…

A. owner calls withdraw() before 10 years have passed, taking with them 0.9 ether and leaving us 0.1 ether. In this case startBalance = 1 & address(this).balance = 0 so withdrawn = 1. The function does not revert on the require statement but there’s nothing to transfer.

B. owner calls withdraw after 10 years have passed, taking with them 1 ether and leaving us with nothing. In this case startBalance = 1 & address(this).balance = 0 so withdrawn = 1. The function does not revert on the require statement but there’s nothing to transfer.

C. owner doesn’t call withdraw at all. In this case startBalance = 1 & address(this).balance = 1so withdrawn = 0. The function reverts on the require statement.

Are there any other options? Can startBalance or address(this).balance be something else? What if we send more ether to the contract to make address(this).balance higher?

Given that case, -and assuming that the owner won’t ever call withdraw(), as in option C- the local variable withdrawn would underflow and end up as an enormous 78 digits number, passing the require statement and sending us the contract’s balance, which by that point would be 1 ether.

Sounds good, but there’s a problem: there is no straight forward way of sending ether to this contract because it doesn’t have a fallback/receive or payable function. We could try a low level call, a transfer or send but all of them would revert for this reason. You can try.

There are, though, a couple of ways* in which one can force-send ether to a contract.

The one that we’ll be using to solve our challenge has to do with the selfdestruct function & opcode, as we can read in the docs:

Destroy the current contract, sending its funds to the given Address and end execution. Note that selfdestruct has some peculiarities inherited from the EVM:

the receiving contract’s receive function is not executed.

the contract is only really destroyed at the end of the transaction and revert s might “undo” the destruction.

What’s specially important in this quote is the line that reads that the contract’s receive function is not executed. This means that it doesn’t even need one to add ether to its balance.

Adding to this, as the opcode used in this transaction, SELFDESTRUCT, works on a EVM-level, any solidity function used to stop it won’t work and the ether will go through anyway.

*You can read about both ways of force-sending ether here.

Let’s go ahead and apply this to the challenge: what we need to do here is to create a contract with some ether (1 wei is enough) and a selfdestruct function with the challenge’s address so that when we call it, the balance goes to it, making it > 1 ether. Once this is done, we can call collectPenalty() and we’ll get the whole balance for ourselves.

This is the Attacker contract I’ve written, I tried to keep it as simple as possible:


The important thing that we need to keep in mind now that we know about this vulnerability is that we must never asume that a contract’s balance is or will be zero. Any condition including address(this).balance == 0 should be avoided because ether can be force-sent to it at any moment.


In the next article we’ll solve the Mapping challenge.
 -->
