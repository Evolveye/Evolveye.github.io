function logic() {
  const p = GAME.player

  if ( GAME.keysPressed( 82 ) ) {
    changeLevel( 0, true )
    GAME.keys[ 82 ] = false
    return
  }

  if ( p.visible ) {
    if ( GAME.keysPressed( `enter` ) ) {
      switch ( GAME.map[ Math.floor( p.mapTile.y ) ][ Math.floor( p.mapTile.x ) ] ) {
        case 2:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 0 )
          break
        case 41:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 1 )
          break
        case 42:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 2 )
          break
        case 43:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 3 )
          break
        case 44:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 4 )
          break
        case 45:
          if ( GAME.keysPressed( `enter` ) )
            changeLevel( 5 )
          break
      }
  
      GAME.keys[ 13 ] = false
    }
  
    if ( GAME.keysPressed( `up`, `w` ) )
      p.changeDirectionIfCan( `N` )
    else if ( GAME.keysPressed( `down`, `s` ) )
      p.changeDirectionIfCan( `S` )
    else if ( GAME.keysPressed( `left`, `a` ) )
      p.changeDirectionIfCan( `W` )
    else if ( GAME.keysPressed( `right`, `d` ) )
      p.changeDirectionIfCan( `E` )
  
    p.move()
  }

  for ( const enemy of GAME.entities.enemies ) {
    let directions = []

    if ( !enemy.lockedDirChanger ) {

      if ( enemy.canIMove( `N` ) && enemy.direction != `S` )
        directions.push( `N` )
      if ( enemy.canIMove( `E` ) && enemy.direction != `W` )
        directions.push( `E` )
      if ( enemy.canIMove( `S` ) && enemy.direction != `N` )
        directions.push( `S` )
      if ( enemy.canIMove( `W` ) && enemy.direction != `E` )
        directions.push( `W` )
  
      if ( !directions.length ) {
        if ( enemy.direction == `N` )
          enemy.direction = `S`
        else if ( enemy.direction == `E` )
          enemy.direction = `W`
        else if ( enemy.direction == `S` )
          enemy.direction = `N`
        else if ( enemy.direction == `W` )
          enemy.direction = `E`
      }

      else if ( directions.length - (directions.includes( enemy.direction ) ? 1 : 0) ) {
        //let dir = directions[ Math.floor( Math.random() * directions.length ) ]
  
        enemy.lockedDirChanger = true
        setTimeout( () => enemy.lockedDirChanger = false, 1 / enemy.speed * 100 )
    
        enemy.direction = directions[ Math.floor( Math.random() * directions.length ) ]
      }
    }

    if ( Math.floor( enemy.mapTile.x * 10 ) / 10 == Math.floor( p.mapTile.x * 10 ) / 10 && 
         Math.floor( enemy.mapTile.y * 10 ) / 10 == Math.floor( p.mapTile.y * 10 ) / 10 )
          changeLevel( 0 )
    
    enemy.move()
  }

  let r = GAME.entities.randoms
  for ( const entity of r ) {
    if ( ![ `Gift` ].includes( entity.constructor.name ) )
      continue

    if ( Math.floor( entity.mapTile.x * 10 ) / 10 != Math.floor( p.mapTile.x * 10 ) / 10 || 
         Math.floor( entity.mapTile.y * 10 ) / 10 != Math.floor( p.mapTile.y * 10 ) / 10 )
          continue

    r.splice( r.indexOf( entity ), 1 )
    p.speed += .1
  }

}
function playInCustomMap( code ) {
  try {
    let map = JSON.parse( code )

    if ( !Array.isArray( map ) )
      throw ``

    maps[99] = map

    changeLevel( 99 )
  }
  catch ( err ) {
    alert( `Zły format mapy!` )
  }
}
function openEditor() {
  GAME.editor = true
  changeLevel( 98 )
}
function end() {
  alert( `Wpaniale! W końcu ktoś przeszedł moją produkcję. Oczywiście chwała Stasiowi za CactuJam #0. Teraz już tylko możesz zrestartować program bądź grać bez prezentów` )
  GAME.freePlay = true
  changeLevel( 0 )
}
function changeLevel( level, reset=false ) {
  if ( !maps[ level ] )
    return

  if (GAME.endedLevels.indexOf( 1 ) != -1 &&
      GAME.endedLevels.indexOf( 2 ) != -1 &&
      GAME.endedLevels.indexOf( 3 ) != -1 &&
      GAME.endedLevels.indexOf( 4 ) != -1 &&
      GAME.endedLevels.indexOf( 5 ) != -1 &&
      !GAME.freePlay
    ) {
      end()
      return
    }

  

  if ( GAME.player )
    GAME.player.visible = false

  if ( level > 0 )
    GAME.scene = `cave`
  else
    GAME.scene = `menu`

  if ( reset )
    GAME.editor = false

  if ( GAME.editor ) {
    GAME.scene = `editor`
    document.querySelector( `#editorTiles` ).style.display = `block`

    maps[ 98 ] = Array( +editorY.value )
    for ( let i = 0;  i < maps[ 98 ].length;  i++) {
      maps[ 98 ][ i ] = Array( +editorX.value )

      for ( let j = 0;  j < maps[ 98 ][ i ].length;  j++)
        maps[ 98 ][ i ][ j ] = 1
    }
    console.log( maps[ 98 ] )
  }
  else
    document.querySelector( `#editorTiles` ).style.display = `none`

  let gifts = 0
  for ( const entity of GAME.entities.randoms )
    if ( entity.constructor.name == `Gift` )
      gifts++

  if ( !gifts && !reset ) {
    maps[ GAME.level || 0 ] = maps[ GAME.level || 0 ].map( row => row.map( tile => tile == 6 ? 1 : tile ))

    if ( GAME.player )
      GAME.player.oldData.speed = GAME.player.speed

    if ( GAME.endedLevels.indexOf( level ) == -1 )
      GAME.endedLevels.push( level )
  }
  else
    GAME.player.speed = GAME.player.oldData.speed

  GAME.level = level

  let map = GAME.map

  for ( const entityname in GAME.entities )
    GAME.entities[ entityname ] = []

  for ( let y = 0;  y < map.length;  y++ )
    for ( let x = 0;  x < map[ y ].length;  x++ )
      switch ( map[ y ][ x ] ) {
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

  sceneConstructor()
}
function drawHelper( ctx, entity ) {
  let c = ctx.canvas
  let tData = entity.texData
  let size = tData.size * GAME.tileSizeMultiplier
  let center = {
    x: entity.position.x + GAME.realTileSize / 2,
    y: entity.position.y + GAME.realTileSize / 2
  }

  ctx.save()
  ctx.translate( (c.id == `background` ? 0 : GAME.offsetLeft) + center.x, (c.id == `background` ? 0 : GAME.offsetTop) + center.y )

  if ( entity instanceof Player ) {
    let dir = entity.direction
    let angleMultiplier = 1
    
    if ( dir == `N` )
      angleMultiplier = 3
    if ( dir == `E` )
      angleMultiplier = 0
    if ( dir == `S` )
      angleMultiplier = 1
    if ( dir == `W` )
      angleMultiplier = 2

    ctx.rotate( Math.PI / 2 * angleMultiplier )
  }

  ctx.drawImage(
    entity.tex, tData.size * tData._x, tData.size * tData._y, tData.size, tData.size,
    -size / 2, -size / 2, size, size
  )
  ctx.restore()
}
function draw() {
  ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height )
  ctxBgr.clearRect( 0, 0, ctxBgr.canvas.width, ctxBgr.canvas.height )
  
  for ( const waterTile of GAME.entities.water )
    drawHelper( ctxBgr, waterTile )
  for ( const exit of GAME.entities.randoms )
    drawHelper( ctx, exit )

  if ( GAME.player.visible )
    drawHelper( ctx, GAME.player )

  if ( GAME.scene == `editor` ) {
    ctx.strokeStyle = `#ffc608`
    ctx.lineWidth = 3
    ctx.strokeRect( GAME.offsetLeft, GAME.offsetTop, GAME.map[ 0 ].length * GAME.realTileSize, GAME.map.length * GAME.realTileSize )
  }
    
  for ( const enemy of GAME.entities.enemies )
    drawHelper( ctx, enemy )
}
function sceneConstructor() {
  ctxMap.clearRect( 0, 0, ctxMap.canvas.width, ctxMap.canvas.height )

  let map = GAME.map
  let size = GAME.realTileSize
  GAME.mapHeight = GAME.map.length
  GAME.mapWidth = GAME.map[0].length

  for ( let y = 0;  y < map.length;  y++ )
    if ( GAME.mapWidth <  map[ y ].length)
      GAME.mapWidth = map[ y ].length

  switch (GAME.scene) {
    case `menu`: {
      let width = Math.ceil( ctx.canvas.width / GAME.realTileSize )
      let height = Math.ceil( ctx.canvas.height / GAME.realTileSize )
      let img = new Image
      img.src = `./img/land.png`
      // ctx.translate( GAME.offsetLeft + center.x, GAME.offsetTop + center.y )
      img.onload = () => ctxMap.drawImage( img, GAME.offsetLeft + GAME.realTileSize, GAME.offsetTop + GAME.realTileSize, GAME.realTileSize * 4, GAME.realTileSize * 4 )
      
      while ( width-- ) {
        let h = height
        while ( h-- )
          // console.log( width, h )
          new Water( width, h )
      }
      break
    }
    case `editor`:
    case `cave`:
      for ( let y = 0;  y < map.length;  y++ )
        for ( let x = 0;  x < map[ y ].length;  x++ ) {
          let mapTile = map[ y ][ x ]
    
          if ( !mapTile )
            continue
    
          let tileName = `cave-`
    
          if ( map[ y ][ x - 1 ] ) // mapTile on the left
            tileName += `1.`
          else
            tileName += `0.`
    
          if ( (map[ y - 1 ] ? map[ y - 1 ][ x ] : 0) ) // mapTile above
            tileName += `1.`
          else
            tileName += `0.`
    
          if ( map[ y ][ x + 1 ] ) // mapTile on the right
            tileName += `1.`
          else
            tileName += `0.`
    
          if ( (map[ y + 1 ] ? map[ y + 1 ][ x ] : 0) ) // mapTile below
            tileName += `1`
          else
            tileName += `0`
    
          let img = new Image
          img.src = `./img/${tileName}-${Math.random() > .5 ? 1 : 0}.png`
          img.onload = () => ctxMap.drawImage( img, GAME.offsetLeft + x * size, GAME.offsetTop + y * size, size, size )
        }
      break
  }

  GAME.offsetLeft = (ctx.canvas.width - 300 - GAME.realTileSize * GAME.mapWidth) / 2
  GAME.offsetTop = (ctx.canvas.height - GAME.realTileSize * GAME.mapHeight) / 2
}
function setCtx() {
  ctx.imageSmoothingEnabled = false
  ctxMap.imageSmoothingEnabled = false
}
function resize() {
  for ( const canvasName in canvases ) {
    canvases[ canvasName ].width = window.innerWidth
    canvases[ canvasName ].height = window.innerHeight
  }
  setCtx()
  sceneConstructor()
}
function play() {
  resize()
  changeLevel( 0 )
  setInterval( () => {
    logic()
    requestAnimationFrame( () => draw() )
  }, 1000 / 60 )
  setInterval( () => {
    for ( const waterTile of GAME.entities.water )
      waterTile.setNextFrame()
  }, 1000 / 4 )
}