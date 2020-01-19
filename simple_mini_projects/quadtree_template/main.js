import { Point, Rect } from "../../js/classes.js";
import { clearSubcanvas, subCtx as ctx, } from "../../js/functions.js";
import Quadtree from "./classes.js";
import {
  setOnMouseUp,
  setOnMouseMove,
  addDescription,
  addInput,
} from "../../js/importer.js";

const qTreeSize = 500
const objects = []

/** @type {Quadtree} */
let qTree
let resolution = 4
let mouseDown = false
let meshShowing = true
let rectSideLength = resolution
let drawAreaX = (ctx.canvas.width - qTreeSize) / 2
let drawAreaY = (ctx.canvas.height - qTreeSize) / 2

createQTree( resolution )
clear()
qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )

addInput( `button`, `Clear`, { onclick() {
  qTree.clear()
  clear()
} } )
addInput( `number`, `Resolution`, { value:resolution, min:1, max:20, onchange() {
  createQTree( this.value )
  clear()
} } )
addInput( `checkbox`, `Show mesh`, { checked:meshShowing, onchange() {
  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2

  meshShowing = this.checked
  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
} } )
addDescription( `Quadtree for figures/objects. Draw line on canvas` )

setOnMouseUp( (up, down) => {
  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2
  const pointUp = new Point( up.x - drawAreaX, up.y - drawAreaY )
  const pointDown = new Point( down.x - drawAreaX, down.y - drawAreaY )

  if (!qTree.boundary.contains( pointUp )) return

  if (pointUp.equal( pointDown )) {
    const obj = { type:'point', ...pointUp }
    objects.push( obj )
    qTree.insert( obj, pointUp )
  }
  else {
    const obj = {
      type: 'line',
      startPoint: new Point( pointDown.x, pointDown.y ),
      endPoint: new Point( pointUp.x, pointUp.y )
    }

    objects.push( obj )
    qTree.insertPointSequence( obj, pointDown, pointUp )
  }

  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
} )
setOnMouseMove( (pressed, x, y, down) => {
  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2
  const pointDown = new Point( down.x - drawAreaX, down.y - drawAreaY )
  const pointCurrent = new Point( x - drawAreaX, y - drawAreaY )

  clear()
  qTree.show( ctx, { meshShowing, drawAreaX, drawAreaY } )

  if (!pressed || !qTree.boundary.contains( pointCurrent )) return

  ctx.strokeStyle = '#b00'
  ctx.beginPath()
  ctx.moveTo( pointDown.x + drawAreaX, pointDown.y + drawAreaY )
  ctx.lineTo( x, y )
  ctx.stroke()
} )

function createQTree( resolution=5 ) {
  qTree = new Quadtree( new Rect( 0, 0, qTreeSize, qTreeSize ), resolution )
}
function clear() {
  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2

  clearSubcanvas()

  ctx.fillStyle = '#222'
  ctx.fillRect( drawAreaX, drawAreaY, qTreeSize, qTreeSize )
}