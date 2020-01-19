import { Point } from "../../js/classes.js";
import {
  setOnResize,
  setOnMouseMove,
  setOnMouseUp,
  addDescription,
  addInput,
} from "../../js/importer.js";
import {
  clearSubcanvas as clear,
  subCtx as ctx,
} from "../../js/functions.js";

let rectSideLength = 3
const lines = [ { pointA:new Point( 150, 100 ), pointB:new Point( 400, 200 ) } ]

function bresenham( { x:xA, y:yA }, { x:xB, y:yB } ) {
  let x1 = floorToDivisible( xA, rectSideLength )
  let y1 = floorToDivisible( yA, rectSideLength )
  const x2 = floorToDivisible( xB, rectSideLength )
  const y2 = floorToDivisible( yB, rectSideLength )

  const deltaX = Math.abs( x1 - x2 )
  const deltaY = Math.abs( y1 - y2 )

  const stepX = (x1 < x2 ? 1 : -1) * rectSideLength
  const stepY = (y1 < y2 ? 1 : -1) * rectSideLength

  let err = deltaX - deltaY

  do  {
    ctx.fillRect( x1, y1, rectSideLength, rectSideLength )

    const doubledErr = err * 2

    if (doubledErr > -deltaY) {
      err -= deltaY
      x1 += stepX
    }
    if (doubledErr < deltaX) {
      err += deltaX
      y1 += stepY
    }
  } while (x1 != x2 || y1 != y2)

  ctx.fillRect( x1, y1, rectSideLength, rectSideLength )
}
function draw() {
  for (const { pointA, pointB, color='#0b0' } of lines) {
    ctx.fillStyle = color

    bresenham( pointA, pointB )
  }
}
function floorToDivisible( number, divider ) {
  return Math.floor( number / divider ) * divider
}
function redraw() {
  clear()
  draw()
}

setOnMouseMove( ( pressed, clientX, clientY, down ) => {
  redraw()

  if (!pressed) return

  ctx.lineWidth = 5
  ctx.strokeStyle = '#b00'
  ctx.beginPath()
  ctx.moveTo( down.x, down.y )
  ctx.lineTo( clientX, clientY )
  ctx.stroke()
} )
setOnMouseUp( ( up, down ) => {
  lines.push( {
    pointA: new Point( down.x, down.y, true ),
    pointB: new Point( up.x, up.y, true )
  } )

  redraw()
} )
setOnResize( draw )

addInput( `button`, `Clear`, { onclick() { lines.splice( 0 ); redraw() } } )
addInput( `number`, `Resolution`, { min:1, max:20, value:rectSideLength, onchange() { rectSideLength = this.value; redraw() } } )
addDescription( `Just draw a line on canvas` )
draw()