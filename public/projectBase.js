export default class ProjectBase {
  #events = []

  static run( instance ) {
    console.log( 1 )
    try {
      window.importedProjectInstances[ window.location.href ] = instance
      instance.mount()
    } catch(err) {
      console.log( err )
    }

    console.log( window.importedProjectInstances )
  }

  constructor() {
    this.wrapper = document.querySelector( `#project_wrapper` )
    this.eventListeners

    /** @type {CanvasRenderingContext2D} */
    this.ctx = null
  }

  createRenderingContext() {
    const canvas = document.createElement( `canvas` )
    const ctx = canvas.getContext( `2d` )

    canvas.width = this.wrapper.clientWidth
    canvas.height = this.wrapper.clientHeight

    this.ctx = ctx
    this.wrapper.appendChild( canvas )

    return ctx
  }
  clearContext() {
    if (!this.ctx) return

    const { width, height } = this.ctx.canvas

    this.ctx.clearRect( 0, 0, width, height )
  }

  setEventListener( item, eventName, listener ) {
    item.addEventListener( eventName, listener )

    this.#events.push( { item, eventName, listener } )
  }
  removeEvents() {
    this.#events.forEach( ({item, eventName, listener}) => {
      item.removeEventListener( eventName, listener )
    } )
  }

  createInput( type, label, props ) {
    const input = document.createElement( `input` )

    input.type = type

    for (const prop in props) {
      const p = props[ prop ]

      input[ prop ] = typeof p == `function` ? input => p( input ) : p
    }

    this.wrapper.appendChild( input )

    return input
  }

  unmount() {
    this.removeEvents()
  }
  mount() {}
}