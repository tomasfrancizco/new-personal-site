import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { ethers } from 'ethers';

import Layout from "../components/layout";
import Bio from "../components/bio";
import Seo from "../components/seo";
import TokenForm from "../components/token_form";

import TomasToken from "../artifacts/contracts/TomasToken.sol/TomasToken.json";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  const [receiverAccount, setReceiverAccount] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [chain, setChain] = useState(true);
  const [addressError, setAddressError] = useState(false);
  const [metamask, setMetamask] = useState();
  const [loading, setLoading] = useState(false)

  const tokenAddress = "0x4311c06d1d3160C0B07D29c30E48027C0fE30e3c";

  async function requestAccount() {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account;
  }

  async function requestNetwork() {
    const network = await window.ethereum.networkVersion;
    return network;
  }

  const checkInputAddress = address => {
    const hexa = "0123456789abcdefABCDEF"
    if(receiverAccount.length !== 42 || receiverAccount[0] !== "0" || receiverAccount[1] !== "x"){
      setAddressError(true);
      return false;
    }
    for(let i=2;i<receiverAccount.length;i++){
      if(!hexa.includes(receiverAccount[i])) {
        setAddressError(true);
        return false;
      }
    }
  }

  const checkChain = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const network = await requestNetwork()
      if(network === "5"){
        setChain(true);
        setDisabled(false);
      } else {
        setChain(false);
        setDisabled(true);
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setMetamask(true)
      checkChain();
      const continuousCheck = setInterval(() => {
        checkChain();
      }, 2000)
      return () => clearInterval(continuousCheck)
    } else {
      setMetamask(false)
    }
  }, [])


  async function transferToken() {
    if (typeof window.ethereum !== 'undefined') {
      try {
          if(!checkInputAddress(receiverAccount)){
            await requestAccount();
            const user = receiverAccount;
            setReceiverAccount("");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, TomasToken.abi, signer);
            const transaction = await contract.transfer(user, "1000000000000000000")
            setAddressError(false);
            setLoading(true);
            await transaction.wait();
            setLoading(false)
          }
      } catch (err) {
        console.log({ err })
      }
    }
  }


  return (
    <Layout location={location} title={title}>
      <Seo title="Token"/>
      <div className="token-container">
        <h5>TFK Token</h5>
        <p style={{"margin": "-20px 0 0 0"}}>Receive it on Goerli testnet</p>
        <p>You can add it to your wallet using <a href="https://goerli.etherscan.io/address/0x4311c06d1d3160C0B07D29c30E48027C0fE30e3c">this address</a></p>
        <input disabled={disabled} onChange={e => setReceiverAccount(e.target.value)} value={receiverAccount} placeholder="Your GoerliETH address" />
        <button disabled={disabled} onClick={transferToken}>Receive 1 TFK</button>
        <div className="token-error-container">
          <div style={{"color": "red"}} className="token-error">{metamask ? null : "Install Metamask to continue" }</div>
          <div style={{"color": "red"}} className="token-error">{chain ? null : "Connect to Goerli testnet to continue" }</div>
          <div style={{"color": "red"}} className="token-error">{addressError ? "Please enter a valid Ethereum address" : null } </div>
        </div>
      </div>
      <hr />
      {/* <TokenForm transferToken={transferToken}  /> */}
      <footer className="token-footer">
        <Bio />
      </footer>
      <div className={loading ? "loading-container" : null}>
        <div className={loading ? "lds-dual-ring" : null}></div>
      </div>
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