class EvolutionGameEntity {
  /**
   * @param {Number} x x position
   * @param {Number} y y position
   * @param {String} stage Name of entity stage
   * @param {EvolutionGame} game EvolutionGame instance
   */
  constructor( x, y, game, stage ) {
    this.x = x
    this.y = y
    this.game = game
    this.stage = stage
    this.upgradeChainPos = game.upgradeChain.length
    this.node = document.createElement( `img` )

    game.upgradeChain.push( this )
  }
  evolve() {}
  onclick() {}
  delete() {
    delete this.game.upgradeChain[this.upgradeChainPos]
    delete this.game.tiles[this.y][this.x].images[this.scope]
    delete this.game.tiles[this.y][this.x].onclicks[this.scope]
    this.node.remove()
  }
  build( src, CanBePlacedOn_stages=[undefined]/* , CanBePlacedOn_classes=[`Object`] */, x=this.x, y=this.y) {
    let g = this.game
    let scope = this.scope
    if (!src || !Number.isInteger( scope ))
      return
    for (let i0 = 0;  i0 < 3;  i0++) {
      if (!g.tiles[this.y])
        return
      else if (!g.tiles[this.y][this.x])
        return

      let entity = g.tiles[this.y][this.x].images[i0] || {}
      let stages = CanBePlacedOn_stages[i0]

      // let accesToBuild_classes = CanBePlacedOn_classes.includes( `${entity.constructor.name}` )
      // if (this.stage === `pond`)
      //   console.log(entity,stages,entity.stage )

      if (!stages.length) {
        if (entity.stage)
          return
        else
          continue
      }
      else if (!stages.includes( entity.stage ))
        return
    }

    let img = new Image
    img.src = `./ingame_graphics/${src}`
    img.className = `EvolutionGameEntity-tile`
    img.style.left = `${x * g.tileSize}px`
    img.style.top = `${y * g.tileSize}px`
    img.style.width = `${g.tileSize + 1}px`

    this.node = img

    g.layers[scope].appendChild( img )
    g.tiles[this.y][this.x].onclicks[scope] = () => this.onclick()
    g.tiles[this.y][this.x].images[scope] = this

    if (g.activeTile.node)
      g.awailableTiles[g.activeTile.stage]--
  }
  set src( src ) {
    this.node.src = `./ingame_graphics/${src}`
  }
}

class Cactus extends EvolutionGameEntity {
  constructor( x, y, game, stage=`cactus` ) {
    super( x, y, game, stage )
    let src

    this.clicksCounter = 0
    this.linkedLands = []

    if (stage === `cactus`)
      src = `cactus.png`
    if (stage === `part left`)
      src = `cactus-left.png`
    if (stage === `part right`)
      src = `cactus-right.png`
    if (stage === `part top`)
      src = `cactus-top.png`
    if (stage === `part bottom`)
      src = `cactus-bottom.png`

    if (game.tiles[y][x].images[1]) {
      y -= .3
      this.scope = 2
    }
    else
      this.scope = 0

    this.build( src, [[],[undefined, `land`],[]], x, y )
  }
  evolve() {
    if (this.game.tiles[this.y][this.x].images[1] && this.scope === 0)
      return

    switch (this.stage) {
      case `cactus`: {
        let {tiles} = this.game
        let {x, y} = this
        let lands = {
          left: tiles[y][x - 1] ? tiles[y][x - 1].images[1] || {} : {},
          right: tiles[y][x + 1] ? tiles[y][x + 1].images[1] || {} : {},
          up: tiles[y - 1] ? tiles[y - 1][x].images[1] || {} : {},
          bottom: tiles[y + 1] ? tiles[y + 1][x].images[1] || {} : {}
        }

        if (lands.left.stage === `land`) {
          this.linkedLands = [lands.left]
          this.src = `cactus-bloomed-1000.png`
        }
        else if (lands.right.stage === `land`) {
          this.linkedLands = [lands.right]
          this.src = `cactus-bloomed-0100.png`
        }
        else if (lands.up.stage === `land`) {
          this.linkedLands = [lands.up]
          this.src = `cactus-bloomed-0010.png`
        }
        else if (lands.bottom.stage === `land`) {
          this.linkedLands = [lands.bottom]
          this.src = `cactus-bloomed-0001.png`
        }
        else {
          this.src = `cactus-bloomed-0000.png`
        }
        this.stage = `bloomed`
      } break
      case `baby`: {
        this.src = `cactus.png`
        this.stage = `cactus`
      } break
      case `part left`:
      case `part right`:
      case `part top`:
      case `part bottom`: {
        this.src = `cactus-baby.png`
        this.stage = `baby`
      } break
      case `bloomed`: {
        let tiles = this.game.tiles
        this.stage = `growed`
        this.src = `cactus-big.png`
        this.linkedLands.forEach( land => {
          let tile = tiles[land.y][land.x].images[2]

          if (tile) {
            if (tile.stage === `magic flower`) {
              tile.count++
              return
            }
          }
          else
            new MagicFlower( land.x, land.y, this.game )
        } )
      }
    }
  }
  onclick() {
    if (this.stage !== `cactus`)
      return

    let {x, y} = this.game.mouse
    let tiles = this.game.tiles
    let lands = {
      left: tiles[y][x - 1] ? tiles[y][x - 1].images[1] : undefined,
      right: tiles[y][x + 1] ? tiles[y][x + 1].images[1] : undefined,
      up: tiles[y - 1] ? tiles[y - 1][x].images[1] : undefined,
      down: tiles[y + 1] ? tiles[y + 1][x].images[1] : undefined
    }
    if (x === this.x && y === this.y && !lands.me && !lands.left && !lands.right && !lands.up && !lands.bottom) {
      this.clicksCounter++

      if (this.clicksCounter >= 10) {
        new Cactus( this.x - 1, this.y, this.game, `part left` )
        new Cactus( this.x + 1, this.y, this.game, `part right` )
        new Cactus( this.x, this.y - 1, this.game, `part top` )
        new Cactus( this.x, this.y + 1, this.game, `part bottom` )
        this.delete()
      }
    }
  }
}
class Land extends EvolutionGameEntity {
  constructor( x, y, game, stage=`land` ) {
    super( x, y, game, stage )
    this.scope = 1
    let src

    if (stage === `land`) {
      let tiles = this.game.tiles
      let landConfig = [0,0,0]
      let lands = {
        left: tiles[y][x - 1] ? tiles[y][x - 1].images[1] : undefined,
        right: tiles[y][x + 1] ? tiles[y][x + 1].images[1] : undefined,
        up: tiles[y - 1] ? tiles[y - 1][x].images[1] : undefined,
        down: tiles[y + 1] ? tiles[y + 1][x].images[1] : undefined
      }
  
      if (lands.left) {
        if (lands.left.stage === `land`) {
          let node = lands.left.node
          node.src = `${node.src.slice( 0, -6 )}1${node.src.slice( -5 )}`
          landConfig[0] = 1
        }
      }
      if (lands.right) {
        if (lands.right.stage === `land`) {
          let node = lands.right.node
          node.src = `${node.src.slice( 0, -7 )}1${node.src.slice( -6 )}`
          landConfig[1] = 1
        }
      }
      if (lands.up) {
        if (lands.up.stage === `land`) {
          let node = lands.up.node
          node.src = `${node.src.slice( 0, -5 )}1${node.src.slice( -4 )}`
        }
      }
      if (lands.down) {
        landConfig[2] = 1
      }
  
      src = `land-${landConfig.join( `` )}.png`
    }

    this.build( src, [[undefined, `part left`,`part right`, `part top`, `part bottom`, `baby`, `cactus`],[],[]])
  }
  evolve() {
    switch (this.stage) {
      case `land`: {
        let underland = this.game.tiles[this.y][this.x].images[0]
        if (underland instanceof Cactus) {
          if (underland.stage === `cactus` && this.node.src.slice( -12 ) === `land-000.png` ) {
            this.src = `land-cactus-0.png`
            this.stage = `cactuland 0`
          }
          underland.delete()
        }
        let option = this.game.gamebox.querySelector( `[src="./options/animal.png"]` )

        if (!option.parentElement.classList.contains( `is-hidden` ))
          break

        this.game.showTile( {
          option,
          hidden: false,
          state: true,
          count: 2
        } )
        this.game.showTile( {
          option: this.game.gamebox.querySelector( `[src="./options/pond.png"]` ),
          hidden: false,
          state: true,
          count: 1
        } )
      } break
      case `cactuland 0`: {
        if (this.game.tiles[this.y][this.x].images[2])
          break

        this.src = `land-cactus-1.png`
        this.stage = `cactuland 1`
      } break
      case `cactuland 1`: {
        if (this.game.tiles[this.y][this.x].images[2])
          break

        this.src = `land-cactus-2.png`
        this.stage = `cactuland 2`
      } break
      case `cactuland 2`: {
        let tile = this.game.tiles[this.y][this.x].images[2] || {}
        if (tile.stage === `animal`) {
          tile.delete()

          // let option = this.game.gamebox.querySelector( `[src="./options/animal.png"]` )
          // this.game.showTile( {
          //   count: +option.parentElement.dataset.count + 1,
          //   state: true,
          //   option
          // } )

          this.src = `land-cactus-plague-0.png`
          this.stage = `cactuland plague 0`
          new Plague( this.x, this.y, this.game )
        }
        else {
          this.src = `land-cactus-3.png`
          this.stage = `cactuland 3`
        }
      } break
    }
  }
}
class Animal extends EvolutionGameEntity {
  constructor( x, y, game, stage=`animal` ) {
    super( x, y, game, stage )
    this.scope = 2
    let src
    let tile = this.game.tiles[y][x].images[2] || {}

    if (tile.node && stage === `zebra`) {
      if (tile.node.src.slice( -14 ) === `river-1100.png`) {
        tile.stage = `drowned zebra`
        tile.src = `river-zebra.png`
        this.game.awailableTiles[`zebra`]--
        return
      }
    }
    if (stage === `zebra`)
      src = `animal-zebra.png`
    else
      src = `animal.png`

    this.build( src, [[],[`land`, `cactuland 0`, `cactuland 1`,`cactuland 2`],[]], this.x, this.y - .3)
  }
  onclick() {
    let option = this.game.gamebox.querySelector( `[src="./options/${this.stage}.png"]` )
    this.game.showTile( {
      count: +option.parentElement.dataset.count + 1,
      hidden: false,
      state: true,
      option
    } )
    this.delete()
  }
}
class Water extends EvolutionGameEntity {
  constructor( x, y, game, stage=`river` ) {
    super( x, y, game, stage )
    this.scope = 2
    this.end = true

    if (!this.game.tiles[y][x].images[1])
      return

    if (stage === `pond`) {
      this.game.showTile( {
        hidden: true,
        state: false,
        option: this.game.gamebox.querySelector( `[src="./options/pond.png"]` )
      } )
      this.game.showTile( {
        hidden: false,
        option: this.game.gamebox.querySelector( `[src="./options/river.png"]` )
      } )
      this.source = true
      this.build( `pond-0010.png`, [[],[`land`],[]] )
    }
    else {
      let sidesToSiblings = [0,0,0,0]
      let tiles = this.game.tiles
      let ends = 0
      let {x, y} = this
      let rivers = {
        left: tiles[y] ? tiles[y][x - 1] : undefined,
        right: tiles[y] ? tiles[y][x + 1] : undefined,
        up: tiles[y - 1] ? tiles[y - 1][x] : undefined,
        bottom: tiles[y + 1] ? tiles[y + 1][x] : undefined
      }
      rivers = {
        left: rivers.left ? rivers.left.images[2] || {} : {},
        right: rivers.right ? rivers.right.images[2] || {} : {},
        up: rivers.up ? rivers.up.images[2] || {} : {},
        bottom: rivers.bottom ? rivers.bottom.images[2] || {} : {}
      }

      for (let side in rivers)
        if (!(rivers[side] instanceof Water))
          rivers[side] = {}
        else if (rivers[side].end)
          ends++

      if (ends !== 1)
        return

      if (rivers.left.end) {
        if (rivers.left.stage !== `pond`)
          rivers.left.end = false

        rivers.left.node.src = `${rivers.left.node.src.slice( 0, -7 )}1${rivers.left.node.src.slice( -6 )}`
        sidesToSiblings[0] = 1
      }
      else if (rivers.right.end) {
        if (rivers.right.stage !== `pond`)
          rivers.right.end = false

        rivers.right.node.src = `${rivers.right.node.src.slice( 0, -8 )}1${rivers.right.node.src.slice( -7 )}`
        sidesToSiblings[1] = 1
      }
      else if (rivers.up.end) {
        if (rivers.up.stage !== `pond`)
          rivers.up.end = false

        rivers.up.node.src = `${rivers.up.node.src.slice( 0, -5 )}1${rivers.up.node.src.slice( -4 )}`
        sidesToSiblings[2] = 1
      }
      else if (rivers.bottom.end) {
        if (rivers.bottom.stage !== `pond`)
          rivers.bottom.end = false

        rivers.bottom.node.src = `${rivers.bottom.node.src.slice( 0, -6 )}1${rivers.bottom.node.src.slice( -5 )}`
        sidesToSiblings[3] = 1
      }

      this.build( `river-${sidesToSiblings.join( `` )}.png`, [[],[`land`],[]] )
    }
  }
  evolve() {
    this.game.showTile( {
      count: 1,
      state: true,
      option: this.game.gamebox.querySelector( `[src="./options/river.png"]` )
    } )
  }
}
class MagicFlower extends EvolutionGameEntity {
  constructor( x, y, game ) {
    super( x, y, game, `magic flower` )
    this.count = 1
    this.scope = 2
    let tile = this.game.tiles[y][x].images[2] || {}

    if (game.activeTile.stage === `magic flower`) {
      if (tile.stage === `essence`) {
        tile.stage = `live plague`
        tile.src = `plague-life.png`
        this.game.awailableTiles[`magic flower`]--
      }
      else if (tile.constructor === Object)
        new Land( x, y, game )
    }
    else
      this.build( `flower.png`, [[],[`land`],[]], x, y - .1 )
  }
  onclick() {
    let option = this.game.gamebox.querySelector( `[src="./options/flower.png"]` )
    this.game.showTile( {
      count: +option.parentElement.dataset.count + this.count,
      hidden: false,
      state: true,
      option
    } )
    this.delete()
  }
}
class Plague extends EvolutionGameEntity {
  constructor( x, y, game, stage=`essence` ) {
    super( x, y, game, stage )
    this.scope = 2
    let canBeBuildedOn = [`land`,`cactuland 0`,`cactuland 1`,`cactuland 2`,`cactuland 3`,`cactuland plague 0`]

    let src = null
    if (stage === `essence`)
      src = `plague.png`
    if (stage === `live plague`) {
      src = `plague-life.png`
      canBeBuildedOn.push( undefined )
    }

    this.build( src, [[],canBeBuildedOn,[]])
  }
  evolve() {
    switch (this.stage) {
      case `essence`: {
        this.src = `plague-old.png`
        this.stage = `old plague`
      } break
      case `live plague`: {
        let tiles = this.game.tiles
        let {x, y} = this
        let entities = [
          tiles[y] ? tiles[y][x - 1] : undefined,
          tiles[y] ? tiles[y][x + 1] : undefined,
          tiles[y - 1] ? tiles[y - 1][x] : undefined,
          tiles[y + 1] ? tiles[y + 1][x] : undefined,
          tiles[y] ? tiles[y][x] : undefined,
        ]
        entities = [
          entities[0] ? entities[0].images[0] || {} : {},
          entities[0] ? entities[0].images[2] || {} : {},
          entities[1] ? entities[1].images[0] || {} : {},
          entities[1] ? entities[1].images[2] || {} : {},

          entities[2] ? entities[2].images[0] || {} : {},
          entities[2] ? entities[2].images[2] || {} : {},
          entities[3] ? entities[3].images[0] || {} : {},
          entities[3] ? entities[3].images[2] || {} : {},

          entities[4] ? entities[4].images[2] || {} : {}
        ]

        if (!entities[8].stage)
          return

        for (let entity of entities)
          if (entity.stage) {
            if ([`cactus`, `bloomed`, `growed`].includes( entity.stage )) {
              entity.src = `cactus-infected.png`
              entity.stage = `infected`
            }
            else if (entity.stage === `animal`) {
              entity.src = `animal-zebra.png`
              entity.stage = `zebra`

              // let option = this.game.gamebox.querySelector( `[src="./options/animal.png"]` )
              // this.game.showTile( {
              //   count: +option.parentElement.dataset.count + 1,
              //   state: true,
              //   option
              // } )
            }
            else if (entity.stage === `pond`) {
              entity.src = `pond-infected-${entity.node.src.slice( -8 )}`
              entity.stage = `infected pond`
            }
          }

        if (!entities[0].stage && !entities[1].stage)
          new Plague( this.x - 1, this.y, this.game, `live plague` )
        if (!entities[2].stage && !entities[3].stage)
          new Plague( this.x + 1, this.y, this.game, `live plague` )
        if (!entities[4].stage && !entities[5].stage)
          new Plague( this.x, this.y - 1, this.game, `live plague` )
        if (!entities[6].stage && !entities[7].stage)
          new Plague( this.x, this.y + 1, this.game, `live plague` )

        this.delete()
      }
    }
  }
  onclick() {
    console.log( this.game.awailableTiles[`animal`] )
    if (this.stage === `essence`) {
      let option = this.game.gamebox.querySelector( `[src="./options/plague.png"]` )
      this.game.showTile( {
        count: +option.parentElement.dataset.count + 1,
        hidden: false,
        state: true,
        option
      } )
      this.delete()
    }
  }
}


class EvolutionGame {
  /**
   * 
   * @param {Number} size Game size in pixels
   * @param {Number} tilesInOneRow Tiles in one row
   * @param {HTMLElement} initialGamebox Element with configratuon
   */
  constructor( initialGamebox ) {
    // Gamebox
    let gamebox = this.gamebox = document.createElement( `article` )
    this.gamebox.className = `evolution_game`

    // Water effects box
    this.waterEffectsBox = document.createElement( `section` )
    this.waterEffectsBox.className = `evolution_game-waterEffects`

    // Images layers
    this.layers = []
    this.layers[0] = document.createElement( `section` )
    this.layers[0].className = `evolution_game-entities_scope-0`

    this.layers[1] = document.createElement( `section` )
    this.layers[1].className = `evolution_game-entities_scope-1`

    this.layers[2] = document.createElement( `section` )
    this.layers[2].className = `evolution_game-entities_scope-2`

    // Menu
    this.menu = document.createElement( `section` )
    this.menu.className = `evolution_game-menu`

    // Options
    this.options = document.createElement( `section` )
    this.options.className = `evolution_game-options`

    // Endscreen
    this.endscreen = document.createElement( `section` )
    let endScreenTitle = document.createElement( `h3` )
    let endScreenSubtitle = document.createElement( `h4` )
    let endScreenParagraph = document.createElement( `p` )
    let endScreenButton = document.createElement( `button` )
    let endScreenButtonImg = new Image
    this.endscreenElements = {
      set title( content ) { endScreenTitle.textContent = content },
      set subtitle( content ) { endScreenSubtitle.textContent = content },
      set paragraph( content ) { endScreenParagraph.textContent = content }
    }
    endScreenTitle.className = `evolution_game-endscreen-title`
    endScreenSubtitle.className = `evolution_game-endscreen-subtitle`
    endScreenParagraph.className = `evolution_game-endscreen-paragraph`
    endScreenButton.className = `sign`
    endScreenButtonImg.className = `sign-image`
    endScreenButtonImg.src = `./img/circleArrow.png`
    endScreenButton.onclick = () => this.restart()
    endScreenButton.appendChild( endScreenButtonImg )
    this.endscreen.className = `evolution_game-endscreen is-hidden`
    this.endscreen.appendChild( endScreenTitle )
    this.endscreen.appendChild( endScreenSubtitle )
    this.endscreen.appendChild( endScreenParagraph )
    this.endscreen.appendChild( endScreenButton )

    // Canvas
    this.canvas = document.createElement( `canvas` )
    this.canvas.className = `evolution_game-endscreen-canvas`
    this.ctx = this.canvas.getContext( `2d` )

    // HTML creating
    this.gamebox.appendChild( this.waterEffectsBox )
    this.gamebox.appendChild( this.layers[0] )
    this.gamebox.appendChild( this.layers[1] )
    this.gamebox.appendChild( this.layers[2] )
    this.gamebox.appendChild( this.canvas )
    this.gamebox.appendChild( this.menu )
    this.gamebox.appendChild( this.options )
    this.gamebox.appendChild( this.endscreen )

    // Data
    this.initialData = eval( `(${initialGamebox.textContent.match(/.*?({.*)/s)[1]})` )
    let tilesInOneRow = this.tilesInOneRow = this.initialData.tilesInOneRow
    let size = this.size = this.initialData.size
    
    gamebox.style.width = gamebox.style.height = `${size}px`
    if (size > window.screen.width) {
      let delimiter = size / window.screen.width
      size /= delimiter
      tilesInOneRow = Math.ceil( tilesInOneRow / delimiter )
      gamebox.style.width = gamebox.style.height = `${size}px`

      if (size < 700) {
        document.body.classList.add( `is-small` )
        gamebox.style.height = `${size + 210}px`
      }
    }

    this.canvas.width = this.canvas.height = size
    this.ctx.strokeStyle = `rgba( 0, 0, 0, .3 )`
    this.ctx.lineWidth = 2
    this.startTime = 0
    this.currentStage = 0
    this.godmode = false
    this.typedCharsChain = ``
    this.state = `init`
    this.lastImageId = 0
    this.tileSize = size / tilesInOneRow
    this.upgradeChain = []
    this.tiles = []
    this.awailableTiles = {}
    this.activeTile = {
      node: null,
      name: null,
      class: null,
      stage: null
    }
    this.center = {
      x: Math.floor( tilesInOneRow / 2 ),
      y: Math.floor( tilesInOneRow / 2 )
    }
    this.mouse = {
      x: null,
      y: null,
      xPx: null,
      yPx: null,
      aboveCanvas: null
    }

    // Configurating
    let button = document.createElement( `button` )
        button.className = `sign evolution_game-restart`
        button.onclick = () => this.restart()
    let img = new Image
        img.src = `./img/circleArrow.png`
        img.alt = `Restart`
        img.classList = `sign-image`
    button.appendChild( img )
    this.menu.appendChild( button )

    button = document.createElement( `button` )
    button.className = `sign evolution_game-next_stage`
    button.onclick = () => this.nextStage()
    img = new Image
    img.src = `./img/arrow.png`
    img.alt = `Nest stage`
    img.classList = `sign-image`
    button.appendChild( img )
    this.menu.appendChild( button )

    this.optionsInit()

    gamebox.addEventListener( `mousemove`, e => {
      let {x, y} = this.canvas.getBoundingClientRect()
      let m = this.mouse
    
      m.xPx = x = e.clientX - x
      m.yPx = y = e.clientY - y
      m.aboveCanvas = (x > 0 && y > 0 && x < size && y < size)
    
      if (m.aboveCanvas) {
        m.x = Math.floor( x / this.tileSize )
        m.y = Math.floor( y / this.tileSize )
      }
      else
        m.x = m.y = null
    } )
    document.addEventListener( `keydown`, e => {
      this.typedCharsChain = `${this.typedCharsChain}${e.key}`
      let godModeCode = `/kill zeber`

      if (this.typedCharsChain.slice( -godModeCode.length ) === godModeCode) {
        this.godmode = true
        let options = this.options.querySelectorAll( `.evolution_game-option` )
        for (let option of options) {
          option.classList.remove( `is-disabled` )
          option.classList.remove( `is-hidden` )
          option.dataset.count = 99
        }
        let tiles = this.awailableTiles
        for (let name in tiles)
          tiles[name] = 99
      }
    } )
    gamebox.addEventListener( `click`, e => {
      if (this.startTime === 0)
        this.startTime = Date.now()

      if (this.mouse.aboveCanvas) {
        let img = new Image
        img.src = `./ingame_graphics/land_placing.gif?id=${this.lastImageId++}`
        img.style.left = `${this.mouse.x * this.tileSize - this.tileSize / 2}px`
        img.style.top = `${this.mouse.y * this.tileSize - this.tileSize / 2}px`
        img.style.width = `${this.tileSize * 2}px`
        
        setTimeout( () => img.remove(), 650 )
      
        this.waterEffectsBox.appendChild( img )
      }
    
      if (this.state !== `normal`)
        return

      let activeTile = this.activeTile
      let x = this.mouse.x
      let y = this.mouse.y

      if (e.path[0] !== this.canvas)
        return
      else if (!EvolutionGame.classes.has( activeTile.class ) || !this.awailableTiles[activeTile.stage]) {
        for (let onclick of this.tiles[y][x].onclicks)
          if (onclick)
            onclick()
      }
      else
        new (EvolutionGame.classes.get( activeTile.class ))( x, y, this, activeTile.stage )
      if (!activeTile.node)
        return

      let actualTileCount = this.awailableTiles[activeTile.stage]

      if (actualTileCount < 0)
        actualTileCount = this.awailableTiles[activeTile.stage] = 0

      activeTile.node.dataset.count = actualTileCount
      if (actualTileCount == 0) {
        activeTile.node.classList.add( `is-disabled` )
        activeTile.node.classList.remove( `is-active` )
        activeTile = {}
      }
    } )

    for (let i0 = 0;  i0 < tilesInOneRow;  i0++) {
      this.tiles[i0] = new Array( tilesInOneRow )

      for (let i1 = 0;  i1 < tilesInOneRow;  i1++)
        this.tiles[i0][i1] = {
          images: Array( 3 ),
          onclicks: Array( 3 )
        }
    }

    initialGamebox.insertAdjacentElement( `beforeBegin`, gamebox )
    initialGamebox.remove()
    this.state = `normal`
    this.draw()
  }
  optionsInit() {
    let elements = this.options.children
    for (let i0 = elements.length;  i0 > 0;  i0--)
      elements[0].remove()

    let options = this.initialData.options
    for (let option of options) {
      let button = document.createElement( `button` )
          button.className = `sign evolution_game-option`
          button.onclick = () => this.chooseTile( button )
      let img = new Image
          img.src = option.src
          img.alt = `${option.name} | ${option.class} | ${option.stage}`
          img.classList = `sign-image`
      let text = document.createElement( `span` )
          text.className = `sign-content`
          text.textContent = option.name

      button.appendChild( img )
      button.appendChild( text )
      
      if (!option.startCount) {
        button.classList.add( `is-hidden` )
        button.classList.add( `is-disabled` )
        button.classList.remove( `is-active` )
      }

      this.awailableTiles[option.stage] = button.dataset.count = option.startCount || 0

      this.options.appendChild( button )
    }
  }
  restart() {
    this.state = `restarting`
    for (let row of this.tiles)
      for (let tile of row) {
        for (let entity of tile.images)
          if (entity)
            entity.delete()
        for (let i0 = 0;  i0 < tile.onclicks.length;  i0++)
          if (tile.onclicks[i0])
            delete tile.onclicks[i0]
      }

    this.menu.classList.remove( `is-hidden` )
    this.canvas.classList.remove( `is-hidden` )
    this.options.classList.remove( `is-hidden` )
    this.layers[0].classList.remove( `is-hidden` )
    this.layers[1].classList.remove( `is-hidden` )
    this.layers[2].classList.remove( `is-hidden` )
    this.endscreen.classList.add( `is-hidden` )

    this.godmode = false
    this.state = `normal`
    this.optionsInit()
  }
  nextStage() {
    this.state = `evolutioning`
    this.currentStage++

    if (this.activeTile.node) {
      this.activeTile.node.classList.remove( `is-active` )
      this.activeTile = {
        node: null,
        name: null,
        class: null,
        stage: null
      }
    }

    this.endTester()

    this.upgradeChain.forEach( item => item.evolve() )
    this.state = `normal`
  }
  chooseTile( node ) {
    if (this.activeTile.node) {
      this.activeTile.node.classList.remove( `is-active` )
      if (this.activeTile.node === node) {
        this.activeTile = {
          node: null,
          name: null,
          class: null,
          stage: null
        }
        return
      }
    }

    node.classList.add( `is-active` )

    let [name, clas, stage=name] = node
      .querySelector( `img` ).alt
      .split( `|` )
      .map( item => item.trim() )

    this.activeTile = { node, name, class:clas, stage }
  }
  showTile( config ) {
    let name, clas, stage
    let option = config.option //|| this.activeTile.node

    if (config.option) {
      [name, clas, stage=name] = config.option.alt
        .split( `|` )
        .map( item => item.trim() )
    }

    option = option.parentElement
  
    if (Number.isInteger( config.count ) && !this.godmode) {
      this.awailableTiles[stage] = config.count
      option.dataset.count = config.count
    }
    if (`state` in config && !this.godmode) {
      if (!config.state || config.count === 0)
        option.classList.add( `is-disabled` )
      else
        option.classList.remove( `is-disabled` )
    }
    if (`hidden` in config && !this.godmode) {
      if (config.hidden)
        option.classList.add( `is-hidden` )
      else
        option.classList.remove( `is-hidden` )
    }
  }
  draw() {
    let ctx = this.ctx
    let {x, y} = this.mouse
    let w = 1
    let h = 1

    ctx.clearRect( 0, 0, this.size, this.size )

    if (this.mouse.aboveCanvas) {
      ctx.beginPath()

      if (Number.isInteger( x ) && Number.isInteger( y )) {
        let size = this.tileSize
        for (let i0 = 0;  i0 <= w;  i0++) {
          ctx.moveTo( x * size - size/2, (y + i0) * size )
          ctx.lineTo( (x + w) * size + size/2, (y + i0) * size )
        }
        for (let i0 = 0;  i0 <= h;  i0++) {
          ctx.moveTo( (x + i0) * size, y * size - size/2 )
          ctx.lineTo( (x + i0) * size, (y + w) * size + size/2 )
        }
    
      }
      // else for (let i0 = 0;  i0 < data.tilesInOneRow;  i0++) {
      //   let pos = i0 * canvas.width / data.tilesInOneRow
      
      //   ctx.moveTo( pos, 0 )
      //   ctx.lineTo( pos, canvas.height )
      
      //   ctx.moveTo( 0, pos )
      //   ctx.lineTo( canvas.width, pos )
      // }

      ctx.stroke()
    }
  
    requestAnimationFrame( () => this.draw() )
  }
  endTester() {
    let plague = this.gamebox.querySelector( `[src="./options/plague.png"]` )
    let livePlagues = 0
    let infectedPonds = 0
    let growedCactuses = 0
    let infectedCactuses = 0
    let dowrnedZebras = 0
    let magicLand = 0
    let rivers = 0

    let MagicFlower = EvolutionGame.classes.get( `MagicFlower` )
    let Plague = EvolutionGame.classes.get( `Plague` )
    let Cactus = EvolutionGame.classes.get( `Cactus` )
    let Water = EvolutionGame.classes.get( `Water` )

    let end = this.endscreenElements
    end.title = `Gra zakończona`

    for (let entity of this.upgradeChain) {
      if (!entity)
        continue
      if (entity instanceof Plague && entity.stage === `live plague`)
        livePlagues++
      if (entity instanceof Water) {
        if (entity.stage === `infected pond`)
          infectedPonds++
        if (entity.stage === `river`)
          rivers++
      }
      if (entity instanceof MagicFlower && entity.count >= 16)
        magicLand++
      else if (entity instanceof Cactus) {
        if (entity.stage === `growed`)
          growedCactuses++
        else if (entity.stage === `infected`)
          infectedCactuses++
      }
      else if (entity.stage === `drowned zebra`)
        dowrnedZebras++
    }

    if (plague.parentElement.dataset.count > 0 && !this.godmode)
      this.state = `win: infected`
    else if (livePlagues > 100 && infectedCactuses >= 3 && growedCactuses == 0 && infectedPonds != 0 && !this.godmode)
      this.state = `win: plague`
    else if (growedCactuses > 15 && rivers > 20 && infectedCactuses == 0 && livePlagues == 0 && !this.godmode)
      this.state = `win: cactuland`
    else if (dowrnedZebras == 1 && !this.godmode)
      this.state = `win: drowned zebra`
    else if (magicLand > 0 && !this.godmode)
      this.state = `win: magic land`
    else if (dowrnedZebras > 10)
      this.state = `win: drowned zebras`

    switch (this.state) {
      case `win: infected`: {
        end.subtitle = `Zakończenie 1/6, jego nazwa to: Śmiertelnie zarażony`
        end.paragraph = `Umarłeś. Dlaczego przechowujesz zarazki? ;/`
        this.showEndScreen()
      } break
      case `win: plague`: {
        end.subtitle = `Zakończenie 2/6, jego nazwa to: Plaga`
        end.paragraph = `Projekt chyba wymknął się spod kontroli xd`
        this.showEndScreen()
      } break
      case `win: cactuland`: {
        end.subtitle = `Zakończenie 3/6, jego nazwa to: Kaktulandia`
        end.paragraph = `Kraina wodą w śród kaktusó płynąca`
        this.showEndScreen()
      } break
      case `win: magic land`: {
        end.subtitle = `Zakończenie 4/6, jego nazwa to: Magiczna wyspa`
        end.paragraph = `To na pewno odpady z Czarnobyla`
        this.showEndScreen()
      } break
      case `win: drowned zebra`: {
        end.subtitle = `Zakończenie 5/6, jego nazwa to: Utopiona zebra`
        end.paragraph = `
          Zabiłeś zebrę! Ale mam na to lepszy sposób.
          Podczas gry spróbuj wpisać "/kill zeber" ;]
        `
        this.showEndScreen()
      } break
      case `win: drowned zebras`: {
        end.subtitle = `Zakończenie 6/6, jego nazwa to: Monochromatyczne topielce`
        end.paragraph = `Trzeba być bogiem aby wymyślić tak genialną zagładę`
        this.showEndScreen()
      } break
    }
  }
  showEndScreen() {
    this.menu.classList.add( `is-hidden` )
    this.canvas.classList.add( `is-hidden` )
    this.options.classList.add( `is-hidden` )
    this.layers[0].classList.add( `is-hidden` )
    this.layers[1].classList.add( `is-hidden` )
    this.layers[2].classList.add( `is-hidden` )
    this.endscreen.classList.remove( `is-hidden` )
  }
  static setClasses( classes ) {
    for (let clss of classes)
      if (!this.classes.has( clss.name ))
        this.classes.set( clss.name, clss )
  }
}
EvolutionGame.classes = new Map


function start() {
  let nav = document.getElementById( `nav` )
  nav.classList.add( `is-hidden` )

  let classes = [Cactus, Land, Animal, Water, MagicFlower, Plague]
  let gameClasses = EvolutionGame.classes

  for (let clas of classes)
    if (!gameClasses.has( clas.name ))
      gameClasses.set( clas.name, clas )

  const gameBoxes = document.querySelectorAll( `[data-evolution_game]` )
  for (let gamebox of gameBoxes)
    new EvolutionGame( gamebox )
}



