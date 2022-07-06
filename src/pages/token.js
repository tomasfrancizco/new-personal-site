import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { ethers } from 'ethers';

import Layout from "../components/layout";
import Bio from "../components/bio";

import TomasToken from "../artifacts/contracts/TomasToken.sol/TomasToken.json";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  const [userAccount, setUserAccount] = useState();
  const [account, setAccount] = useState();
  const [disabled, setDisabled] = useState(true);
  const [chain, setChain] = useState();

  const tokenAddress = "0x6a431Ee7F43aAA6cf14175d5986Bc4E2b1311B6A";

  async function requestAccount() {
    const _account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return _account;
  }

  useEffect(() => {
    const checkChain = setInterval(() => {
      async function getChain() {
        const { chainId } = await window.ethereum;
        if(chainId === "0x3"){
          setChain(true);
          setDisabled(false);
        } else {
          setChain(false);
          setDisabled(true);
        }
      }
      getChain()
    }, 2000)
    return () => clearInterval(checkChain)
  }, [])

  async function transferToken() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, TomasToken.abi, signer);
      const transaction = await contract.transfer(userAccount, "1000000000000000000")
      await transaction.wait();
    }
  }


  return (
    <Layout location={location} title={title}>
      <div className="token-container">
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Your ETH account" />
        <button disabled={disabled} onClick={transferToken}>Claim Token</button>
        
        <div style={{"color": "red"}}>{chain ? null : "Por favor conectate a Ropsten para continuar" }</div>
      </div>
      <hr />
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