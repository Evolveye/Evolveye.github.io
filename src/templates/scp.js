import React from "react"
// import { graphql } from "gatsby"

import Layout from "../components/layout"

export default ({ data, pageContext:{ langKey, scp } }) =>
  <Layout title={scp} langKey={langKey}>
    {scp}
  </Layout>
