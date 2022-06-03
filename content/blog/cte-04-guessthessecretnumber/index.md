---
title: "Capture The Ether: guess the secret number"
date: "2021-12-26T22:12:03.284Z"
description: "The objective of this challenge is to guess a ‘secret’ number. But is it?"
---

[Link to Medium article](https://medium.com/@tomasfrancisco/capture-the-ether-guess-the-secret-number-3a146be0e0ed)
<!-- 
Capture The Ether: guess the secret number
The objective of this challenge is to guess a ‘secret’ number. But is it?

Let’s start from the beginning of the contract. The first line inside of it is our answerHash, a bytes32 variable with a ‘hash’. And what is that, exactly?

Hash functions are functions that can be used to map data of arbitrary size to fixed size. Their output is called hash, and that’s what we see here. So basically, there is an integer to which a hash function was applied and the result is this ‘answerHash’.

There are multiple hash functions, but in Ethereum we use the Keccak-256.

To add a little bit more to this subject, as hash functions are one of the most important aspects of modern cryptography and therefore, blockchains and Ethereum, here are some of their main properties:

Determinism: a given input message always produces the same hash output.
Verifiability: computing the hash of a message is efficient (linear complexity).
Noncorrelation: a small change to the message (e.g., a 1-bit change) should change the hash output so extensively that it cannot be correlated to the hash of the original message.
Collision protection: it should be infeasible to calculate two different messages that produce the same hash output.
Irreversibility: computing the message from its hash is infeasible, equivalent to a brute-force search through all possible messages.
As per this last property, you may be asking yourself, do we need to try every integer in existence until we find the one that has the same hash? Well, it could be the case, but it isn’t.

Now, back to our challenge, go ahead and deploy the contract and pay that 1 ether that is required in the constructor.

Now i’m going to use a couple of tools that I like in order to discover what number lies behind the answerHash.

The fact that the guess function takes as an argument a ‘uint8’ narrows the possibilities by a lot: first, a ‘uint’ is an ‘unsigned integer’, that means an integer without a sign, so any number ≥ 0.

And the 8 in ‘uint8’ means that that variable has 8 bits. What’s the highest decimal number that we can represent with 8 bits (a byte)? 255.

So that basically narrows our search from 0 to 2²⁵⁶ -1 (78 digits) to 256 numbers (0 to 255). Cool, huh?

There are multiple sites that give us the keccak256 hash of an input, so we could manually try every number in our desired range until we see the hash that we need. In this case that would be definitely possible, but not very efficient, right?

So I came up with a couple of lines in javascript/node that let us discover that number much quicker.

const keccak256 = require('keccak256');
const answerHash = 

In this piece of code, we are looping between 0 and 255 and applying the keccak256 hash function in every iteration. If the hash is equal to the answerHash, then it logs a message with the result.

One more thing, if you look closely, you will see that the string in answerHash doesn’t have the ‘0x’ at the beginning as in the contract. This ‘0x’ is just an identifier for hexadecimal numbers, it means that the following digits are in hexadecimal format. The keccak256 node package returns a string without this prefix and that’s why I didn’t include it in the first place.

To run this piece of code I used replit, a very practical online IDE, but if you have Node installed, you may as well create your index.js file locally and run it there.

Once you get the answer you may call the contract in Etherscan, just like we did in the previous challenge.

I won’t leave you without the solution, but I won’t make it that easy neither, so here’s what you need to send with the guess call, but in hexadecimal format: 0xAA. Good luck!


That’s it! In the next article we’ll solve the Guess the random number challenge. -->