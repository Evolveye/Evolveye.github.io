const width = 300
const height = 300
const points = 1000
const qtree = new Quadtree( new Rect( 0, 0, width, height ) )

for (let i = 0; i < points; i++) {
  const point = new Point( random( width ), random( height ) )

  qtree.insert( point )
}

function onResize() {
  const x = (canvas.width  - width)  / 2
  const y = (canvas.height - height) / 2

  ctx.fillStyle = '#ccc'

  ctx.fillRect( x, y, width, height )
  qtree.show( ctx, x, y )
}