const importer = document.querySelector( `.importer` )
const canvas = document.querySelector( `canvas` )
const siteConfig = {
  mouse: { down:{ x:null, y:null }, up:{ x:null, y:null }, current:{ x:null, y:null }, pressed:false },
  onResize() {},
  onMouseMove() {},
  onMouseDown() {},
  onMouseUp() {},
  onClick() {},
  draw() {},
}

async function importScript( src ) {
  const config = (await import( src )).default

  if (!config) return console.warn( `That file haven't default data object` )

  siteConfig.onResize = config.onResize || null
  siteConfig.onMouseMove = config.onMouseMove || null
  siteConfig.onMouseDown = config.onMouseDown || null
  siteConfig.onMouseUp = config.onMouseUp || null
  siteConfig.onClick = config.onClick || null
  siteConfig.draw = config.draw || null

  console.log( `%cScript has been imported %c(${src})`, `font-weight:bold`, `font-weight:normal` )
}
function clear() {
  ctx.fillStyle = '#eee'

  ctx.fillRect( drawAreaX, drawAreaY, drawableAreaSize, drawableAreaSize )
}
function resize( width=window.innerWidth, height=window.innerHeight ) {
  canvas.width = width
  canvas.height = height

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
  const { up } = mouse

  up.x = clientX
  up.y = clientY

  mouse.pressed = false

  if (onMouseUp) onMouseUp( up )
} )
document.addEventListener( 'mousedown', ({ clientX, clientY }) => {
  const { mouse, onMouseDown } = siteConfig
  const { down } = mouse

  down.x = clientX
  down.y = clientY

  mouse.pressed = true

  if (onMouseDown) onMouseDown( down )
} )
document.addEventListener( 'mousemove', ({ clientX, clientY }) => {
  const { mouse, onMouseMove } = siteConfig
  const { current } = mouse

  current.x = clientX
  current.y = clientY

  if (onMouseMove) onMouseMove( current )
} )
document.addEventListener( 'click', () => {
  const { mouse, onClick } = siteConfig
  const { up, down } = mouse

  if (onClick && up.x === down.x && up.y == down.y) onClick( up )
} )
importer.addEventListener( `click`, () => importScript( `/simple_mini_projects/main_script_placeholder.js` ) )