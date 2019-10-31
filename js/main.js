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

canvas.width = width
canvas.height = height

// for (let fails = 0; fails < 10;) {
for (let fails = 0; fails < 2; fails++ ) {
  const point = new Point( random( 0, width ), random( 0, height ) )
  let addIt = true

  for (const pointInArr of points) if (point.distanceTo( pointInArr ) < 100) {
    addIt = false
    break
  }

  if (addIt) points.push( point )
  else fails++
}

const circle = new MovingCircle( width / 2, height / 2 )
circle.pointToMove = points[ random( 0, points.length - 1 ) ]
circles.push( circle )

setInterval( () => {
  circles.forEach( circle => circle.tick() )

  requestAnimationFrame( () => draw() )
}, 1000 / 60 )
