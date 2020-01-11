import { Point, Rect } from "../../js/classes.js";
import { clearSubcanvas, subCtx as ctx, } from "../../js/functions.js";
import {
  setOnMouseUp,
  setOnMouseMove,
  addDescription,
  addInput,
} from "../../js/importer.js";
import Quadtree from "./classes.js";

const qTreeSize = 500
const queryRect = new Rect( 100, 100, 100, 75 )

/** @type {Quadtree} */
let qTree
let pointsOnlyInLeaves = false

createQTree()
draw()

addInput( `button`, `Clear`, { onclick() {
  qTree.clear()
  clear()
} } )
addInput( `button`, `Generate 100`, { onclick() {
  generatePoints( 100 )
  draw()
} } )
addInput( `button`, `Switch "only leaves" mode: ${pointsOnlyInLeaves}`, { onclick() {
  pointsOnlyInLeaves = !qTree.pointsOnlyInLeaves

  this.value = `Switch "only leaves" mode: ${pointsOnlyInLeaves}`

  createQTree( )
  draw()
} } )
addDescription( `Quadtree for points. Click on canvas to add point` )

setOnMouseUp( ({ x, y }) => {
  const testingPoint = new Point(
    x - (ctx.canvas.width - qTreeSize) / 2,
    y - (ctx.canvas.height - qTreeSize) / 2
  )

  if (!qTree.boundary.contains( testingPoint )) return

  qTree.insert( testingPoint )

  draw()
} )
setOnMouseMove( (pressed, x, y) => {
  const testingRect = new Rect(
    x - (ctx.canvas.width - qTreeSize) / 2 - queryRect.width / 2,
    y - (ctx.canvas.height - qTreeSize) / 2 - queryRect.height / 2,
    queryRect.width,
    queryRect.height
  )

  if (!qTree.boundary.contains( testingRect )) return

  queryRect.x = testingRect.x
  queryRect.y = testingRect.y

  draw()
} )

function createQTree() {
  qTree = new Quadtree( new Rect( 0, 0, qTreeSize, qTreeSize ), pointsOnlyInLeaves )
}
function clear() {
  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2
    
  clearSubcanvas()
  
  ctx.fillStyle = '#222'
  ctx.fillRect( drawAreaX, drawAreaY, qTreeSize, qTreeSize )
}
function draw() {
  clear()

  const drawAreaX = (ctx.canvas.width - qTreeSize) / 2
  const drawAreaY = (ctx.canvas.height - qTreeSize) / 2
  const { x, y, width, height } = queryRect

  qTree.show( ctx, drawAreaX, drawAreaY )
  

  ctx.strokeStyle = '#0f0'
  ctx.strokeRect( x + drawAreaX, y + drawAreaY, width, height )

  ctx.fillStyle = '#0f0'
  qTree.query( queryRect ).forEach( ({ x, y }) => {
    ctx.beginPath()
    ctx.arc( x + drawAreaX, y + drawAreaY, 2, 0, Math.PI * 2 )
    ctx.fill()
  } )
}
function generatePoints( count ) {
  for (let i = 0; i < count; i++) {
    const point = new Point( random( qTreeSize ), random( qTreeSize ) )

    qTree.insert( point )
  }
}
function random( max, min=0 ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}