---
title: "Capture The Ether: predict the future"
date: "2022-02-08T22:12:03.284Z"
description: "Es posible predecir el futuro en Ethereum? La respuesta: más o menos."
---

[Link to Medium article](https://coinsbench.com/capture-the-ether-predict-the-future-cb5acf12a8cb)
<!-- 
Capture The Ether: predict the future
Is it possible to predict the future in the Ethereum world? The answer is: kind of.

I’m not going to lie, I found this challenge quite difficult and it took me several days of trying and reading documentation before I could solve it.

There are not straight forward ways to complete it nor the solution I found guarantees that’s going to be solved on the first try.

Let’s analyze the most important parts of the contract.


Apart from the variables and the constructor, there are other three key functions (you can skip this part if you’re looking for the solution 😃):

isComplete: returns a boolean indicating if the challenge has been solved by checking the contract’s balance, that should be 0. We’ve previously sent 1 ether with the constructor and the only way of getting it back is by solving the challenge.
lockInGuess: this is the first function that we need (and are able) to call in order to ‘play’ this game. It does quite a few things:
- Requires that the guesser is in its default, initial value: 0.
- Requires that we send another ether.
- Sets the guesser variable to our account (msg.sender)
- Sets the guess variable to the parameter we included when calling the function.
- Sets the settlementBlockNumber to the next block.number of the one in which our transaction is included.
settle: this is the final function and the one we need to call to solve the challenge.
- Requires that the guesser has already ben assigned to the msg.sender. This is why we need to have called the lockInGuess function before settle.
- Requires the block.number of this transaction to be bigger/higher than the settlementBlockNumber that we set in lockInGuess. Another thing that defines the order of the functions.
- Sets a uint8 variable answer to the keccak256 hash of the previous blockhash and the timestamp, then casts that into a uint8 and then applies the modulus of 10. This is very important, because now we know that the number we have to predict is just between 0 and 9.
- Sets the guesser back to 0 and if guess and answer are the same, we get back our two ethers.
This is the solution that I wrote:


First of all, there’s an interface that will allow us to call the challenge from our custom contract.

When we deploy the PredictTheFutureSolver we need to include the challenge’s address with the constructor (you can look for it on the CTE site). That’s how both contracts connect with each other.

Then, as the order of the challenge’s functions allow us, we need to call lockNumber with any number we want between 0 and 9. I’ve added a require statement so that if by mistake or distraction we try to send an out of range number, the transaction will revert. Remember to send 1 ether with this call, as required by lockInGuess.

Ok, so we’ve locked our guess. Now what? We could try and actually guess the answer. But what happens if we decide to just do that? As we’ve seen in the settle function, the guesser gets set back to 0 (line 4 in the fn), but it is a requirement for it to be the msg.sender before (line 1). So if we miss, we would need to call lockInGuess again along with 1 ether to re-set the guesser! Not a very smart business, if you ask me.

So, what can we do to be able to miss the guess but avoid starting again?

As you can see in the settleChallenge function, three things happen.

The challenge’s settle function is called.
It is required that the challenge’s isComplete function returns true.
An event is emitted.
The key here is the require statement.

One of the main properties of the Ethereum transactions is that they are atomic. It is all or nothing, they can’t partially do what they are intended to do.

Require statements are usually added first, but in this case, as something needs to happen before (the answer has to be set and compared to guess), i’ve added it on the second line of our function. Post calling settle.

This is what’s going to happen:

The settle function is called.
If answer and guess are different…

2. The challenge won’t send us its 2 ethers.

3. The isComplete function will return false (because the balance is not 0).

4. The settleChallenge function will revert and any change will go back

If answer and guess are equal…

2. The challenge will send us 2 ethers, draining its balance.

3. The isComplete function will return true.

4. The settleChallenge function won’t revert and the event will be emitted.

Now it’s time to spam the challenge. We need to start calling settleChallenge until the answer equals our previous guess. Remember that you must wait at least one more block to be mined (~15 seconds) before doing it. And you will spend some gas with the calls, but that’s definitely better than sending 1 ether each time you want to guess.

The other thing to be aware of is that when you finally guess the answer, the challenge will send the ethers to the contract, not your externally owned account. That’s the reason i’ve added the withdraw function. Remember this if you don’t want to lose them.

If you want to try all of this without spending rETHs first, assuming you are using remix, you can switch your environment from Injected Web3 to Javascript VM and play a little bit. The only thing that you need to keep in mind is that you won’t be able to include any line that has block information, so the settlementBlockNumber must go and you can replace the block.blockhash(block.number — 1) part for any number you want, and it will work the same.


That’s it! You can tell me if you had issues or ask me any questions. On the next article we’ll solve the last of the Lotteries challenges: ‘Predict the block hash’.
 -->
