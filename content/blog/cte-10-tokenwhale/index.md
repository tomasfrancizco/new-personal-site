---
title: "Capture The Ether: token whale"
date: "2022-03-29T22:12:03.284Z"
description: "Our objective here is to accumulate at least 1,000,000 SET tokens."
---

[Link to Medium article](https://coinsbench.com/capture-the-ether-token-whale-8d33ea2fd754)
<!-- 
Capture The Ether: token whale
With this new challenge, we need to step up our game a bit. Our first glance at the contract tells us that it’s more complex than the previous ones, just by the length and number of functions:


Our objective here is to accumulate at least 1,000,000 SET tokens.

Let’s start by analyzing it to understand what our options are.

The constructor (in this case it’s the function TokenWaleChallenge() because we are using an older compiler version) defines the variable player as ourselves (our EOA), and the totalSupply and our balanceOf in 1000.

Here we can see the first interesting thing, that totalSupply variable is not actually used anywhere else in the contract, so it basically does nothing and may as well not be there at all.

There are three “callable” (with public visibility) functions:

transfer(): it requires that we have the funds (or more) that we want to send to an account from our account (msg.sender’s). Then it calls the internal _transfer function, which updates the balances of the sender and the receiver.
transferFrom(): it lets us send SET tokens from one account to another. The from account in this case mustn’t be ours. We have to call approve() first.
approve(): we have to call it before we call transferFrom(). Here, we can give permission to someone to transfer SET tokens from our account to another.
The logical transfer from account A to account B transaction flow would look something like this:

Option 1.

Account A calls transfer(B, any value <= acc. A's balance);
Option 2.

Account A calls approve(B, value);.
Account B calls transferFrom(A, B, value < previously approved value);
But these are the expected paths, and one thing that we must always consider as auditors or bug hunters is that these paths are almost never where interesting things happen.

So let’s play a little with what we can: arguments and accounts, and try a different approach.

What if we try this?

Account A calls transfer(B, 510);
Account B calls approve(A, 1000);
Account A calls transferFrom(B, B, 500);
Let’s dive into each step.

Account A starts with a balanceOf 1000, so if we transfer a bit more than half of it to account B the new balances become balanceOf[A] = 490 & balanceOf[B] = 510.

Then, account B authorizes account A to transfer tokens on their behalf, for or less than a fixed value, in this case 1000.

Until here, nothing’s out of the ordinary or the expected path that regular users would follow if they wanted to make a couple of transactions.

But the third step is where something unexpected happens: account A, with its new permissions, calls transferFrom() with a catch, it transfers 500 tokens from account B to account B.

The last step inside transferFrom() is to call _transfer(to, value), in this case that would be _transfer(B, 500).

So going to _transfer() we see that the first step is balanceOf[msg.sender] -= value => balanceOf[A] -= 500. Remember that balanceOf[A] = 490 so this will underflow the balance and leave us with a balanceOf[A] = 115792089237316195423570985008687907853269984665640564039457584007913129639926.


The key thing here is that the balanceOf[A] left in the first transfer() needs to be lower than the value then used in transferFrom() in the 3rd step.

Some possible solutions for this bug would be:

Using SafeMath.
Adding require(from != to) inside transferFrom() so we make sure transfers are between different accounts.
Applying inside _transfer() the totalSupply variable to revert a transaction if that number is exceeded.
Conclusion: always try to think outside the box when analyzing contracts, the expected path is almost never where the bugs are.

That’s it for this exercise, next article will be about Retirement Fund challenge.
 -->
