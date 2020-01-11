import { subCanvas } from "./functions.js";

const siteConfig = {
  modules: new Map,
  activeModule: {},
  mouse: { down:{ x:null, y:null }, up:{ x:null, y:null }, current:{ x:null, y:null }, pressed:false }
}

function activeModule( src ) {
  if (!siteConfig.modules.has( src )) siteConfig.modules.set( src, {
    onResize: null,
    onMouseMove: null,
    onMouseDown: null,
    onMouseUp: null,
    onClick: null,
  } )

  siteConfig.activeModule = siteConfig.modules.get( src )
}

export async function importScript( src ) {
  activeModule( src )
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
  siteConfig.activeModule.onResize = handler
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
  siteConfig.activeModule.onMouseMove = handler
}
/**
 * @callback onMouseDownHandler
 * @param {{x:number y:number}} down
 */
/**
 * @param {onMouseDownHandler} handler
 */
export function setOnMouseDown( handler ) {
  siteConfig.activeModule.onMouseDown = handler
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
  siteConfig.activeModule.onMouseUp = handler
}
/**
 * @callback onClickHandler
 */
/**
 * @param {onClickHandler} handler
 */
export function setOnClick( handler ) {
  siteConfig.activeModule.onClick = handler
}

document.addEventListener( 'mouseup', ({ offsetX, offsetY, target }) => {
  const { mouse, activeModule } = siteConfig
  const { down, up } = mouse

  if (!mouse.pressed) return

  up.x = offsetX
  up.y = offsetY

  mouse.pressed = false

  if (target === subCanvas && activeModule.onMouseUp) activeModule.onMouseUp( up, down )
} )
document.addEventListener( 'mousedown', ({ offsetX, offsetY }) => {
  const { mouse, activeModule } = siteConfig
  const { down } = mouse

  down.x = offsetX
  down.y = offsetY

  mouse.pressed = true

  if (activeModule.onMouseDown) activeModule.onMouseDown( down )
} )
document.addEventListener( 'mousemove', ({ offsetX, offsetY, target }) => {
  const { mouse, activeModule } = siteConfig
  const { pressed, current, down } = mouse

  if (target !== subCanvas) mouse.pressed = false

  current.x = offsetX
  current.y = offsetY

  if (activeModule.onMouseMove) activeModule.onMouseMove( pressed, current.x, current.y, down )
} )
document.addEventListener( 'click', () => {
  const { mouse, activeModule } = siteConfig
  const { up, down } = mouse

  if (activeModule.onClick && up.x === down.x && up.y == down.y) activeModule.onClick( up )
} )
window.addEventListener( `resize`, () => siteConfig.activeModule.onResize && siteConfig.activeModule.onResize() )