import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";

const Token = ({ data, location }) => {
  const { title } = data.site.siteMetadata;

  return (
    <Layout location={location} title={title}>
      <div style={{marginBottom: "50px"}}>Coming soon...</div>
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