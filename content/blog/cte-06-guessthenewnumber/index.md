---
title: "Capture The Ether: guess the new number"
date: "2022-01-14T22:12:03.284Z"
description: In this challenge we need to guess a new number.
---

[Link to Medium article](https://coinsbench.com/capture-the-ether-guess-the-new-number-fa8df008023c)
<!-- 
Capture The Ether: guess the new number
In this challenge we need to guess a new number with some similar characteristics to the previous one: the answer is the keccak256hash of the blockhash of the previous block and a timestamp, all casted to a uint8.


In that last challenge the answer was created when deploying the contract (with the constructor) and remained constant as it was recorded in the blockchain. We just had to find the information that was missing and then call the guess function.

This time, there’s a catch! That integer is not created with the constructor, but at the same time as the guess function is called. So, until we do so, there’s no answer whatsoever.

How can we guess that number, then? Should we try and anticipate the block number, maybe pay a high gas fee so that our contract gets prioritised and follow closely the unix time counter to try and hit the timestamp? That sounds pretty hard and probably a waste of a lot of ether.

There’s a better solution for this, for which we will need to create a new contract to interact with the challenge.

For the anxious, here’s the code i’ve written to do so:


First of all, there’s an interface in order to call the challenge contract.

When deploying the GuessTheNumberSolver contract, we must specify the challenge’s address so that the interface connects to it.

I’ve also added the owner variable and assigned it to the msg.sender (the EOA that deployed the contract). Doing this gives us the possibility of establishing limits to the execution of the functions that we decide. In this case i’ve included a require statement to the solve function so that only the owner may execute it. This function in particular is critical because it moves ether between contracts, so it must be protected.

Going back to our challenge, as we’re not going to actually guess the number, how can we call the function? What parameter can we send with it? We know it’s a uint8 type variable, but how can we predict the two pieces of information (block number and timestamp) that will determine what that uint8 will be?

Remember that when defining a variable, we do not necessarily need to explicitly define the value. That value may be the result of an arithmetic operation (if it’s an integer) or some other value casted into the type we want.

In fact, there’s one clear example of this in the challenge:

uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
So what if we send that same variable?

That’s what happens on line 21 and 22. We define the variable in the same way that is in the challenge and we send it when calling the guess function.

That way, both answer variables will be assigned at the same time and therefore the result will be the same.

Some things to add:

There are differences in the syntax because i’m using solidity compiler ^0.8.0 and the challenge is using version ^0.4.21.
The transferfunctionality which i’ve added in the solvefunction is very important if you don’t want your ether to be locked inside this new contract.
Other way of doing this is creating a new withdraw() function and including that line there to be executed only when calling it, but that’s just creating a new manual step.
We need to add the receive() function, otherwise the transaction will fail as our contract won’t be able to receive the ether.

That’s it! On the next article we’ll solve the Predict the future challenge.
 -->
