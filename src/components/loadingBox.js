import React from "react"

//import "./LoadingBox.css"

export default class LoadingBox extends React.Component {
  static colors = [ `#f8cf07`, `#43c243`, `#be3922` ]

  ref = React.createRef()
  ctx = null
  contentHeight = 0
  padding = 0

  state = {
    objects: []
  }

  configureObject( object={}, randomX=false ) {
    const { floor, random } = Math

    object.x = randomX ? floor( random() * (this.ref.current.width - 40) ) + this.padding : this.padding + 2
    object.y = (floor( random() * (this.contentHeight / 30 - 1) ) + 1) * 30
    object.color = LoadingBox.colors[ floor( random() * LoadingBox.colors.length ) ]

    return object
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  componentDidMount() {
    const { title } = this.props
    const canvas = this.ref.current
    const objects = []

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    this.ctx = canvas.getContext( `2d` )
    this.contentHeight = canvas.height - (title ? 50 : 20)

    for (let i = 0; i < this.contentHeight / 10; i++) objects.push( this.configureObject( {}, true ) )

    this.setState( { objects } )

    requestAnimationFrame( this.animate )
  }

  animate = () => {
    const canvas = this.ref.current

    if (!canvas) return

    const { ctx, contentHeight, padding } = this
    const { width, height } = canvas

    ctx.clearRect( 0, 0, width, height )

    this.ctx.fillStyle = `#0002`

    for (let i = 1; i <= Math.floor( contentHeight / 30 ); i++) {
      ctx.fillRect( padding, height - 30 * i, width - padding * 2, 20 )
    }

    if (this.props.title) ctx.fillRect( padding * 1.5, 20, 110, 20 )

    this.state.objects.forEach( obj => {
      const { x, y, color } = obj

      ctx.fillStyle = color

      const calculatedY = height - y + 10

      ctx.beginPath()
      ctx.rect( x - 3, calculatedY - 3, 6, 7 )
      ctx.arc( x, calculatedY - 4, 3, 0, Math.PI * 2 )
      ctx.arc( x, calculatedY + 4, 3, 0, Math.PI * 2 )
      ctx.fill()

      if (x >= width - (padding + 2)) this.configureObject( obj )
      else obj.x += 2
    } )

    requestAnimationFrame( this.animate )
  }

  render = () => <canvas className={`${this.props.className || ``} loading_box`} ref={this.ref} />
}