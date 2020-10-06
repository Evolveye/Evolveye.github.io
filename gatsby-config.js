module.exports = {
  siteMetadata: {
    description: `Personal site of scientist and programmer experimentator -- Paweł Stolarski also known as Evolveye.`,
    author: `Paweł Stolarski`,
  },
  plugins: [
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    { resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    { resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              showCaptions: true,
              // markdownCaptions: true,   not working
            },
          },
        ],
      },
    },
    { resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    { resolve: `gatsby-source-filesystem`,
      options: {
        name: `single component projects`,
        path: `${__dirname}/src/scp`,
      },
    },
    { resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Evolveye's personal website`,
        short_name: `Evolveye`,
        start_url: `/`,
        background_color: `#0055cc`,
        theme_color: `#0055cc`,
        display: `minimal-ui`,
        icon: `src/images/evolveye_avatar.png`,
      },
    },
  ]
}
