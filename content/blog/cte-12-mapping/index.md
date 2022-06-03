---
title: "Capture The Ether: mapping"
date: "2022-05-09T22:12:03.284Z"
description: "Let's dive into Ethereum’s storage layout."
---

[Link to Medium article](https://coinsbench.com/capture-the-ether-mapping-ab24ac2c9244)
<!-- 
Capture The Ether: mapping
This challenge is quite interesting and particular as it’s the first one in which we need to dive into Ethereum’s storage layout.

Let’s start by taking a look at the contract:


The variables and functions are…

A bool isComplete, which by default is set to false.
An array map with dynamic size, that is, with no fixed amount of data in it ([]).
A function set, with which we can set a value for a specific index of the dynamically sized array.
A function get, that returns the value of the key/index we ask for.
This is nice, but wait… There isn’t any function that changes that bool to true, so how can we solve this challenge?

To do this, we’ll need to understand how a smart contract’s storage layout is defined and managed.

According to the docs, every contract has its own storage, which is actually a mapping of 2²⁵⁶ * 32-bytes-slots. This will be particularly important soon, so keep it in mind.

Here, state variables are stored side by side such that multiple values sometimes use the same slot if they fit. Of course, there are some rules for this layout & Dynamic sized arrays (DSAs)and mappings are an exception for it, too.

What concerns us now are the DSAs. As they have unpredictable sizes, they can not be stored side by side with state variables. Instead, they are considered to occupy only a slot that contains the number of elements of the array, or length, and the elements they contain are stored starting at a different storage slot that is computed using a Keccak-256 hash of the previously mentioned slot, with the same rules as state variables.

E.g.:

uint256[] public arr = [1, 2, 3];

Assuming this is the first line in our contract, the length of the DSA arr will be stored in slot 0 and the values will be stored starting on slot number keccak256(0), this is…

uint256 valuesSlot = 18569430475105882587588266137607568536673111973893317399460219858819262702947

So, if we read valuesSlot we’ll get 1, valuesSlot + 1 we’ll get 2 and so on.

And at the same time, if we want to change arr[0] we’ll be changing the slot valuesSlot and arr[1] will change the slot valueSlot + 1.

Now that we know this, let’s go back to our challenge and break it down:

There is the bool stored in slot 0.

bool public isComplete;

And themap’s length stored in slot 1, while their soon to be values will be stored starting (with map[0]) in keccak(1), that is

valuesSlot = 80084422859880547211683076133703299733277748156566366325829078699459944778998

Having all of this in mind and our objective being changing storage slot 0’s value from 0 (false) to 1 (true), what we need to do is overflow storage slots (remember that the contract has 2²⁵⁶ of them) by accessing the correct array’s index.

How can we know which index is the correct one? Quite easy, actually, we need to calculate the attackSlot = 2^256 - valuesSlot;

In the challenge’s case, this will be attackSlot = 35707666377435648211887908874984608119992236509074197713628505308453184860938.

There is something else we need to know although it’s already dealt with in the challenge’s contract. To access any slot like this, it needs to be part of the array, which means that the index must always be < array.length. And that’s the purpose of these lines in the set function:

if (map.length <= key) {
  map.length = key + 1;
}
So, to solve the challenge, we must call set(attackSlot, 1);

Conclusion: although it may not be apparent at first, we must understand and be very careful with how storage works in Ethereum, as it might be a potential attack vector.

Please also note that this issue has been solved from solidity compiler ≥ 0.6.0.


Awesome! In the next article, we’ll be solving “Donation”. -->