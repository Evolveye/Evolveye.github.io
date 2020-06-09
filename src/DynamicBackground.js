import React from "react"

import { Point, MovingCircle, random } from "./utils.js"

export default class DynamicBackground extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      points: [],
      circles: [],
      padding: 10,
      colors: [
        `#1125`
        // `#f33`,
        // `#5a5`,
        // `#55f`,
        // `#dd5`,
        // `#f0f`,
      ],
      dotColor: `#fff2`
    }

    this.ref = React.createRef()

    /** @type {CanvasRenderingContext2D} */
    this.ctx = null
  }

  componentDidMount() {
    /** @type {HTMLCanvasElement} */
    const canvas = this.ref.current
    const ctx = canvas.getContext( `2d` )

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.ctx = ctx
    this.generatePoints()
    requestAnimationFrame( this.draw )
  }

  generatePoints() {
    const { points, circles, padding, colors } = this.state
    const width = window.innerWidth
    const height = window.innerHeight

    circles.splice( 0 )
    points.splice( 0 )

    for (let fails = 0; fails < 100;) {
    // for (let fails = 0; fails < 2; fails++ ) {
      const point = new Point( random( 0, width ), random( 0, height ) )
      let addIt = true

      for (const pointInArr of points) if (point.distanceTo( pointInArr ) < 100) {
        addIt = false
        break
      }

      if (addIt) points.push( point )
      else fails++
    }

    for (let circlesCount = 20; circlesCount; --circlesCount )
      circles.push( new MovingCircle( random( padding, width - padding ), random( padding, height - padding ), {
        color: colors[ random( 0, colors.length - 1 ) ],
        speed: random( 20, 50 ),
        size: 5
      } ) )
  }

  draw = () => {
    if (!this.ref) return

    const { ctx } = this
    const { dotColor, points, circles } = this.state

    circles.forEach( circle => circle.tick() )

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )
    ctx.fillStyle = dotColor

    for (const { x, y } of points) {
      ctx.beginPath()
      ctx.arc( x, y, 2, 0, Math.PI * 2 )
      ctx.fill()
    }

    ctx.lineWidth = 7

    for (const circle of circles) {
      const { x, y, color, size } = circle

      if (!circle.pointToMove) circle.pointToMove = points[ random( 0, points.length - 1 ) ]

      ctx.strokeStyle = color

      ctx.beginPath()
      ctx.arc( x, y, size, 0, Math.PI * 2 )
      ctx.stroke()
    }

    requestAnimationFrame( this.draw )
  }

  render = () => <canvas style={{ zIndex:-1 }} ref={this.ref}/>
}