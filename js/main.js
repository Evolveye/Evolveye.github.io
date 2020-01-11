import { Point, MovingCircle } from "./classes.js";
import {
  bgrCanvas as canvas,
  random,
  bgrCtx as ctx,
  clearBgrCanvas,
  getDirectoryInfoFromGithubApi,
  getProjectAsSectionItem,
  addItemToSection
} from "./functions.js"
import { importScript, addDescription, addInput } from "./importer.js";


const importer = document.querySelector( `.importer` )
importer.addEventListener( `click`, () => {
  importScript( `/simple_mini_projects/bresenham-copy/main.js` )
  const subpage = document.querySelector( `.subpage` )
  subpage.classList.add( `is-showed` )
} )


const padding = 10
/** @type {MovingCircle[]} */
const circles = []
/** @type {Point[]} */
const points = []
/** @type {string[]} */
const colors = [
  `#202022`
  // `#f33`,
  // `#5a5`,
  // `#55f`,
  // `#dd5`,
  // `#f0f`
]
const dotColor = `#333`

generatePoints()

setInterval( () => {
  circles.forEach( circle => circle.tick() )

  requestAnimationFrame( () => draw() )
}, 1000 / 60 )
getDirectoryInfoFromGithubApi( `Evolveye.github.io`, `simple_mini_projects/` ).then( project => {
  project.forEach( async folder => {
    const projectSectionItem = await getProjectAsSectionItem( `Evolveye.github.io`, `simple_mini_projects/${folder.name}` )

    addItemToSection( `Simple mini projects`, projectSectionItem )
  } )
} )

function generatePoints() {
  const width = window.innerWidth
  const height = window.innerHeight

  circles.splice( 0 )
  points.splice( 0 )

  for (let fails = 0; fails < 100;) {
  // for (let fails = 0; fails < 2; fails++ ) {
    const point = new Point( random( 0, width ), random( 0, height ) )
    let addIt = true

    for (const pointInArr of points) if (point.distanceTo( pointInArr ) < 100) {
      addIt = false
      break
    }

    if (addIt) points.push( point )
    else fails++
  }

  for (let circlesCount = 20; circlesCount; --circlesCount )
    circles.push( new MovingCircle( random( padding, width - padding ), random( padding, height - padding ), {
      color: colors[ random( 0, colors.length - 1 ) ],
      speed: random( 20, 50 ),
      size: 5
    } ) )
}
function draw() {
  clearBgrCanvas()

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