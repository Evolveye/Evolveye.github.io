function addItemToSection( sectionName, item ) {
  const section = Array.from( document.querySelectorAll( `.content_section-title`) )
    .find( title => title.textContent == sectionName )

  const sectionItems = section.nextElementSibling

  sectionItems.appendChild( item )
}
function clockwiseAngle( angleA, angleB ) {
  let biggerAngle, smallerAngle, sign

  if (angleA > angleB) {
    biggerAngle = angleA
    smallerAngle = angleB
    sign = 1
  } else {
    biggerAngle = angleB
    smallerAngle = angleA
    sign = -1
  }

  const clockwiseMove = biggerAngle - smallerAngle
  const anticlockwiseMove = smallerAngle + 360 - biggerAngle

  if (anticlockwiseMove < clockwiseMove) return anticlockwiseMove * sign
  else return clockwiseMove * -sign
}
function createSectionItem( title, description, link ) {

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
function draw() {

  ctx.clearRect( 0, 0, width, height )

  ctx.fillStyle = dotColor

  for (const { x, y } of points) {
    ctx.beginPath()
    ctx.arc( x, y, 2, 0, Math.PI * 2 )
    ctx.fill()
  }

  ctx.lineWidth = 7

  for (const circle of circles) {
    const { x, y, color, size } = circle

    if (!circle.pointToMove) circle.pointToMove = points[ random( 0, points.length - 1 ) ]

    ctx.strokeStyle = color

    ctx.beginPath()
    ctx.arc( x, y, size, 0, Math.PI * 2 )
    ctx.stroke()
  }
}
/**
 * @return {Promise<GithubApiDirectoryInfo[]>}
 */
async function getDirectoryInfoFromGithubApi( repository, path='' ) {
  return await fetch( `https://api.github.com/repos/evolveye/${repository}/contents/${path}` )
    .then( data => data.json() )
}
async function getProjectAsSectionItem( repository, pathToProjects ) {
  const pathEndedWithSlash = pathToProjects.endsWith( `/` ) ? pathToProjects : `${pathToProjects}/`
  const { title, description } = await getDirectoryInfoFromGithubApi( repository, `${pathEndedWithSlash}info.json` )
    .then( info => atob( info.content ) )
    .then( info => JSON.parse( info ) )

  return createSectionItem( title, description, pathEndedWithSlash )
}
function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}
function rangedCeilFloor( num, max, min=0 ) {
  return num < min ? min
    : num > max ? max
    : num
}

window.addEventListener( `resize`, () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
} )

// document.onclick = ({ clientX, clientY }) => {
//   const angle = Math.atan2( points[ 0 ].y - clientY, points[ 0 ].x - clientX ) * 180 / Math.PI
//   console.log( angle, rangedCeilFloor( angle, 6, -6 ) )
// }