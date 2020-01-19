import { importScript } from "./importer.js"

/** @type {HTMLCanvasElement} */
export const bgrCanvas = document.querySelector( `.canvas` )
/** @type {HTMLCanvasElement} */
export const subCanvas = document.querySelector( `.subpage-canvas` )
export const bgrCtx = bgrCanvas.getContext( `2d` )
export const subCtx = subCanvas.getContext( `2d` )

const githubApiHelperAddress = `https://europe-west1-evolveye-serverless-265611.cloudfunctions.net/githubApi`
const ui = {
  content: document.querySelector( `.content` ),
  subpage: document.querySelector( `.subpage-elements` ),
  description: document.querySelector( `.ui-description` ),
  inputs: document.querySelector( `.ui-inputs` ),
}

// /
// UI
//

function runSubpage( scriptSrc ) {
  subCtx.clearRect( 0, 0, subCanvas.width, subCanvas.height )

  subCtx.lineWidth = 1

  importScript( scriptSrc.charAt( 0 ) == `/` ? scriptSrc : `/${scriptSrc}` )
  document.querySelector( `.subpage` ).classList.add( `is-showed` )
}
function createSectionItem( elementTag, title, description, action ) {
  const activeElement = document.createElement( elementTag == `button` ? `button` : `a` )
  const titleElement = document.createElement( `h5` )
  const descriptionElement = document.createElement( `p` )

  titleElement.className = `link_box-title`
  titleElement.textContent = title

  descriptionElement.className = `link_box-description`
  descriptionElement.textContent = description

  if (elementTag ==`button`) activeElement.onclick = action
  else if (elementTag ==`a`) activeElement.href = action

  activeElement.className = `link_box`
  activeElement.appendChild( titleElement )
  activeElement.appendChild( descriptionElement )

  return activeElement
}
export function createSectionItemButton( title, description, link ) {
  return createSectionItem( `button`, title, description, link )
}
export function createSectionItemLink( title, description, link ) {
  return createSectionItem( `a`, title, description, link )
}
export function addItemToSection( sectionName, item ) {
  const sectionsParent = ui.content
  let sectionTitle = Array.from( sectionsParent.querySelectorAll( `.content_section-title`) )
    .find( title => title.textContent == sectionName )

  if (!sectionTitle) {
    const title = document.createElement( `h2` )
    const content = document.createElement( `div` )
    const section = document.createElement( `section` )

    title.innerText = sectionName
    title.className = `content_section-title`
    content.className = `content_section-content`

    section.className = `content_section`
    section.appendChild( title )
    section.appendChild( content )

    sectionsParent.insertAdjacentElement( `afterbegin`, section )

    sectionTitle = title
  }

  const sectionItems = sectionTitle.nextElementSibling

  sectionItems.appendChild( item )
}
export function addInputToHeaderUi( type, shortDescription, properties ) {
  const span = document.createElement( `span` )
  const input = document.createElement( `input` )
  const label = document.createElement( `label` )

  span.innerHTML = shortDescription
  span.className = `ui-input_description`
  input.type = type
  input.className = `ui-input is-${type}`
  label.className = `ui-input_label`

  if (type === `button`) input.value = shortDescription
  else label.appendChild( span )

  label.appendChild( input )

  for (const property in properties) input[ property ] = properties[ property ]

  ui.inputs.appendChild( label )

  return { label, input }
}
export function addDescriptionToHeaderUi( description ) {
  ui.description.innerHTML = description
}
export function addElementToSubpage( element ) {
  ui.subpage.appendChild( element )
}
export function clearSubpageStructure() {
  ui.subpage.innerHTML = ``
}

// /
// Canvas
//

export function clear() {
  clearBgrCanvas()
  clearSubcanvas()
}
export function clearBgrCanvas() {
  bgrCtx.clearRect( 0, 0, bgrCanvas.width, bgrCanvas.height )
}
export function clearSubcanvas() {
  subCtx.clearRect( 0, 0, subCanvas.width, subCanvas.height )
}
export function onResize() {
  bgrCanvas.width = bgrCanvas.clientWidth
  bgrCanvas.height = bgrCanvas.clientHeight

  subCanvas.width = subCanvas.clientWidth
  subCanvas.height = subCanvas.clientHeight

  clear()
}
export function clickOnCenteredRectangle( clientX, clientY, { width=canvas.width, height=canvas.height, borderX=0, borderY=0 } ) {
  const x = (canvas.width - width) / 2
  const y = (canvas.height - height) / 2

  return clientX > x + borderX && clientX < x + width - borderX
    && clientY > y + borderY && clientY < y + height - borderY
}

// /
// Others
//

export async function getRateLimits() {
  return await fetch( `${githubApiHelperAddress}?address=/rate_limit` )
    .then( data => data.json() )
    .then( limits => {
      for (const resource in limits.resources)
        limits.resources[ resource ].resetString = new Date( limits.resources[ resource ].reset * 1000 ).toLocaleTimeString()

      return limits
     } )
}
export async function getRepositories( username ) {
  return await fetch( `${githubApiHelperAddress}?address=/users/${username}/repos` )
    .then( data => data.json() )
}
export async function getAllUserReposWebiteConfigJson( username ) {
  /** @type {string[]} */
  const websiteConfigRawAddresses = (await getRepositories( username ))
    .map( repo => repo.name )
    .map( reponame => `https://raw.githubusercontent.com/${username}/${reponame}/master/website_config.json` )

  console.groupCollapsed( `Responses from website_config.json fetcher (404 is not an error)` )

  /**
   * @typedef {Object} WebsiteConfig
   * @property {string} section
   * @property {"module"|"external"} type
   * @property {string} src
   * @property {string} title
   * @property {string} description
   */

  /** @type {WebsiteConfig[][]} */
  const fetchedConfigs = (await Promise.all( websiteConfigRawAddresses.map(
    rawAddress => fetch( rawAddress ).then( res => res.ok ? res.json() : false )
  ) ) ).filter( config => config )

  console.groupEnd()

  return fetchedConfigs
}
export async function buildProjects( username=`Evolveye` ) {
  const websiteConfigs = await getAllUserReposWebiteConfigJson( username )

  websiteConfigs.forEach( config => config.forEach( ({ section, type, src, title, description }) => {
    let elementTag, action

    switch (type) {
      case `external`:
        elementTag = `a`
        action = src
        break

      case `module`:
        elementTag = `button`
        action = () => runSubpage( src )
    }

    addItemToSection( section, createSectionItem( elementTag, title, description, action ) )
  } ) )
}
export function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}
export function rangedCeilFloor( num, max, min=0 ) {
  return num < min ? min
    : num > max ? max
    : num
}

window.addEventListener( `resize`, () => onResize() )
document.querySelectorAll( `.subpage-close` ).forEach( closer => closer.addEventListener( `click`, () => {
  ui.description.innerHTML = ``
  ui.inputs.innerHTML = ``
  closer.parentElement.classList.remove( `is-showed` )
} ) )

// document.onclick = ({ clientX, clientY }) => {
//   const angle = Math.atan2( points[ 0 ].y - clientY, points[ 0 ].x - clientX ) * 180 / Math.PI
//   console.log( angle, rangedCeilFloor( angle, 6, -6 ) )
// }

onResize()