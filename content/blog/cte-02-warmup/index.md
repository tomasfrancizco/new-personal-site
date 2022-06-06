---
title: "Capture The Ether: warmup"
date: "2021-12-22T22:12:03.284Z"
description: En este artículo vamos a empezar con los primeros tres desafíos de "Capture The Ether". Estos son solo ejercicios de calentamiento y no se necesita mucho análisis de seguridad.
---

[Link to Medium article](https://medium.com/@tomasfrancisco/capture-the-ether-warmup-7b3183469e17)
<!-- 
Capture The Ether: warmup
In this article we’ll start with the first three challenges from Capture The Ether. These are just warmup exercises and not much security analysis is necessary but hey, it’s a good way of starting to get used to the structure of smart contracts, the tools we’ll be working with and the different options we have to interact with them.

Deploy a Contract
This one is pretty straight forward. The first three steps described here are the ones we saw in the previous article: install Metamask, switch to Ropsten network and get some rETH.

Then, the only thing we must do is deploy the contract, but what does that even mean? Well, basically we are storing the contract’s data (the code) in the blockchain… For ever. The technical side of this indicates that we must send a transaction, which is a message sent from one account to another and may include data (only for smart contracts) and/or ether. To deploy contracts there is a special destination address called the zero address (0x0). CTE handles this task behind the scenes when we click on Begin Challenge.

Once we do this, we have to wait some seconds for our transaction to be processed (an average of 15") and we’ll be able to see our contract’s address. That’s the id in which all the code will be stored in the BC. You can look that up on Etherscan and see the info associated with it. Etherscan is a popular tool used to look up transaction’s information. Every new transaction is recorded there.

When clicking on ‘Check Solution’, we are ‘calling’ (we’ll se what that means in the next exercise) the function isComplete(), which in this case only returns true. Let’s go ahead to our next challenge.


Call me
Here we have to ‘call’ a function. To do this, first we need to deploy the contract. Click on Begin challenge to let CTE handle that for you.

Ok, what’s going on now? You can try and click on Check Solution but you’ll get an error message. This is because for every challenge, CTE checks if the isComplete variable is set to true. In this case, when deploying the contract we can see that the variable is set to false, and the only way to change that is executing the callme() function. So, how do we call it?

There are several ways of interacting with the blockchain (CLIs, APIs, UIs), but one of the fastest and user friendly options is via a website called remix.

Go ahead and create a new file in the ‘contracts’ folder and name it Callme.sol (or however you want). Then, copy the contract’s code into the editor. Next, you need to go to the Deploy and run transactions tab (third at the left of your screen), change the environment to Injected Web3, paste the contract’s address where it says ‘At Address’ and click on it.


What have we done now? We have accessed the instance of the contract that was deployed previously to the blockchain, via this UI and now we can interact with it. We could have clicked on the deploy button, but by doing so we would have created a new instance of the contract (re deploy) and any interaction with it would’ve never reached CTE.

Go ahead and click on the orange callme button that’s appeared below, wait a few seconds and check the solution on CTE.

Choose a nickname
Ok! Things are starting to get a little bit more interesting.

In this file we have two contracts. On one hand we have the CaptureTheEther contract that has already been deployed to the address 0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee. And on the other hand there is the NicknameChallenge contract that is going to be deployed to a new address once we click on Begin Challenge.

First, we have to call the setNickname() function, so we’ll repeat the process of the previous exercise: create a new file in remix, copy the code, etc. Remember that we need to access the instance of the already deployed contract, so we must copy the address that’s been given to us (0x71c4…) and click on ‘At Address’.

Once we’ve done that, we’ll have access to the setNickname() function and we can enter the nickname we want, but wait, it must be of type bytes32!

There are some websites that let us convert strings to type bytes32, i’ve used this one with one thing to have in mind: in order for it to work, we need to add 2 more 0s at the end of it to keep the correct length of this type.

Call the function with your nickname in bytes32 type and check the solution.


That’s it! We’ve made it through the warmup section of CTE. In the next article we’ll try and beat the Guess the number challenge. -->