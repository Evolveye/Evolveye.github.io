const lines = [ { pointA:new Point( 50, 70 ), pointB:new Point( 150, 120 ), color:'#f00' } ]
let rectSideLength = 5
/** @type {Function} */
let clear = null
/** @type {CanvasRenderingContext2D} */
let ctx = null

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
  for (const { pointA, pointB, color='#f00' } of lines) {
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

export default {
  onResize() {
    draw()
  },

  /**
   * @param {boolean} pressed
   * @param {number} clientX
   * @param {number} clientY
   * @param {object} down
   * @param {number} down.x
   * @param {number} down.y
   */
  onMouseMove( pressed, clientX, clientY, down ) {
    if (!pressed) return

    redraw()

    ctx.lineWidth = 5
    ctx.strokeStyle = '#f00'
    ctx.beginPath()
    ctx.moveTo( down.x, down.y )
    ctx.lineTo( clientX, clientY )
    ctx.stroke()
  },

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onMouseDown( { x, y } ) {},

  /**
   * @param {object} up
   * @param {number} up.x
   * @param {number} up.y
   * @param {object} down
   * @param {number} down.x
   * @param {number} down.y
   */
  onMouseUp( up, down ) {
    lines.push( {
      pointA: new Point( down.x, down.y, true ),
      pointB: new Point( up.x, up.y, true )
    } )

    redraw()
  },

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onClick( { x, y } ) {},

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Function} clear
   */
  run( context, clearCanvas ) {
    clear = clearCanvas
    ctx = context
  }
}