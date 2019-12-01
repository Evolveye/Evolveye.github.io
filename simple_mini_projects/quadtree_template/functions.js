function createQTree( resolution=5 ) {
  qTree = new Quadtree( new Rect( 0, 0, drawableAreaSize, drawableAreaSize ), resolution )
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
function drawAt( x, y ) {
  ctx.fillStyle = '#00f'
  ctx.beginPath()
  ctx.arc( x + drawAreaX, y + drawAreaY, 2, 0, Math.PI * 2 )
  ctx.fill()
}

//
// Canvas general manipulations below
//

function clear() {
  ctx.fillStyle = '#eee'

  ctx.fillRect( drawAreaX, drawAreaY, drawableAreaSize, drawableAreaSize )
}
function clickOnDrawableArea( clientX, clientY ) {
  return clientX > drawAreaX && clientX < drawAreaX + drawableAreaSize
    && clientY > drawAreaY && clientY < drawAreaY + drawableAreaSize
}
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  drawAreaX = (canvas.width  - drawableAreaSize) / 2
  drawAreaY = (canvas.height - drawableAreaSize) / 2

  clear()
}

window.addEventListener( `resize`, resize )
document.addEventListener( 'mouseup', ({ clientX, clientY }) => {
  if (!mouseDown || !clickOnDrawableArea( clientX, clientY )) return

  mouseDown = false

  if (pointMouseDown.equal( pointMouseMove )) qTree.insert( pointMouseDown )
  else qTree.insertPointSequence( pointMouseDown, pointMouseMove )

  pointMouseDown.newX = null
  pointMouseDown.newY = null

  pointMouseMove.newX = null
  pointMouseMove.newY = null

  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
} )
document.addEventListener( 'mousedown', ({ clientX, clientY }) => {
  if (!clickOnDrawableArea( clientX, clientY )) return

  mouseDown = true

  pointMouseDown.newX = clientX - drawAreaX
  pointMouseDown.newY = clientY - drawAreaY

  pointMouseMove.newX = clientX - drawAreaX
  pointMouseMove.newY = clientY - drawAreaY
} )
document.addEventListener( 'mousemove', ({ clientX, clientY }) => {
  if (!mouseDown || !clickOnDrawableArea( clientX, clientY )) return

  const { x, y } = pointMouseDown

  pointMouseMove.newX = clientX - drawAreaX
  pointMouseMove.newY = clientY - drawAreaY

  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )

  ctx.strokeStyle = '#00f'
  ctx.beginPath()
  ctx.moveTo( x + drawAreaX, y + drawAreaY )
  ctx.lineTo( clientX, clientY )
  ctx.stroke()
} )