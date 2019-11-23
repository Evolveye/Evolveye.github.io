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

  drawAreaX = (canvas.width  - drawableAreaSize)  / 2
  drawAreaY = (canvas.height - drawableAreaSize) / 2

  clear()

  qtree.show( ctx, drawAreaX, drawAreaY )
}
function generatePoints( count ) {
  for (let i = 0; i < count; i++) {
    const point = new Point( random( drawableAreaSize ), random( drawableAreaSize ) )

    qtree.insert( point )
  }
}
function random( max, min=0 ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

window.addEventListener( `resize`, resize )
window.addEventListener( `load`, resize )
window.addEventListener( `click`, ({ clientX:x, clientY:y }) => {
  if (!clickOnDrawableArea( x, y )) return

  clear()

  if (x - drawAreaX >= 0 && y - drawAreaY >= 0) {
    qtree.insert( new Point( x - drawAreaX, y - drawAreaY ) )
    qtree.show( ctx, drawAreaX, drawAreaY )
  }
} )