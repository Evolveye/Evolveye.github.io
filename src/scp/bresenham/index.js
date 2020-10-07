import React from "react"

import { Point } from "../utils.js"

const floorToDivisible = (number, divider) => Math.floor( number / divider ) * divider
function bresenham( ctx, rectSideLength, { x:xA, y:yA }, { x:xB, y:yB } ) {
  let x1   = floorToDivisible( xA, rectSideLength )
  let y1   = floorToDivisible( yA, rectSideLength )
  const x2 = floorToDivisible( xB, rectSideLength )
  const y2 = floorToDivisible( yB, rectSideLength )

  if (!x1 || !x2 || !y1 || !y2) return false

  const deltaX = Math.abs( x1 - x2 )
  const deltaY = Math.abs( y1 - y2 )

  const stepX = (x1 < x2 ? 1 : -1) * rectSideLength
  const stepY = (y1 < y2 ? 1 : -1) * rectSideLength

  let err = deltaX - deltaY

  do {
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
  } while (x1 !== x2 || y1 !== y2)

  ctx.fillRect( x1, y1, rectSideLength, rectSideLength )
}
export const title = {
  pl: `Algorytm Bresenhama`,
  en: `Bresenham algorithm`,
}

export const description = {
  pl: `Algorytm z którego pomocą w prosty sposób można przeprowadzić proces rasteryzacji`,
  en: `The algorithm with which you can easily perform the rasterization process`,
}

export class Component extends React.Component {
  mouse = { x:null, y:null, downX:null, downY:null, pressed:false }
  canvas = null
  rectSideLength = 2
  lines = [
    { pointA:new Point( 150, 100 ), pointB:new Point( 400, 200 ) },
  ]

  /** @param {HTMLCanvasElement} canvas */
  handleRef = canvas => {
    if (!canvas) return

    canvas.width = canvas.parentElement.clientWidth - 42
    canvas.height = canvas.parentElement.clientHeight - 42

    this.ctx = canvas.getContext( `2d` )
    this.draw()
  }
  /** @param {React.PointerEvent} e */
  handlePointerMove = e => {
    const { layerX, layerY } = e.nativeEvent

    this.mouse.x = layerX
    this.mouse.y = layerY

    const { ctx } = this
    const { downX, downY, x, y, pressed } = this.mouse

    this.draw()

    if (!pressed) return

    ctx.lineWidth = 5
    ctx.strokeStyle = '#b00'
    ctx.beginPath()
    ctx.moveTo( downX, downY )
    ctx.lineTo( x, y )
    ctx.stroke()
  }
  /** @param {React.PointerEvent} e */
  handlePointerDown = e => {
    const { layerX, layerY } = e.nativeEvent

    this.mouse.pressed = true
    this.mouse.downX = layerX
    this.mouse.downY = layerY
    this.mouse.x = layerX
    this.mouse.y = layerY
  }
  /** @param {React.PointerEvent} e */
  handlePointerUp = e => {
    const { layerX, layerY } = e.nativeEvent

    this.mouse.x = layerX
    this.mouse.y = layerY

    const { downX, downY, x, y } = this.mouse

    this.lines.push( {
      pointA: new Point( downX, downY, true ),
      pointB: new Point( x, y, true )
    } )

    this.draw()

    this.mouse.pressed = false
  }
  /** @param {React.ChangeEvent} e */
  handleChangeWidth = ({ target }) => {
    this.rectSideLength = target.value
    this.draw()
  }

  clear = () => {
    this.lines.splice( 0 )
    this.draw()
  }
  draw() {
    const { ctx, rectSideLength, lines } = this

    if (!ctx) return

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )

    for (const { pointA, pointB, color='#0b0' } of lines) {
      ctx.fillStyle = color

      bresenham( ctx, rectSideLength, pointA, pointB )
    }
  }

  render = () =>
    <>
      <article className={this.props.uiClass}>
        <button className="neumorphizm-white" onClick={this.clear}>Clear</button>
        <label>
          Resolution {` `}
          <input type="number" defaultValue={this.rectSideLength} onChange={this.handleChangeWidth} min={1} max={30} />
        </label>
      </article>
      <canvas
        ref={this.handleRef}
        className={this.props.canvasClass}
        onPointerMove={this.handlePointerMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      />
    </>
}