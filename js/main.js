/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( `.body-background` )
const ctx = canvas.getContext( `2d` )

const width = window.innerWidth
const height = window.innerHeight

let temp = 0

/** @type {MovingCircle[]} */
const circles = []
/** @type {Point[]} */
const points = []
/** @type {string[]} */
const colors = [
  `#5123ad`,
  `#f00`
]

canvas.width = width
canvas.height = height

for (let fails = 0; fails < 10;) {
// for (let fails = 0; fails < 2; fails++ ) {
  const point = new Point( random( -100, width + 100 ), random( -100, height + 100 ) )
  let addIt = true

  for (const pointInArr of points) if (point.distanceTo( pointInArr ) < 100) {
    addIt = false
    break
  }

  if (addIt) points.push( point )
  else fails++
}

for (let circlesCount = 5; circlesCount; --circlesCount )
  circles.push( new MovingCircle( width / 2, height / 2 ) )

setInterval( () => {
  circles.forEach( circle => circle.tick() )

  requestAnimationFrame( () => draw() )
}, 1000 / 60 )
