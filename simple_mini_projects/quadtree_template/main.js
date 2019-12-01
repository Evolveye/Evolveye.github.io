/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const drawableAreaSize = 500
const ui = {
  clear: document.querySelector( '#clear' ),
  resolution: document.querySelector( '#resolution' )
}

const pointMouseDown = { x:null, y:null }
const pointMouseMove = { x:null, y:null }

/** @type {Quadtree} */
let qTree
let mouseDown = false
let rectSideLength = resolution.value
let drawAreaX
let drawAreaY

createQTree( ui.resolution.value )
resize()

ui.clear.addEventListener( 'click', () => {
  qTree.clear()
  clear()
} )