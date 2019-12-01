function createQTree( pointsOnlyInLeaves=true ) {
  qTree = new Quadtree( new Rect( 0, 0, drawableAreaSize, drawableAreaSize ), pointsOnlyInLeaves )
}
function draw() {
  clear()

  qTree.show( ctx, drawAreaX, drawAreaY )

  const { x, y, width, height } = queryRect

  ctx.fillStyle = '#0f0'
  ctx.strokeStyle = '#0f0'
  ctx.strokeRect( x + drawAreaX, y + drawAreaY, width, height )

  qTree.query( queryRect ).forEach( ({ x, y }) => {
    ctx.beginPath()
    ctx.arc( x + drawAreaX, y + drawAreaY, 2, 0, Math.PI * 2 )
    ctx.fill()
  } )
}
function generatePoints( count ) {
  for (let i = 0; i < count; i++) {
    const point = new Point( random( drawableAreaSize ), random( drawableAreaSize ) )

    qTree.insert( point )
  }
}
function random( max, min=0 ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

//
// Canvas general manipulations below
//

function clear() {
  ctx.fillStyle = '#eee'

  ctx.fillRect( drawAreaX, drawAreaY, drawableAreaSize, drawableAreaSize )
}
function clickOnDrawableArea( clientX, clientY, borderLeft=0, borderTop=borderLeft ) {
  return clientX > drawAreaX + borderLeft && clientX < drawAreaX + drawableAreaSize - borderLeft
    && clientY > drawAreaY + borderTop && clientY < drawAreaY + drawableAreaSize - borderTop
}
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  drawAreaX = (canvas.width  - drawableAreaSize)  / 2
  drawAreaY = (canvas.height - drawableAreaSize) / 2

  draw()
}

window.addEventListener( 'resize', resize )
window.addEventListener( 'load', resize )
window.addEventListener( 'click', ({ clientX:x, clientY:y }) => {
  if (!clickOnDrawableArea( x, y )) return

  if (x - drawAreaX >= 0 && y - drawAreaY >= 0) {
    qTree.insert( new Point( x - drawAreaX, y - drawAreaY ) )
  }

  draw()
} )
document.addEventListener( 'mousemove', ({ clientX, clientY }) => {
  if (!clickOnDrawableArea( clientX, clientY, queryRect.width / 2, queryRect.height / 2 )) return

  queryRect.x = clientX - queryRect.width / 2 - drawAreaX
  queryRect.y = clientY - queryRect.height / 2 - drawAreaY

  draw()
} )
