function bresenham( { x:xA, y:yA }, { x:xB, y:yB } ) {
  let x1 = floorToDivisible( xA, rectSideLength )
  let y1 = floorToDivisible( yA, rectSideLength )
  const x2 = floorToDivisible( xB, rectSideLength )
  const y2 = floorToDivisible( yB, rectSideLength )

  const deltaX = Math.abs( x1 - x2 )
  const deltaY = Math.abs( y1 - y2 )

  const stepX = (x1 < x2 ? 1 : -1) * rectSideLength
  const stepY = (y1 < y2 ? 1 : -1) * rectSideLength

  let err = deltaX - deltaY

  ctx.fillRect( x1 + drawAreaX, y1 + drawAreaY, rectSideLength, rectSideLength )

  while (x1 != x2 || y1 != y2) {
    ctx.fillRect( x1 + drawAreaX, y1 + drawAreaY, rectSideLength, rectSideLength )

    const doubledErr = err * 2

    if (doubledErr > -deltaY) {
      err -= deltaY
      x1 += stepX
    }
    if (doubledErr < deltaX) {
      err += deltaX
      y1 += stepY
    }
  }
}
function draw() {
  for (const { pointA, pointB, color='#f00' } of lines) {
    ctx.fillStyle = color

    bresenham( pointA, pointB )
  }
}
function floorToDivisible( number, divider ) {
  return Math.floor( number / divider ) * divider
}

//
// Canvas general manipulations below
//

function clear() {
  ctx.fillStyle = '#eee'

  ctx.fillRect( drawAreaX, drawAreaY, width, height )
}
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  drawAreaX = (canvas.width  - width)  / 2
  drawAreaY = (canvas.height - height) / 2

  clear()
  draw()
}

window.addEventListener( 'resize', resize )
document.addEventListener( 'mouseup', () => {
  mouseDown = false

  // console.log( {
  lines.push( {
    pointA: new Point( pointMouseDown.x - drawAreaX, pointMouseDown.y - drawAreaY, true ),
    pointB: new Point( pointMouseMove.x - drawAreaX, pointMouseMove.y - drawAreaY, true )
  } )

  pointMouseDown.x = null
  pointMouseDown.y = null

  pointMouseMove.x = null
  pointMouseMove.y = null

  clear()
  draw()
} )
document.addEventListener( 'mousedown', ({ clientX, clientY }) => {
  mouseDown = true

  pointMouseDown.x = clientX
  pointMouseDown.y = clientY

  pointMouseMove.x = clientX
  pointMouseMove.y = clientY
} )
document.addEventListener( 'mousemove', ({ clientX, clientY }) => {
  if (!mouseDown) return

  const { x, y } = pointMouseDown

  pointMouseMove.x = clientX
  pointMouseMove.y = clientY

  clear()
  draw()

  ctx.strokeStyle = '#00f'
  ctx.beginPath()
  ctx.moveTo( x, y )
  ctx.lineTo( clientX, clientY )
  ctx.stroke()
} )