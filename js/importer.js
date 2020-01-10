const importer = document.querySelector( `.importer` )
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector( `.canvas-simpleMiniProjects` )
const ctx = canvas.getContext( `2d` )
const siteConfig = {
  canvasX: 0,
  canvasY: 0,
  mouse: { down:{ x:null, y:null }, up:{ x:null, y:null }, current:{ x:null, y:null }, pressed:false },
  onResize() {},
  onMouseMove() {},
  onMouseDown() {},
  onMouseUp() {},
  onClick() {},
  draw() {},
}

async function importScript( src ) {
  const subpage = document.querySelector( `.subpage` )
  const config = (await import( src )).default

  subpage.classList.add( `is-showed` )

  if (!config) return console.warn( `That file haven't default data object` )

  siteConfig.onResize = config.onResize || null
  siteConfig.onMouseMove = config.onMouseMove || null
  siteConfig.onMouseDown = config.onMouseDown || null
  siteConfig.onMouseUp = config.onMouseUp || null
  siteConfig.onClick = config.onClick || null

  console.log( `%cScript has been imported %c(${src})`, `font-weight:bold`, `font-weight:normal` )

  if (config.run) {
    config.run( ctx, clear )
    resize()
  }
}
function clear() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height )
}
function resize( width=canvas.clientWidth, height=canvas.clientHeight ) {
  canvas.width = width
  canvas.height = height

  const { x, y } = canvas.getBoundingClientRect()
  siteConfig.canvasX = x
  siteConfig.canvasY = y

  if (siteConfig.onResize) siteConfig.onResize()

  clear()
}
function toggleCanvas() {
  const { style } = canvas

  style.display = style.display === `none` ? `block` : `none`
}
function clickOnCenteredRectangle( clientX, clientY, { width=canvas.width, height=canvas.height, borderX=0, borderY=0 } ) {
  const x = (canvas.width - width) / 2
  const y = (canvas.height - height) / 2

  return clientX > x + borderX && clientX < x + width - borderX
    && clientY > y + borderY && clientY < y + height - borderY
}

window.addEventListener( 'resize', resize )
document.addEventListener( 'mouseup', ({ clientX, clientY }) => {
  const { mouse, onMouseUp } = siteConfig
  const { down, up } = mouse

  up.x = clientX - siteConfig.canvasX
  up.y = clientY - siteConfig.canvasY

  mouse.pressed = false

  if (onMouseUp) onMouseUp( up, down )
} )
document.addEventListener( 'mousedown', ({ clientX, clientY }) => {
  const { mouse, onMouseDown } = siteConfig
  const { down } = mouse

  down.x = clientX - siteConfig.canvasX
  down.y = clientY - siteConfig.canvasY

  mouse.pressed = true

  if (onMouseDown) onMouseDown( down )
} )
document.addEventListener( 'mousemove', ({ clientX, clientY }) => {
  const { mouse, onMouseMove } = siteConfig
  const { pressed, current, down } = mouse

  current.x = clientX - siteConfig.canvasX
  current.y = clientY - siteConfig.canvasY

  if (onMouseMove) onMouseMove( pressed, current.x, current.y, down )
} )
document.addEventListener( 'click', () => {
  const { mouse, onClick } = siteConfig
  const { up, down } = mouse

  if (onClick && up.x === down.x && up.y == down.y) onClick( up )
} )
importer.addEventListener( `click`, () => importScript( `/simple_mini_projects/bresenham-copy/main.js` ) )