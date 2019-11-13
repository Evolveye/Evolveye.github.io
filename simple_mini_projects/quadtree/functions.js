function clear() {
  ctx.fillStyle = '#ccc'

  ctx.fillRect( drawAreaX, drawAreaY, width, height )
}
function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  drawAreaX = (canvas.width  - width)  / 2
  drawAreaY = (canvas.height - height) / 2

  clear()

  qtree.show( ctx, drawAreaX, drawAreaY )
}
function generatePoints( count ) {
  for (let i = 0; i < count; i++) {
    const point = new Point( random( width ), random( height ) )

    qtree.insert( point )
  }
}
function random( max, min=0 ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

window.addEventListener( `resize`, resize )
window.addEventListener( `load`, resize )
window.addEventListener( `click`, ({ clientX:x, clientY:y }) => {
  if (x - drawAreaX >= 0 && y - drawAreaY >= 0) {
    qtree.insert( new Point( x - drawAreaX, y - drawAreaY ) )
    qtree.show( ctx, drawAreaX, drawAreaY )
  }
} )