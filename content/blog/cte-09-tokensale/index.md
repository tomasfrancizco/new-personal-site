---
title: "Capture The Ether: token sale"
date: "2022-03-15T22:12:03.284Z"
description: With the beginning of a new chapter of vulnerabilities, comes a new set of backdoors and hacking opportunities 🥳.
---

[Link to Medium article](https://systemweakness.com/capture-the-ether-token-sale-fcbc4ecb8a11)
<!-- 
Capture The Ether: token sale
With the beginning of a new chapter of vulnerabilities, comes a new set of backdoors and hacking opportunities 🥳.

The Capture The Ether’s Math section give us the chance to play with numbers and do a little bit of math.

Let’s start by analyzing the first challenge:


At first glance this looks like a very basic token contract in which we can buy and sell with a constant price of 1 ether per token, and… that’s pretty much it.

There are not a lot of require statements that complicate the transactions, neither. Let’s take a look at them:

buy(): requires that we specify the amount of tokens and then does a simple calculation: msg.value == numTokens * PRICE_PER_TOKEN. That means, as the variable PRICE_PER_TOKEN is equal to 1 ether, in order to buy, say, 10 tokens, we need to send 10 ethers and so on.
sell(): requires our balance to be bigger than or equal to the number of tokens we want to sell. balanceOf[msg.sender] >= numTokens.
Our objective? On deployment the contract forces us to send 1 ether (without getting any tokens). In order to complete the challenge we need to leave less than 1 ether in the contract’s balance. That means that we need to sell more tokens than the ones we bought in the first place.

So, as the buy/sell functions look pretty straight forward, let’s think about what else we can do.

For this, we’ll first check a solidity bug/feature that will help us with our challenge: integer overflow.

Disclaimer: integer overflow is an issue if we use any solidity version < 0.8.0. From this version onwards, solidity has built-in overflow protection.

Integer overflow is a situation that emerges when an integer reaches its byte size and we keep adding numbers. E.g. a uint8 can store up to 8 bits: 11111111 = 2^8 — 1 = 255. What happens if we try to do the following calculation?

uint8 num = 255;
uint8 numPlusOne = num + 1;
As there is no more room for another number, the variable numPlusOne will reset back to 0. Adding 2 will result in 1, and so on.

The same thing happens the other way around, in this example:

uint8 num = 0;
uint8 numMinusOne = num — 1;
In this case, as there is no number below 0 in any unsigned integer, the result will go all the way up to 255.

As mentioned above, this problem was solved within solidity starting from version 0.8.0. Before that, the standard method for addressing it was using the Open Zeppelin’s library SafeMath. Which (if applied correctly) checked for overflows before any calculation.

From version 0.8.0 a transaction will revert if an overflow is detected even without the use of external libraries or extra checks.

So, why is it important to understand this if it doesn’t happen anymore? Well, there are still (and will be for quite a while) a lot of live projects that use prior versions of solidity and therefore are prone to these types of errors. So it’s always a good idea to know this stuff.

Going back to the challenge, fortunately, there’s only one option to start: calling buy(), which asks us for a parameter. Maybe we can play a little bit with that.

That parameter is a uint256, which as the name implies, can hold up to 256 bits/32 bytes or 2²⁵⁶-1. That is a huge, 78 digits number:

115792089237316195423570985008687907853269984665640564039457584007913129639935.

From now on we’ll call it MAX_UINT. Sending it as a parameter in buy()means that we should also send that amount of ether. Not possible (at least for me, sorry).

Let’s take a closer look to our require statement, again:

require(msg.value == numTokens * PRICE_PER_TOKEN)

To pass this require statement, the amount of tokens (numTokens) will be multiplied by 1 ether. And remember that the EVM will interpret 1 ether as 10^18 or 1000000000000000000. So what if we try to buy the following amount?

(MAX_UINT / 10^18) + 1= 115792089237316195423570985008687907853269984665640564039458

Multiplying it by 10^18 will result in an overflow of 415992086870360064, a little bit below half an ether. So, sending that amount of wei as the msg.value will pass the require statement and give us a lot of tokens.

After this, the challenge’s balance will be 1.415992086870360064 and we can just sell 1 token to receive 1 ether and complete the challenge.

To summarize, these are the steps to win the challenge:

call the buy() function with 115792089237316195423570985008687907853269984665640564039458 as numTokens and 415992086870360064 wei as msg.value.
call the sell() function with 1 token as parameter.

Awesome! We’ve solved the first math challenge and learnt about integer overflow. On the next article we’ll try with the Token Whale exercise.

2

 -->
