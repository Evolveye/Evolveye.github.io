/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

let width
let height

resizeCanvas()

function random( max, min=0 ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  width = canvas.width
  height = canvas.height
}

window.addEventListener( `resize`, () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
} )