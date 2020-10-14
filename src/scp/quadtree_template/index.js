import React from "react"
import { Point, Rect } from "../utils.js"

import Quadtree from "./class.js"

export const title = {
  en: `Quadtree template`,
  pl: `Drzewo czwórkowe dla płaszczyzn`,
}

export const description = {
  pl: `Struktura przechowujaca referencje do figur geometrycznych (w obecnej implementacji jedynie linii)`,
  en: `The structure that stores references to geometric figures (in current implementation only points)`,
}

export class Component extends React.Component {
  mouse = { downX:0, downY:0, x:0, y:0, pressed:false }
  /** @type {Quadtree} */
  qTree = null
  rectSideLength = 5
  isMeshShowed = true
  objects = []

  langKey = this.props.langKey

  /** @param {HTMLCanvasElement} canvas */
  handleRef = canvas => {
    if (!canvas) return

    canvas.width = canvas.parentElement.clientWidth - 42
    canvas.height = canvas.parentElement.clientHeight - 42

    this.ctx = canvas.getContext( `2d` )
    this.createQTree()
  }
  /** @param {React.PointerEvent} e */
  handlePointerMove = e => {
    const { layerX, layerY } = e.nativeEvent
    this.mouse.x = layerX
    this.mouse.y = layerY

    const { ctx, qTree } = this
    const { downX, downY, x, y, pressed } = this.mouse

    if (pressed) {
      // console.log( this.mouse )
      this.clear()

      ctx.strokeStyle = `red`

      ctx.beginPath()
      ctx.moveTo( downX, downY )
      ctx.lineTo( x, y )
      ctx.stroke()

      qTree.show( ctx, { isMeshShowed:this.isMeshShowed } )
    }
  }
  /** @param {React.PointerEvent} e */
  handlePointerDown = e => {
    const { layerX, layerY } = e.nativeEvent
    const { ctx } = this
    this.mouse.pressed = true
    this.mouse.downX = layerX
    this.mouse.downY = layerY
    this.mouse.x = layerX
    this.mouse.y = layerY

    const { downX:x, downY:y } = this.mouse

    this.clear()
    this.qTree.show( ctx, { isMeshShowed:this.isMeshShowed } )

    ctx.strokeStyle = '#b00'
    ctx.beginPath()
    ctx.arc( x, y, 3, 0, 2 * Math.PI )
    ctx.stroke()
  }
  /** @param {React.PointerEvent} e */
  handlePointerUp = e => {
    const { layerX, layerY } = e.nativeEvent
    const { ctx } = this
    this.mouse.x = layerX
    this.mouse.y = layerY

    const { downX, downY, x, y, pressed } = this.mouse

    const pointUp = new Point( x, y )
    const pointDown = new Point( downX, downY )

    if (!pressed || !this.qTree.boundary.contains( pointUp )) return

    if (pointUp.equal( pointDown )) {
      const obj = { type:'point', ...pointUp }

      this.objects.push( obj )
      this.qTree.insert( obj, pointUp )
    } else {
      const obj = {
        type: 'line',
        startPoint: new Point( pointDown.x, pointDown.y ),
        endPoint: new Point( pointUp.x, pointUp.y )
      }

      this.objects.push( obj )
      this.qTree.insertPointSequence( obj, pointDown, pointUp )
    }

    this.clear()
    this.qTree.show( ctx, { isMeshShowed:this.isMeshShowed } )

    this.mouse.pressed = false
  }
  /** @param {React.ChangeEvent} param0 */
  handleChangeWidth = ({ target }) => {
    this.rectSideLength = target.value
    this.clear()
    this.createQTree()
  }
  /** @param {React.ChangeEvent} param0 */
  handleToggleMesh = ({ target }) => {
    this.isMeshShowed = target.checked
    this.clear()
    this.qTree.show( this.ctx, { isMeshShowed:this.isMeshShowed } )
  }

  createQTree() {
    this.qTree = new Quadtree( new Rect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height ), this.rectSideLength )

    return this.qTree
  }
  clear = () => {
    const { ctx } = this

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )
  }

  render = () =>
    <>
      <article className={this.props.uiClass}>
        <button className="neumorphizm-white" onClick={this.clear}>
          {this.langKey === `pl` ? `Wyczyść` : `Clear`}
        </button>
        <label>
          Resolution {` `}
          <input type="number" defaultValue={this.rectSideLength} onChange={this.handleChangeWidth} min={1} max={30} />
        </label>
        <label>
          Mesh {` `}
          <input type="checkbox" defaultChecked={true} onChange={this.handleToggleMesh} />
        </label>
        <p>
          {
            this.langKey === `pl` ?
              `Narysuj linię na poniższej wyznaczonej przestrzni.`
            :
              `Draw a line on highlighted area below.`
            }
        </p>
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