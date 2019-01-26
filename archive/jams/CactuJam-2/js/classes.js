
const GAME = {
  tileSize: 32,
  tileSizeMultiplier: 2,
  sizeDivider: 1,
  level: 0,
  keys: [],
  editor: false,
  scene: `menu`,
  offsetLeft: 0,
  offsetTop: 0,
  freePlay: false,
  /** @type {Player} */
  player: null,
  endedLevels: [],
  entities: {
    /** @type {Player[]} */
    players: [],
    /** @type {Enemy[]} */
    enemies: [],
    /** @type {Water[]} */
    water: [],
    /** @type {GameElement[]} */
    randoms: []
  },

  get map() {
    return maps[ this.level ]
  },
  get realTileSize() {
    return this.tileSize * this.tileSizeMultiplier
  },

  keysPressed( ...keys ) {
    for ( let key of keys ) {
      switch ( key ) {
        case `enter`:
          key = 13
          break
        case `up`:
          key = 38
          break
        case `down`:
          key = 40
          break
        case `left`:
          key = 37
          break
        case `right`:
          key = 39
          break
        case `w`:
          key = 87
          break
        case `s`:
          key = 83
          break
        case `a`:
          key = 65
          break
        case `d`:
          key = 68
          break
      }

      if ( this.keys[ key ] )
        return true
    }
    
    return false
  },
  createPlayer( x, y ) {

    if ( !this.player )
      this.player = new Player( x, y, 1, `E` )
    else {
      this.player.x = x
      this.player.y = y
      this.player.mapTile = { x, y }
      this.player.visible = true
      this.player.position = {
        x: x * GAME.realTileSize,
        y: y * GAME.realTileSize
      }
      this.player.spawnpoint = Object.assign( this.player.position )
    }
  }
}

class GameElement {
  constructor( x, y, tex={} ) {
    this.mapTile = { x, y }
    this.position = {
      x: x * GAME.realTileSize,
      y: y * GAME.realTileSize
    }

    this.tex = new Image
    this.tex.src = tex.src
    this.texData = {
      size: tex.size,
      _interval: null,
      _framesInRow: null,
      _framesInColumn: null,
      _x: 0,
      _y: 0
    }

    this.tex.onload = () => {
      this.texData._framesInRow = this.tex.width / tex.size
      this.texData._framesInColumn = this.tex.height / tex.size
    }
  }

  setNextFrame() {
    const t = this.tex
    const tData = this.texData

    let moduloHeight = t.height % tData.size
    let moduloWidth = t.width % tData.size

    if ( moduloWidth == 1 && moduloHeight == 1 )
      return

    if ( tData._x + 1 != tData._framesInRow )
      tData._x++
    else if ( tData._y + 1 != tData._framesInColumn ) {
      tData._x = 0
      tData._y++
    }
    else {
      tData._x = 0
      tData._y = 0
    }
  }
}

class Entity extends GameElement {
  constructor( x, y, speed=0, direction=`N`, tex={} ) {
    super( x, y , tex )

    this.lockedDirChanger
    this.spawnpoint = Object.assign( this.position )
    this.direction = direction
    this.isMoving = false
    this.speed = speed
    this.hp = 100
  }

  changeDirectionIfCan( dir ) {
    if ( this.canIMove( dir ) )
      this.direction = dir
  }
  canIMove( dir=this.direction ) {

    let nextY = [ `N`, `S` ].includes( dir ) ? (dir == `N` ? -1 : 1) : 0
    let nextX = [ `E`, `W` ].includes( dir ) ? (dir == `W` ? -1 : 1) : 0

    let px = Math.floor( this.mapTile.x )
    let py = Math.floor( this.mapTile.y )
    let nextTile = !!(GAME.map[ py + nextY ] ? GAME.map[ py + nextY ][ px + nextX ] : 0)
    let center = {
      x: Math.abs( this.mapTile.x % 1 * 100 ),
      y: Math.abs( this.mapTile.y % 1 * 100 )
    }
  
    let precision = 6
    if ( nextX )
      return true &&
        center.y < precision && nextTile ||
        [ `E`, `W` ].includes( this.direction ) && (nextTile || center.x > precision) // || center.x > 2
    else
      return true &&
        center.x < precision && nextTile ||
        [ `N`, `S` ].includes( this.direction ) && (nextTile || center.y > precision )
  }
  move() {
    if ( !this.texData._interval ) {
      this.texData._interval = setInterval( () => this.setNextFrame(), 100 )
    }

    if ( this.canIMove() )
      switch ( this.direction ) {
        case `N`:
          this.position.y -= this.speed
          break
        case `E`:
          this.position.x += this.speed
          break
        case `S`:
          this.position.y += this.speed
          break
        case `W`:
          this.position.x -= this.speed
          break
      }

    this.mapTile.x = this.position.x / GAME.realTileSize
    this.mapTile.y = this.position.y / GAME.realTileSize
  }
}

class Player extends Entity {
  constructor( x, y, speed, direction ) {
    super( x, y, speed, direction, { src:`./img/player.png`, size: 15 } )

    this.visible = true
    this.oldData = { speed }

    GAME.entities.players.push( this )
  }
}

class Enemy extends Entity {
  constructor( x, y, speed=2, direction=`N` ) {
    super( x, y, speed, direction, { src:`./img/enemy.png`, size:15 } )

    GAME.entities.enemies.push( this )
  }
}

class Water extends GameElement {
  constructor( x, y ) {
    super( x, y, { src:`./img/water.png`, size:32 } )

    GAME.entities.water.push( this )
  }
}

class Exit extends GameElement {
  constructor( x, y ) {
    super( x, y, { src:`./img/exit.png`, size:20 } )

    GAME.entities.randoms.push( this )
  }
}

class Gift extends GameElement {
  constructor( x, y ) {
    super( x, y, { src:`./img/gift.png`, size:11 } )

    GAME.entities.randoms.push( this )
  }
}