import React from "react"

import Quadtree from "./class.js"
import { Point, Rect, random } from "../utils.js"

export const title = {
  en: `Quadtree`,
  pl: `Drzewo czwórkowe`,
}

export const description = {
  pl: `Struktura potrafiąca przechowywać ogrom punktów i potrafiaca je zwórcić z wielkiej przestrzeni z wydajnością O(log(n))`,
  en: `The structure able to store huge amount of points and able to return them from big area with an eficiency of O(log(n))`,
}

export class Component extends React.Component {
  /** @type {Quadtree} */
  qTree = null
  /** @type {CanvasRenderingContext2D} */
  ctx = null
  queryRect = new Rect( 100, 100, 100, 75 )
  langKey = this.props.langKey

  state = {
    canLeavesStorePoints: true
  }

  /** @param {HTMLCanvasElement} canvas */
  handleRef = canvas => {
    if (!canvas) return

    canvas.width = canvas.parentElement.clientWidth - 42
    canvas.height = canvas.parentElement.clientHeight - 42

    this.ctx = canvas.getContext( `2d` )
    this.createQTree()
    this.draw()
  }
  /** @param {React.PointerEvent} e */
  handlePointerUp = e => {
    const { layerX:x, layerY:y } = e.nativeEvent
    const { qTree } = this

    const newPoint = new Point( x, y )

    if (!qTree.boundary.contains( newPoint )) return

    qTree.insert( newPoint )

    this.draw()
  }
  /** @param {PointerEvent} e */
  handlePointerMove = e => {
    const { layerX:x, layerY:y } = e.nativeEvent
    const { queryRect } = this
    const testingRect = new Rect(
      x - queryRect.width / 2,
      y - queryRect.height / 2,
      queryRect.width,
      queryRect.height
    )

    if (!this.qTree.boundary.contains( testingRect )) return

    queryRect.x = testingRect.x
    queryRect.y = testingRect.y

    this.draw()
  }
  handleLeavesModeChange = () => {
    this.setState( old => ({ canLeavesStorePoints:!old.canLeavesStorePoints }) )
    this.createQTree()
    this.draw()
  }

  createQTree() {
    this.qTree = new Quadtree( new Rect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height ), this.state.canLeavesStorePoints )

    return this.qTree
  }
  /** @param {number} amount */
  generate = amount => {
    const { width, height } = this.ctx.canvas

    for (let i = 0; i < amount; i++) {
      this.qTree.insert( new Point( random( width ), random( height ) ) )
    }

    this.draw()
  }
  clear = () => {
    const { qTree, ctx } = this

    if (!qTree || !ctx) return

    qTree.clear()

    this.draw()
  }
  draw() {
    const { qTree, ctx, queryRect } = this
    const { x, y, width, height } = queryRect

    if (!qTree || !ctx) return

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )

    qTree.show( ctx )

    ctx.strokeStyle = '#0f0'
    ctx.strokeRect( x, y, width, height )

    ctx.fillStyle = '#0f0'
    qTree.query( queryRect ).forEach( ({ x, y }) => {
      ctx.beginPath()
      ctx.arc( x, y, 2, 0, Math.PI * 2 )
      ctx.fill()
    } )
  }

  render = () =>
    <>
      <article className={this.props.uiClass}>
        <button className="neumorphizm-white" onClick={this.clear}>
          {this.langKey === `pl` ? `Wyczyść` : `Clear`}
        </button>
        <button className="neumorphizm-white" onClick={() => this.generate( 100 )}>
          {this.langKey === `pl` ? `Dogeneruj 100 punktów` : `Generate 100 points`}
        </button>
        <button className="neumorphizm-white" onClick={() => this.generate( 1000 )}>
          {this.langKey === `pl` ? `Dogeneruj 1000 punktów` : `Generate 1000 points`}
        </button>
        <button className="neumorphizm-white" onClick={this.handleLeavesModeChange}>
          {this.langKey === `pl` ? `Zmień tryb przechowywania liści` : `Switch leaves store mode`}
        </button>
        <p>
          {
            this.langKey === `pl` ? <>
              Tryb przechowywania liści (obecnie <b>{this.state.canLeavesStorePoints ? `włączony` : `wyłączony`}</b>)
              mówi o zdolności do przechocywania do 4 punktów każdego z prostokatów (nie tylko najgłębszych).
            </> : <>
              Leaves mode (currently <b>{this.state.canLeavesStorePoints ? `on` : `off`}</b>)
              says about posibility to store 4 points inside each rectangle (not only the deepest).
            </>
          }
        </p>
        <p>
          {
            this.langKey === `pl` ?
              `Ustaw punkt na poniższej wyznaczonej przestrzni.`
            :
              `Set a point on highlighted area below.`
            }
        </p>
      </article>
      <canvas
        ref={this.handleRef}
        className={this.props.canvasClass}
        onPointerUp={this.handlePointerUp}
        onPointerMove={this.handlePointerMove}
      />
    </>
}