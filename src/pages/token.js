import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";

import TomasToken from "../artifacts/contracts/TomasToken.sol/TomasToken.json";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  // const tokenAddress = "0x47a6cB9E9f88E1Ead25a4BAbc3E86Cd6062a11C3";

  return (
    <Layout location={location} title={title}>
      <div style={{marginBottom: "50px"}}>Próximamente...</div>
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