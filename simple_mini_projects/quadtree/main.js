/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const drawableAreaSize = 500
const qtree = new Quadtree( new Rect( 0, 0, drawableAreaSize, drawableAreaSize ) )
const buttons = {
  clear: document.querySelector( '[data-action="clear"' ),
  generate: document.querySelector( '[data-action="generate"' )
}

let drawAreaX
let drawAreaY

resize()

buttons.generate.addEventListener( 'click', () => {
  generatePoints( 100 )
  qtree.show( ctx, drawAreaX, drawAreaY )
} )
buttons.clear.addEventListener( 'click', () => {
  qtree.clear()
  clear()
} )