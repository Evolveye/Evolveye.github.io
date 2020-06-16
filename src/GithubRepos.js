import React from "react"
import { Link } from "react-router-dom"

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
      .map( reponame => `https://${username}.github.io/${reponame}` )

    console.groupCollapsed( `Responses from website_config.json fetcher (404 is not an error)` )

    /** @type {WebsiteConfig[]} */
    const fetchedConfigs = (await Promise.all( websiteConfigRawAddresses.map(
      rawAddress => fetch( `${rawAddress}/website_config.json` )
        .then( res => { if (!res.ok) throw new Error(); else return res.json() } )
        .then( arr => arr.map( obj => ({ ...obj, src:`${rawAddress}/${obj.src}` }) ) )
        .catch( () => {} )
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
    const sections = {}
    const content = []
    const iteratorLimit = (this.props.loaders ?? 3) > loadedRepos.length
      ? (this.props.loaders ?? 3)
      : loadedRepos.length

    for (let i = 1; i <= iteratorLimit; i++) {
      if (loadedRepos.length < i) content.push( <LoadingBox key={i} title /> )
      else {
        const { title, description, section, src } = loadedRepos[ i - 1 ]

        if (!(section in sections)) sections[ section ] = []

        sections[ section ].push(
          <Link
            key={i}
            className="github_repos-item"
            to={`/project/${src}`}
            >
            <h4 className="github_repos-item-title">{title}</h4>
            <p className="github_repos-item-description">{description}</p>
          </Link>
        )
      }
    }

    for (const section in sections) {
      content.push( <div key={section} className="github_repos-section">
        <h3 className="github_repos-section-title">{section}</h3>
        {sections[ section ]}
      </div> )
    }

    return <div className="github_repos">
      <h2 className="github_repos-title">Some of my handy projects</h2>
      {content}
    </div>
  }
}