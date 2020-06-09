import React from "react"

import LoadingBox from "./LoadingBox.js"

import "./GithubRepos.css"

/**
 * @typedef {Object} WebsiteConfig
 * @property {string} section
 * @property {"module"|"external"} type
 * @property {string} src
 * @property {string} title
 * @property {string} description
 */

export default class GithubRepos extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      /** @type {WebsiteConfig[]} */
      loadedRepos: [],
    }

    this.githubApi = `https://europe-west1-evolveye-serverless-265611.cloudfunctions.net/githubApi`
  }

  async getRepositories( username ) {
    return await fetch( `${this.githubApi}?address=/users/${username}/repos` )
      .then( data => data.json() )
  }

  async getAllUserReposWebiteConfigJson( username ) {
    /** @type {string[]} */
    const websiteConfigRawAddresses = (await this.getRepositories( username ))
      .map( repo => repo.name )
      .map( reponame => `https://raw.githubusercontent.com/${username}/${reponame}/master/website_config.json` )

    console.groupCollapsed( `Responses from website_config.json fetcher (404 is not an error)` )

    /** @type {WebsiteConfig[]} */
    const fetchedConfigs = (await Promise.all( websiteConfigRawAddresses.map(
      rawAddress => fetch( rawAddress ).then( res => res.ok ? res.json() : false )
    ) ) ).filter( config => config ).flat()

    console.groupEnd()

    return fetchedConfigs
  }

  componentDidMount() {
    this.getAllUserReposWebiteConfigJson( `evolveye` )
      .then( loadedRepos => this.setState( { loadedRepos } ) )
  }

  render() {
    const { loadedRepos } = this.state
    const content = []
    const iteratorLimit = (this.props.loaders ?? 3) > loadedRepos.length
      ? (this.props.loaders ?? 3)
      : loadedRepos.length

    for (let i = 1; i <= iteratorLimit; i++) {
      if (loadedRepos.length < i) content.push( <LoadingBox key={i} title /> )
      else {
        const { title, description } = loadedRepos[ i - 1 ]

        content.push( <div className="github_repos-item" key={i}>
          <h3 className="github_repos-title">{title}</h3>
          <p className="github_repos-description">{description}</p>
        </div> )
      }
    }

    return <div className="github_repos">
      <h2 className="fav_techs-title">Some of my handy projects</h2>
      {content}
    </div>
  }
}