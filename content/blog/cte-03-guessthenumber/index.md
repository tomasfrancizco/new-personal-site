---
title: "Capture The Ether: guess the number"
date: "2021-12-23T22:12:03.284Z"
description: Let’s find our first vulnerability.
---

[Link to Medium article](https://medium.com/@tomasfrancisco/capture-the-ether-guess-the-number-c96bbb808bf3)
<!-- 
Capture The Ether: guess the number
Let’s find our first vulnerability. If you’ve already seen this contract, you may have discovered what the solution is and may be thinking this is too easy and obvious. But believe it or not, this is something that may very likely happen in real life: contracts with exposed private information that may lead to a vulnerability. Remember, everything is public in the blockchain and the keyword ‘private’ refers to the possibility of a function or variable to be accessed, not seen.

Besides the solution, there are some interesting new things that we can analyse.

capture the ether, guess the number challenge smart contract
In this contract we have a state variable:

uint8 answer = 42
And three functions:

GuessTheNumberChallenge(): this is the ‘constructor’ function of the contract. Constructors are special and optional functions that are executed only once when the contract is deployed and are used to initialize state variables. Before solidity compiler 0.4.22 they had to be named as the contract itself. After that, the special keyword ‘constructor’ was implemented to avoid errors or spelling mistakes.
isComplete(): to check if the challenge has been completed.
guess(): the function we must call with the answer we think will solve the challenge.
There’s something different happening when we click on Begin Challenge: Metamask is asking for 1 ether. Why is this?

See the require statement inside the constructor? It says that when the function is executed, the msg value of the transaction should be of 1 ether. As that function is executed when the contract is deployed, that’s the moment when we must send the amount.

Now, going back to our problem, the isComplete() function will return true if the contract’s balance is equal to 0. When we deployed it, we sent 1 ether, so at the moment it will return false.

The solution is, of course, in the guess function. First, it requires 1 ether with the transaction calling it and after that, it checks that the parameter (uint8 n) is equal to the answer variable. That is very convenient, because we actually know what the answer variable is: 42!

So in order to solve this challenge, we must call the function answer with the parameter ‘42’ in it. if n == answer, we’ll get 2 ethers in return, equal to the amount we’ve sent before: one when deploying and the other when calling ‘guess’.

This time instead of using remix we will try and solve it via Etherscan.

These are the steps to follow there:

look for your contract’s address
go to the ‘contract’ tab
connect your wallet
enter ‘1' in the guess input: the amount of ether.
enter ‘42’ in the n input: our guess.
click on ‘write’.
That’s it! Now wait for a few seconds and you’ll see those 2 valuable ethers in your wallet again.


In the next article we’ll spice things up and solve the ‘Guess the secret number’ challenge.
 -->
