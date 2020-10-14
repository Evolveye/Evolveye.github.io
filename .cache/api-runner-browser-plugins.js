module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"extensions":[".mdx",".md"],"gatsbyRemarkPlugins":[{"resolve":"gatsby-remark-images","options":{"maxWidth":1000,"showCaptions":true}}]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Evolveye's personal website","short_name":"Evolveye","start_url":"/","background_color":"#0055cc","theme_color":"#0055cc","display":"minimal-ui","icon":"src/images/evolveye_avatar.png","cache_busting_mode":"query","include_favicon":true,"legacy":true,"theme_color_in_head":true,"cacheDigest":"c57a76bed246c5634bdb788eaf30a5cd"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
