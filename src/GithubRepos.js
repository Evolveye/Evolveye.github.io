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
    const sections = {}
    const content = []
    const iteratorLimit = (this.props.loaders ?? 3) > loadedRepos.length
      ? (this.props.loaders ?? 3)
      : loadedRepos.length

    for (let i = 1; i <= iteratorLimit; i++) {
      if (loadedRepos.length < i) content.push( <LoadingBox key={i} title /> )
      else {
        const { title, description, section } = loadedRepos[ i - 1 ]

        if (!(section in sections)) sections[ section ] = []

        const sectionParam = section.replace( / /g, `_`).toLowerCase()
        const titleParam   =   title.replace( / /g, `_`).toLowerCase()

        sections[ section ].push(
          <Link
            key={i}
            className="github_repos-item"
            to={`/projects/${sectionParam}/${titleParam}`}
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