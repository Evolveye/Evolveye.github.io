/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const drawableAreaSize = 500
const width = drawableAreaSize - drawableAreaSize % resolution.max
const height = drawableAreaSize - drawableAreaSize % resolution.max
const pointMouseDown = { x:null, y:null }
const pointMouseMove = { x:null, y:null }
const lines = [ { pointA:new Point( 50, 70 ), pointB:new Point( 150, 120 ), color:'#0f0' } ]

let mouseDown = false
let rectSideLength = resolution.value
let drawAreaX
let drawAreaY

resize()