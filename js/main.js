/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( `.body-background` )
const ctx = canvas.getContext( `2d` )

const width = window.innerWidth
const height = window.innerHeight

const points = []

canvas.width = width
canvas.height = height

for (let fails = 0; fails < 10;) {
  const point = new MovingCircle( random( 0, width ), random( 0, height ) )
  let addIt = true

  for (const p of points) if (point.distanceTo( p ) < 100) {
    addIt = false
    break
  }

  if (addIt) points.push( point )
  else fails++
}

ctx.fillStyle = `#fff`

for (const { x, y } of points) {
  ctx.beginPath()
  ctx.arc( x, y, 5, 0, Math.PI * 2 )
  ctx.fill()
}