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

export default [Cactus, Land, Animal, Water, MagicFlower, Plague]