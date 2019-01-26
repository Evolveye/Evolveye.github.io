"use strict"

const canvases = {
  bgr: document.querySelector( `canvas#background` ),
  entities: document.querySelector( `canvas#entities` ),
  map: document.querySelector( `canvas#map` )
}
/** @type {CanvasRenderingContext2D} */
const ctx = canvases.entities.getContext( `2d` )
/** @type {CanvasRenderingContext2D} */
const ctxMap = canvases.map.getContext( `2d` )
/** @type {CanvasRenderingContext2D} */
const ctxBgr = canvases.bgr.getContext( `2d` )

play()

/** @type {HTMLImageElement[]} */
const options = document.querySelectorAll( `#editorTiles img` )
for ( const option of options )
  option.addEventListener( `click`, function() {
    for ( const option of options )
      if ( option != this )
        option.dataset.active = false

    this.dataset.active = !eval( this.dataset.active )
  } )

const inputs = document.querySelectorAll( `#editorTiles input` )
for ( const input of inputs )
  input.addEventListener( `click`, () => {
    while ( maps[ 98 ].length > +editorY.value )
      maps[ 98 ].pop()

    while ( maps[ 98 ].length < +editorY.value ) {
      maps[ 98 ].push( Array( +editorX.value ) )

      for ( let i = 0;  i < maps[ 98 ][ maps[ 98 ].length - 1 ].length;  i++)
        maps[ 98 ][ maps[ 98 ].length - 1 ][ i ] = 1
    }

    while ( maps[ 98 ][0].length > +editorX.value )
      for ( let row of maps[ 98 ])
        row.pop()

    while ( maps[ 98 ][0].length < +editorX.value )
      for ( let row of maps[ 98 ]) {
        row.push( 1 )
      }
      
    console.log( 1 )
    sceneConstructor()
  } )


document.addEventListener( `click`, e => {
  let item = document.querySelector( `#editorTiles img[data-active=true]` )

  if ( !item )
    return

  let x = Math.floor( (e.clientX - GAME.offsetLeft) / GAME.realTileSize )
  let y = Math.floor( (e.clientY - GAME.offsetTop) / GAME.realTileSize )

  if ( maps[ 98 ][ y ] ? typeof maps[ 98 ][ y ][ x ] == `number` : false ) {
    maps[ 98 ][ y ][ x ] = +item.dataset.value
    console.log( maps[ 98 ][ y ][ x ] )

    switch ( maps[ 98 ][ y ][ x ] ) {
      case 2:
        GAME.entities.randoms.push( new Exit( x, y ) )
      case 5:
        GAME.createPlayer( x, y )
        break
      case 6:
        new Gift( x, y )
        break
      case 31:
        new Enemy( x, y, .75 )
        break
      case 32:
        new Enemy( x, y, 1 )
        break
      case 33:
        new Enemy( x, y, 1.5 )
        break
      case 34:
        new Enemy( x, y, 2 )
        break
      case 35:
        new Enemy( x, y, 2.5 )
        break
    }
  }
  mapFromEditor.value = JSON.stringify( maps[ 98 ] )
  sceneConstructor()
} )
document.addEventListener( `keydown`, e => GAME.keys[ e.keyCode ] = true )
document.addEventListener( `keyup`, e => GAME.keys[ e.keyCode ] = false )
window.addEventListener( `resize`, resize )
window.addEventListener( `load`, () => {
  console.log( ctx.canvas.width )
  if ( ctx.canvas.width < 1200 )
    GAME.sizeDivider = 1.5
    
  resize()
} )