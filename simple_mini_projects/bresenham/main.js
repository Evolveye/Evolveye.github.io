/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( '.canvas-main' )
const ctx = canvas.getContext( '2d' )

const width = 300
const height = 300

let rectSideLength = 5
let drawAreaX
let drawAreaY

resize()