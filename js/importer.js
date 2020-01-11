const siteConfig = {
  mouse: { down:{ x:null, y:null }, up:{ x:null, y:null }, current:{ x:null, y:null }, pressed:false },
  onResize() {},
  onMouseMove() {},
  onMouseDown() {},
  onMouseUp() {},
  onClick() {},
  draw() {},
}

export async function importScript( src ) {
  siteConfig.onResize = null
  siteConfig.onMouseMove = null
  siteConfig.onMouseDown = null
  siteConfig.onMouseUp = null
  siteConfig.onClick =  null

  await import( src )

  console.log( `%cScript has been imported %c(${src})`, `font-weight:bold`, `font-weight:normal` )
}
/**
 * @callback onResizeHandler
 */
/**
 * @param {onResizeHandler} handler
 */
export function setOnResize( handler ) {
  siteConfig.onResize = handler
}
/**
 * @callback onMouseMoveHandler
 * @param {boolean} pressed
 * @param {number} clientX
 * @param {number} clientY
 * @param {{x:number y:number}} down
 */
/**
 * @param {onMouseMoveHandler} handler
 */
export function setOnMouseMove( handler ) {
  siteConfig.onMouseMove = handler
}
/**
 * @callback onMouseDownHandler
 * @param {{x:number y:number}} down
 */
/**
 * @param {onMouseDownHandler} handler
 */
export function setOnMouseDown( handler ) {
  siteConfig.onMouseDown = handler
}
/**
 * @callback onMouseUpHandler
 * @param {{x:number y:number}} up
 * @param {{x:number y:number}} down
 */
/**
 * @param {onMouseUpHandler} handler
 */
export function setOnMouseUp( handler ) {
  siteConfig.onMouseUp = handler
}
/**
 * @callback onClickHandler
 */
/**
 * @param {onClickHandler} handler
 */
export function setOnClick( handler ) {
  siteConfig.onClick = handler
}

document.addEventListener( 'mouseup', ({ offsetX, offsetY }) => {
  const { mouse, onMouseUp } = siteConfig
  const { down, up } = mouse

  up.x = offsetX
  up.y = offsetY

  mouse.pressed = false

  if (onMouseUp) onMouseUp( up, down )
} )
document.addEventListener( 'mousedown', ({ offsetX, offsetY }) => {
  const { mouse, onMouseDown } = siteConfig
  const { down } = mouse

  down.x = offsetX
  down.y = offsetY

  mouse.pressed = true

  if (onMouseDown) onMouseDown( down )
} )
document.addEventListener( 'mousemove', ({ offsetX, offsetY }) => {
  const { mouse, onMouseMove } = siteConfig
  const { pressed, current, down } = mouse

  current.x = offsetX
  current.y = offsetY

  if (onMouseMove) onMouseMove( pressed, current.x, current.y, down )
} )
document.addEventListener( 'click', () => {
  const { mouse, onClick } = siteConfig
  const { up, down } = mouse

  if (onClick && up.x === down.x && up.y == down.y) onClick( up )
} )
window.addEventListener( `resize`, () => siteConfig.onResize && siteConfig.onResize() )