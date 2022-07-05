import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";

import TomasToken from "../artifacts/contracts/TomasToken.sol/TomasToken.json";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  const tokenAddress = "0xFE78443dD29cebFcA0Ff8d8D59c16c30535bc778";
  
  return (
    <Layout location={location} title={title}>
      <div style={{marginBottom: "50px"}}>Coming soon...</div>
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