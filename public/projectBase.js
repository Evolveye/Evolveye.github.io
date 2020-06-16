export default class ProjectBase {
  #events = []

  static run( instance ) {
    if (!(`importedProjectInstances` in window)) {
      window.importedProjectInstances = {}
    }

    try {
      window.importedProjectInstances[ window.location.href ] = instance
      instance.mount()
    } catch(err) {
      console.error( new Error( err ) )
    }
  }

  constructor() {
    let wrapper = document.querySelector( `#project_wrapper` )

    if (!wrapper) {
      const div = document.createElement( `div` )
      const description = document.createElement( `p` )
      const controls = document.createElement( `div` )

      div.id = `project_wrapper`
      description.className = `project_page-description`
      controls.className = `project_page-controls`

      document.body.appendChild( description )
      document.body.appendChild( controls )
      document.body.appendChild( div )

      wrapper = document.querySelector( `#project_wrapper` )
    }


    this.wrapper = wrapper
    this.description = document.querySelector( `.project_page-description` )
    this.controls = document.querySelector( `.project_page-controls` )
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

    for (const prop in props) input[ prop ] = props[ prop ]

    if (type === `button`) {
      input.value = label

      this.controls.appendChild( input )
    } else {
      const l = document.createElement( `label` )

      l.textContent = label
      l.appendChild( input )

      this.controls.appendChild( l )
    }


    return input
  }
  setDescription( description ) {
    this.description.innerHTML = description
  }

  unmount() {
    this.removeEvents()
  }
  mount() {}
}