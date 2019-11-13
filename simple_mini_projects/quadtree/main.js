const width = 300
const height = 300
const qtree = new Quadtree( new Rect( 0, 0, width, height ) )
const buttons = {
  clear: document.querySelector( '[data-action="clear"' ),
  generate: document.querySelector( '[data-action="generate"' )
}



function clear() {
  const drawAreaX = (canvas.width  - width)  / 2
  const drawAreaY = (canvas.height - height) / 2

  ctx.fillStyle = '#ccc'

  ctx.fillRect( drawAreaX, drawAreaY, width, height )
}
function onResize() {
  const drawAreaX = (canvas.width  - width)  / 2
  const drawAreaY = (canvas.height - height) / 2

  clear()

  qtree.show( ctx, drawAreaX, drawAreaY )
}
function generatePoints( count ) {
  for (let i = 0; i < count; i++) {
    const point = new Point( random( width ), random( height ) )

    qtree.insert( point )
  }
}



buttons.generate.addEventListener( 'click', () => {
  const drawAreaX = (canvas.width  - width)  / 2
  const drawAreaY = (canvas.height - height) / 2

  generatePoints( 100 )
  qtree.show( ctx, drawAreaX, drawAreaY )
} )
buttons.clear.addEventListener( 'click', () => {
  qtree.clear()
  clear()
} )

window.addEventListener( `click`, ({ clientX:x, clientY:y }) => {
  const drawAreaX = (canvas.width  - width)  / 2
  const drawAreaY = (canvas.height - height) / 2

  if (x - drawAreaX >= 0 && y - drawAreaY >= 0) {
    qtree.insert( new Point( x - drawAreaX, y - drawAreaY ) )
    qtree.show( ctx, drawAreaX, drawAreaY )
  }
} )