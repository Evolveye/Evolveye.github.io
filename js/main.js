/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( `.canvas-main` )
const ctx = canvas.getContext( `2d` )

let width = window.innerWidth
let height = window.innerHeight

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

canvas.width = width
canvas.height = height

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

document.querySelectorAll( `.subpage-close` ).forEach( closer => closer.addEventListener( `click`, () => closer.parentElement.classList.remove( `is-showed` ) ) )