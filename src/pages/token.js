import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { ethers } from 'ethers';

import Layout from "../components/layout";
import Bio from "../components/bio";

import TomasToken from "../artifacts/contracts/TomasToken.sol/TomasToken.json";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  const [account, setAccount] = useState();
  const [disabled, setDisabled] = useState(true);
  const [chain, setChain] = useState();

  console.log({ account })

  // const tokenAddress = "0x47a6cB9E9f88E1Ead25a4BAbc3E86Cd6062a11C3";
  const tokenAddress = "0x6a431Ee7F43aAA6cf14175d5986Bc4E2b1311B6A";
  const receiver = "0x08f88ef7ecD64a2eA1f3887d725F78DDF1bacDF1";

  useEffect(() => {
    account !== undefined ? setDisabled(false) : setDisabled(true);
  }, [account])

  useEffect(() => {
    async function getChain() {
      const { chainId } = await window.ethereum;
      console.log(chainId)
      if(chainId === "0x3"){
        setChain(true)
      } else {
        setChain(false)
      }
      // chainId == "0x3" ? setChain(true) : setChain(false);
    }
    getChain()
  }, [])

  async function requestAccount() {
    const _account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log({ _account })
    setAccount(_account);
  }

  async function transferToken() {
    if (typeof window.ethereum !== 'undefined') {
      console.log({ account })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider })
      const signer = provider.getSigner();
      console.log({ signer })
      const contract = new ethers.Contract(tokenAddress, TomasToken.abi, signer);
      console.log({ contract })
      const transaction = await contract.transfer(account[0], 1000000000000000)
      console.log({ transaction })
      await transaction.wait();
      console.log({ transaction })
      console.log(`Token successfully sent to ${account[0]}`);
    }
  }


  return (
    <Layout location={location} title={title}>
      <button onClick={requestAccount}>Connect Wallet</button>
      {/* <input onChange={e => setUserAccount(e.target.value)} placeholder="Your ETH account" /> */}
      <button disabled={disabled} onClick={transferToken}>Claim</button>
      <div style={{marginBottom: "50px"}}>Próximamente...</div>
      <button onClick={() => console.log(chain)}>chain</button>
      <button onClick={() => console.log(account)}>account</button>
      <div>{chain ? "You are connected to the correct chain" : "You are connected to the wrong chain" }</div>
      <hr />
        {/* <div className="button-container">
          <button className="token-button">Connect Wallet</button>
          <button className="token-button">Claim Token</button>
        </div> */}
      <footer>
        <Bio />
      </footer>
    </Layout>
  )
}

export default Token

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }`