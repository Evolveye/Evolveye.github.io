import React from "react"

import "./LoadingBox.css"

export default class LoadingBox extends React.Component {
  static colors = [ `#f8cf07`, `#43c243`, `#be3922` ]

  constructor( props ) {
    super( props )

    this.state = {
      objects: [],
    }

    this.contentHeight = 0

    /** @type {HTMLCanvasElement} */
    this.canvas = null
    /** @type {CanvasRenderingContext2D} */
    this.ctx = null
  }

  configureObject( object={}, randomX=false ) {
    const { floor, random } = Math

    object.x = randomX ? floor( random() * (this.canvas.width - 40) ) + 20 : 22
    object.y = (floor( random() * (this.contentHeight / 30 - 1) ) + 1) * 30
    object.color = LoadingBox.colors[ floor( random() * LoadingBox.colors.length ) ]

    return object
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  handleRef = canvas => {
    const { title } = this.props
    const objects = []

    this.ctx = canvas.getContext( `2d` )
    this.canvas = canvas
    this.canvas.width = canvas.clientWidth
    this.canvas.height = canvas.clientHeight

    this.contentHeight = canvas.height - (title ? 50 : 20)

    for (let i = 0; i < this.contentHeight / 10; i++) objects.push( this.configureObject( {}, true ) )

    this.setState( { objects } )

    requestAnimationFrame( this.animate )
  }

  animate = () => {
    const { ctx, contentHeight } = this
    const { width, height } = this.canvas

    ctx.clearRect( 0, 0, width, height )

    this.ctx.fillStyle = `#000a`

    for (let i = 1; i <= Math.floor( contentHeight / 30 ); i++) {
      ctx.fillRect( 20, height - 30 * i, width - 40, 20 )
    }

    if (this.props.title) ctx.fillRect( 40, 20, 110, 20 )

    this.state.objects.forEach( obj => {
      const { x, y, color } = obj

      ctx.fillStyle = color

      const calculatedY = height - y + 10

      ctx.beginPath()
      ctx.rect( x - 3, calculatedY - 3, 6, 7 )
      ctx.arc( x, calculatedY - 4, 3, 0, Math.PI * 2 )
      ctx.arc( x, calculatedY + 4, 3, 0, Math.PI * 2 )
      ctx.fill()

      if (x >= width - 22) this.configureObject( obj )
      else obj.x += 2
    } )

    requestAnimationFrame( this.animate )
  }

  render = () => <canvas className="loading_box" ref={this.handleRef} />
}