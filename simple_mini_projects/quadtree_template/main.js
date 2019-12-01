/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const drawableAreaSize = 500
const ui = {
  clear: document.querySelector( '#clear' ),
  resolution: document.querySelector( '#resolution' ),
  meshShower: document.querySelector( '#show-mesh' )
}

const pointMouseDown = new Point( null, null, true )
const pointMouseMove = new Point( null, null, true )

const objects = []

/** @type {Quadtree} */
let qTree
let mouseDown = false
let meshShowing = true
let rectSideLength = resolution.value
let drawAreaX
let drawAreaY

createQTree( ui.resolution.value )
resize()

ui.clear.addEventListener( 'click', () => {
  qTree.clear()
  clear()
} )
ui.resolution.addEventListener( 'click', () => {
  createQTree( ui.resolution.value )
  clear()
} )
ui.meshShower.addEventListener( 'click', () => {
  meshShowing = ui.meshShower.checked
  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
} )