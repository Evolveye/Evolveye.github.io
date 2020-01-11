
/** @type {HTMLCanvasElement} */
export const bgrCanvas = document.querySelector( `.homepage-canvas` )
/** @type {HTMLCanvasElement} */
export const subCanvas = document.querySelector( `.subpage-canvas` )
export const bgrCtx = bgrCanvas.getContext( `2d` )
export const subCtx = subCanvas.getContext( `2d` )

export function addItemToSection( sectionName, item ) {
  const section = Array.from( document.querySelectorAll( `.content_section-title`) )
    .find( title => title.textContent == sectionName )

  const sectionItems = section.nextElementSibling

  sectionItems.appendChild( item )
}
export function createSectionItem( title, description, link ) {

  const linkBoxElement = document.createElement( `a` )
  const titleElement = document.createElement( `h5` )
  const descriptionElement = document.createElement( `p` )

  titleElement.className = `link_box-title`
  titleElement.textContent = title

  descriptionElement.className = `link_box-description`
  descriptionElement.textContent = description


  linkBoxElement.href = link
  linkBoxElement.className = `link_box`
  linkBoxElement.appendChild( titleElement )
  linkBoxElement.appendChild( descriptionElement )

  return linkBoxElement
}
/**
 * @return {Promise<GithubApiDirectoryInfo[]>}
 */
export async function getDirectoryInfoFromGithubApi( repository, path='' ) {
  return await fetch( `https://api.github.com/repos/evolveye/${repository}/contents/${path}` )
    .then( data => data.json() )
}
export async function getProjectAsSectionItem( repository, pathToProjects ) {
  const pathEndedWithSlash = pathToProjects.endsWith( `/` ) ? pathToProjects : `${pathToProjects}/`
  const { title, description } = await getDirectoryInfoFromGithubApi( repository, `${pathEndedWithSlash}info.json` )
    .then( info => atob( info.content ) )
    .then( info => JSON.parse( info ) )

  return createSectionItem( title, description, pathEndedWithSlash )
}
export function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}
export function rangedCeilFloor( num, max, min=0 ) {
  return num < min ? min
    : num > max ? max
    : num
}

// /
// Canvas functions
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

window.addEventListener( `resize`, () => onResize() )

// document.onclick = ({ clientX, clientY }) => {
//   const angle = Math.atan2( points[ 0 ].y - clientY, points[ 0 ].x - clientX ) * 180 / Math.PI
//   console.log( angle, rangedCeilFloor( angle, 6, -6 ) )
// }

onResize()