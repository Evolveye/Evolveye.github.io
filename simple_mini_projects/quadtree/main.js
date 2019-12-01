/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const drawableAreaSize = 500
const modeViewer = document.querySelector( '#mode' )
const buttons = {
  clear: document.querySelector( '[data-action="clear"' ),
  generate: document.querySelector( '[data-action="generate"' ),
  switchMode: document.querySelector( '[data-action="switch mode"' )
}

const queryRect = new Rect( 100, 100, 100, 75 )

/** @type {Quadtree} */
let qTree
let drawAreaX
let drawAreaY

createQTree()
resize()

modeViewer.textContent = qTree.pointsOnlyInLeaves

buttons.generate.addEventListener( 'click', () => {
  generatePoints( 100 )
  draw()
} )
buttons.clear.addEventListener( 'click', () => {
  qTree.clear()
  clear()
} )
buttons.switchMode.addEventListener( 'click', () => {
  createQTree( !qTree.pointsOnlyInLeaves )

  draw()

  modeViewer.textContent = qTree.pointsOnlyInLeaves
} )