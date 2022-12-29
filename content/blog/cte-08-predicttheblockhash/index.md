---
title: "Capture The Ether: predict the block hash"
date: "2022-03-02T22:12:03.284Z"
description: This challenge's goal is to guess a 64 digits hexadecimal number, so we better start now.
---

[Link to Medium article](https://systemweakness.com/capture-the-ether-predict-the-block-hash-bdbaf870cd5d)
<!-- 
Capture The Ether: predict the block hash
Let’s start by technically and conceptually understanding what we are trying to achieve in this challenge.

It asks us to guess a hash allocated in a bytes32 variable, as per the keccak256’s format.

But what’s that bytes32? I’ll try to explain as simple as possible what it is and why it is represented in a string of 66 characters. You can skip this part if you don’t want or need to review some basic computing/mathematical concepts.

Let’s start with what a binary number is: a number expressed in the base-2 numeral system. A mathematical expression that uses only 2 symbols: 1 and 0. Also called bit (from binary digit). A bit is the most basic unit of information in computing and digital communication. It’s what computers understand. Everything is either on or off, and the sum/combination of those states. Everything in a computer can be represented in -usually- lots of bits.

We, humans, on the other hand use the decimal system to count things, which is expressed in the base-10 numeral system. I.e. symbols 0 to 9.

With each of these numeral systems we can represent any number (integer, at least) we want. And every number in each one of them has the exact representation in every other.

Going back to binary, each “1” added to a number is equal, in decimal format, to 2 to the power of te position of the number from right to left, starting with position 0. Some examples:

If the binary number is 111, it’s not one hundred eleven as we would expect, but 2² + 2¹ + 2⁰ = 7.
If the binary number is 1011, it’s not one thousand eleven, but 2³ + 0 + 2¹ + 2⁰ = 11.
Then, a byte is just the sum of 8 bits. That’s why we can represent up to decimal 256 numbers (0 to 255) with each one of them. To visualize it:

"11111111" = 2⁷ + 2⁶ + 2⁵ + 2⁴ + 2³ + 2² + 2¹ + 2⁰ = 255.
Another numeral system widely used in Ethereum and Blockchain is hexadecimal. This is a base-16 system, meaning it uses 16 symbols:

0 1 2 3 4 5 6 7 8 9 a b c d e f.
The way to use it is to count from 0 to f (0 to 15 in decimal) and then keep going with 10 (16), 11 (17), … 1a (26), … 20 (32) and so on.

With this system we can count up to decimal 255 with to digits: “ff”. To represent 256 we would have to add another digit on the left and start over with the other two: 100.

Also, per convention, when we write in hexadecimal format, we need to add a “0x” as a prefix.

To be sure we really understand all of this, let’s visualize 0 to 20 in decimal, hexadecimal and binary with their corresponding formula:


Ok, so now you know what a bit, byte, binary, hexadecimal and decimals are. We can go back to our challenge’s solution: a hash allocated in a bytes32 variable, as per the keccak256’s format, and why it is represented with 66 characters, both numbers and letters.

First, the output of the keccak256 hash function is a 256 bit number. As we’ve seen before, 256 bits = 32 bytes, as per 256 / 8. That’s our bytes32 variable, which is represented in hexadecimal format, meaning that each of these 32 bytes can be represented with two hexadecimal characters, i.e. 64 in total. Then, if we add the “0x” prefix we finally get to our 66 characters number.

Now, going back to our challenge, this contract has pretty much the same structure as the previous one.


The main functions are:

constructor requires 1 ether when deploying.
lockInGuess takes a bytes32 as an argument, sets the guesser as the msg.sender, the guess as the parameter and the settlementBlockNumber as the next in line.
settle after a couple of checks, defines and sets the bytes32 variable answer to the blockhash of our settlementBlockNumber.
isComplete checks if the balance equals to 0.
These functions, as per the require statements in them and blockchain’s logic, force us to call them in that exact order. If we try and call them in any other way, we’ll get an error and the transaction will be reverted.

Trying to actually guess a 256 bit / 32 byte number is quite unfeasible, there are much more combinations in it than stars in the universe. Really.

There is a way, though, to solve this challenge in a little bit more efficient way with one of the blockhash’s properties. If we go and read the docs we’ll see that it returns the hash of the given block when blocknumber is one of the 256 most recent blocks; otherwise returns zero.

This piece of information is key to solve the challenge. We know that sometime in the future (~ 1 hour), our current block will older than the 256 most recent blocks, and if we try and get the hash through the blockhash function, it’ll return 0.

So, the way to solve this exercise is to…

Deploy the contract, send 1 ether with the constructor.
Call lockInGuess() with a value of 0x0000000000000000000000000000000000000000000000000000000000000000 and send another ether.
Wait for approximately 1 hour or check what the previous step’s block was and wait until 256 more blocks have been mined. You can of course check this on etherscan.
Call settle().
If you’ve waited long enough, you’ll be receiving the two previously sent ethers on your account.


We have reviewed some concepts and finished with the Lotteries challenges. On the next article we’ll start solving the Math section.
 -->
