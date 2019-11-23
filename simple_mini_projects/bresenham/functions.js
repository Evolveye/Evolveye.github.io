function bresenham( { x:x1, y:y1 }, { x:x2, y:y2 } ) {
  const deltaX = Math.abs( x1 - x2 )
  const deltaY = Math.abs( y1 - y2 )

  const stepX = (x1 < x2 ? 1 : -1) * rectSideLength
  const stepY = (y1 < y2 ? 1 : -1) * rectSideLength

  let err = deltaX - deltaY

  drawRect( x1, y1 )

  while (x1 != x2 || y1 != y2) {
    drawRect( x1, y1 )

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
function drawRect( x, y ) {
  ctx.fillStyle = '#f00'

  ctx.fillRect( x + drawAreaX, y + drawAreaY, rectSideLength, rectSideLength )
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
  bresenham( { x:20, y:70 }, { x:250, y:170 } )
}

window.addEventListener( `resize`, resize )