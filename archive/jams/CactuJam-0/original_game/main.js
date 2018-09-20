const gamebox = document.querySelector( `.evolution_game` )
const animationsBox = gamebox.querySelector( `.animations` )
const entitiesBox = {
  a: gamebox.querySelector( `.entities-a` ),
  lands: gamebox.querySelector( `.lands` ),
  b: gamebox.querySelector( `.entities-b` )
}
/** @type {HTMLCanvasElement} */
const canvas = gamebox.querySelector( `canvas` )
const buttons = gamebox.querySelectorAll( `.button` )
const options = gamebox.querySelectorAll( `.option .button` )

const ctx = canvas.getContext( `2d` )
const data = {
  gameSize: 700,
  tilesInOneRow: 15,

  god: false,
  keys: ``,
  state: 1,
  images: 0,
  tileSize: 0,
  started: false,
  upgradeChain: [],
  placedLands: [],
  onclicks: [],
  entities: [],
  activeTile: {
    name: null,
    option: null
  },
  center: {
    x: 0,
    y: 0
  },
  mouse: {
    x: 0,
    y: 0,
    tileX: null,
    tileY: null
  }
}
const functions = {
  options( option, state ) {
    options.forEach( opt => { if (opt !== option) opt.classList.remove( `active` ) } )

    if (state === `activation`) {
      data.activeTile.option = option
      data.activeTile.name = option.alt
    }
    else 
      data.activeTile = {}
  },
  refresh() {
    if (!data.god)
      location.reload()
    else {
      data.state = `hackerman`
      end()
    }
  },
  nextStage( button ) {
    if (!data.started) {
      alert( `Musisz coś postawić aby rozpocząć grę!` )
      return
    }
    data.state = 0

    data.upgradeChain.forEach( element => {
      element.evolve()
    } )

    // let option = gamebox.querySelector( `[src="./options/land.png"]` )
    // optionsAvaiable( {
    //   count: +option.parentElement.dataset.count + 1,
    //   state: true,
    //   option
    // } )

    if (data.keys.slice( -11 ) === `/kill zeber`)
      data.god = true

    if (data.god) {
      options.forEach( option => {
        option.classList.remove( `disabled` )
        option.parentElement.classList.remove( `hidden` )
        option.parentElement.dataset.count = 99
      } )
    }
    else {
      let plague = gamebox.querySelector( `[src="./options/plague.png"]` )
      let livePlagues = 0
      let growedCactuses = 0
      let infectedCactuses = 0
      let infectedPonds = 0
      let win = false
      for (let entity of data.upgradeChain) {
        if (!entity)
          continue
        if (entity instanceof LivingEntity.types.Plague)
          livePlagues++
        if (entity instanceof LivingEntity.types.River && entity.stage === `infected pond`)
          infectedPonds++
        else if (entity instanceof LivingEntity.types.Cactus) {
          if (entity.stage === `growed`)
            growedCactuses++
          else if (entity.stage === `infected`)
            infectedCactuses++
        }
        else if (entity.stage === `drowned zebra`)
          win = true
      }

      if (plague.parentElement.dataset.count > 0)
        data.state = `infected`
      else if (livePlagues > 50 && infectedCactuses >= 3 && growedCactuses == 0 && infectedPonds != 0)
        data.state = `plague`
      else if (growedCactuses > 50 && infectedCactuses == 0 && livePlagues == 0)
        data.state = `cactupolis`
      else if (win)
        data.state = `win`
    }
    end()    

    button.classList.remove( `active` )
    data.state = 1
  }
}
class LivingEntity {
  constructor( x, y, stage, family ) {
    this.x = x
    this.y = y
    this.stage = stage
    this.family = family
    this.upgradeChainPos = data.upgradeChain.length
    data.upgradeChain.push( this )
  }
  delete() {
    this.node.remove()
    delete data.upgradeChain[this.upgradeChainPos]
    if (this.family === `entity`)
      delete data.entities[this.y][this.x]
    else
      delete data.placedLands[this.y][this.x]

    delete data.onclicks[this.y][this.x]
  }
  evolve() {}
  set src( src ) {
    this.node.src = `./ingame_graphics/${src}`
  }
}
LivingEntity.types = {
  Cactus: class Cactus extends LivingEntity {
    constructor( x, y, stage=`cactus` ) {
      super( x, y, stage, `entity` )
      this.clicksCounter = 0
      this.linkedLands = []

      let src = null
      if (stage === `cactus`)
        src = `cactus.png`
      if (stage === `part-left`)
        src = `cactus-left.png`
      if (stage === `part-right`)
        src = `cactus-right.png`
      if (stage === `part-top`)
        src = `cactus-top.png`
      if (stage === `part-down`)
        src = `cactus-down.png`

      if (data.placedLands[y][x]) {
        this.node = placeImg( src, x, y - .3, `b` )
        this.scope = `b`
      }
      else {
        this.node = placeImg( src, x, y, `a` )
        this.scope = `a`
      }

      data.onclicks[y][x] = () => this.onclick()
      data.entities[y][x] = this
    }
    evolve() {
      if (data.placedLands[this.y][this.x] && this.scope === `a`)
        return

      switch (this.stage) {
        case `cactus`: {
          let pLands = data.placedLands
          let lands = {
            left: pLands[this.y] ? pLands[this.y][this.x - 1] : undefined,
            right: pLands[this.y] ? pLands[this.y][this.x + 1] : undefined,
            up: pLands[this.y - 1] ? pLands[this.y - 1][this.x] : undefined,
            bottom: pLands[this.y + 1] ? pLands[this.y + 1][this.x] : undefined,
            me: pLands[this.y][this.x]
          }

          if (lands.left) {
            this.linkedLands = [lands.left]
            this.src = `cactus-bloomed-1000.png`
          }
          else if (lands.right) {
            this.linkedLands = [lands.right]
            this.src = `cactus-bloomed-0100.png`
          }
          else if (lands.up) {
            this.linkedLands = [lands.up]
            this.src = `cactus-bloomed-0010.png`
          }
          else if (lands.bottom) {
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
        case `part-left`:
        case `part-right`:
        case `part-top`:
        case `part-down`: {
          this.src = `cactus-baby.png`
          this.stage = `baby`
        } break
        case `bloomed`: {
          this.stage = `growed`
          this.src = `cactus-big.png`
          this.linkedLands.forEach( land => {
            let {x, y} = land

            if (!data.placedLands[y][x])
              return
            else if (data.entities[y][x]) {
              if (data.entities[y][x].stage === `flower`) {
                data.entities[y][x].count++
              }
              return
            }

            new LivingEntity.types.Flower( x, y )
          } )
        }
      }
    }
    onclick() {
      if (this.stage !== `cactus`)
        return
        
      let {placedLands} = data
      let m = data.mouse
      let lands = {
        left: placedLands[m.tileY] ? placedLands[m.tileY][m.tileX - 1] : undefined,
        right: placedLands[m.tileY] ? placedLands[m.tileY][m.tileX + 1] : undefined,
        up: placedLands[m.tileY - 1] ? placedLands[m.tileY - 1][m.tileX] : undefined,
        bottom: placedLands[m.tileY + 1] ? placedLands[m.tileY + 1][m.tileX] : undefined,
        me: placedLands[m.tileY][m.tileX]
      }
      if (m.tileX === this.x && m.tileY === this.y && !lands.me && !lands.left && !lands.right && !lands.up && !lands.bottom) {
        this.clicksCounter++

        if (this.clicksCounter >= 10) {
          new LivingEntity.types.Cactus( this.x - 1, this.y, `part-left` )
          new LivingEntity.types.Cactus( this.x + 1, this.y, `part-right` )
          new LivingEntity.types.Cactus( this.x, this.y - 1, `part-top` )
          new LivingEntity.types.Cactus( this.x, this.y + 1, `part-down` )
          this.delete()
        }
      }
    }
  },
  Land: class Land extends LivingEntity {
    constructor( x, y, stage=`land` ) {
      super( x, y, stage, `land` )
      let {placedLands} = data

      if (stage === `land`) {
        let m = data.mouse
        let landConfig = [0,0,0]
        let lands = {
          left: placedLands[m.tileY] ? placedLands[m.tileY][m.tileX - 1] : undefined,
          right: placedLands[m.tileY] ? placedLands[m.tileY][m.tileX + 1] : undefined,
          up: placedLands[m.tileY - 1] ? placedLands[m.tileY - 1][m.tileX] : undefined,
          bottom: placedLands[m.tileY + 1] ? placedLands[m.tileY + 1][m.tileX] : undefined
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
        if (lands.bottom) {
          landConfig[2] = 1
        }
  
        this.node = placeImg( `land-${landConfig.join( `` )}.png`, 0, 0, `lands`, true )
      }

      placedLands[y][x] = this
    }
    evolve() {
      switch (this.stage) {
        case `land`: {
          let underLand = data.entities[this.y][this.x]
          if (underLand instanceof LivingEntity.types.Cactus && underLand.scope === `a` && underLand.stage === `cactus` && this.node.src.slice( -12 ) === `land-000.png` ) {
            underLand.delete()
            this.src = `land-cactus-0.png`
            this.stage = `cactuland 0`
          }
        } break
        case `cactuland 0`: {
          this.src = `land-cactus-1.png`
          this.stage = `cactuland 1`
        } break
        case `cactuland 1`: {
          this.src = `land-cactus-2.png`
          this.stage = `cactuland 2`
        } break
        case `cactuland 2`: {
          if (data.entities[this.y][this.x]) {
            if (data.entities[this.y][this.x].stage === `animal`) {
              data.entities[this.y][this.x].delete()

              let option = gamebox.querySelector( `[src="./options/animal.png"]` )
              optionsAvaiable( {
                count: +option.parentElement.dataset.count + 1,
                state: true,
                option
              } )

              this.src = `land-cactus-plague-0.png`
              this.stage = `cactuland plague 0`
              new LivingEntity.types.Plague( this.x, this.y )
            }
          }
          else {
            this.src = `land-cactus-3.png`
            this.stage = `cactuland 3`
          }
        } break
      }
    }
  },
  Animal: class Animal extends LivingEntity {
    constructor( x, y, stage=`animal` ) {
      super( x, y, `animal`, `entity` )

      if (!data.placedLands[y][x] || data.entities[y][x])
        return
      else if (data.placedLands[y][x].stage === `cactuland 3`)
        return

      if (stage === `zebra`)
        this.node = placeImg( `animal-zebra.png`, x, y - .4, `b` )
      else
        this.node = placeImg( `animal.png`, x, y - .4, `b` )

      data.onclicks[y][x] = () => this.onclick()
      data.entities[y][x] = this
    }
    onclick() {
      if (this.stage !== `zebra`)
        return

      let option = gamebox.querySelector( `[src="./options/zebra.png"]` )
      optionsAvaiable( {
        count: +option.parentElement.dataset.count + 1,
        hidden: false,
        state: true,
        option
      } )
      this.delete()
    }
  },
  River: class River extends LivingEntity {
    constructor( x, y, stage=`river` ) {
      super( x, y, stage, `entity` )

      if (!data.placedLands[y][x] || data.entities[y][x])
        return

      if (stage === `pond`) {
        optionsAvaiable( {
          hidden: true,
          state: false,
          option: gamebox.querySelector( `[src="./options/pond.png"]` )
        } )
        optionsAvaiable( {
          hidden: false,
          option: gamebox.querySelector( `[src="./options/river.png"]` )
        } )
        this.source = true
        this.node = placeImg( `pond-0010.png`, x, y, `b` )
      }
      else {
        let {entities} = data
        let sidesToSiblings = [0,0,0,0]
        let rivers = {
          left: entities[y] ? entities[y][x - 1] : undefined,
          right: entities[y] ? entities[y][x + 1] : undefined,
          up: entities[y - 1] ? entities[y - 1][x] : undefined,
          bottom: entities[y + 1] ? entities[y + 1][x] : undefined
        }

        for (let side in rivers)
          if (!(rivers[side] instanceof LivingEntity.types.River))
            rivers[side] = undefined

        if (rivers.left) {
          rivers.left.node.src = `${rivers.left.node.src.slice( 0, -7 )}1${rivers.left.node.src.slice( -6 )}`
          rivers.left.end = false
          sidesToSiblings[0] = 1
        }
        else if (rivers.right) {
          rivers.right.node.src = `${rivers.right.node.src.slice( 0, -8 )}1${rivers.right.node.src.slice( -7 )}`
          rivers.right.end = false
          sidesToSiblings[1] = 1
        }
        else if (rivers.up) {
          rivers.up.node.src = `${rivers.up.node.src.slice( 0, -5 )}1${rivers.up.node.src.slice( -4 )}`
          rivers.up.end = false
          sidesToSiblings[2] = 1
        }
        else if (rivers.bottom) {
          rivers.bottom.node.src = `${rivers.bottom.node.src.slice( 0, -6 )}1${rivers.bottom.node.src.slice( -5 )}`
          rivers.bottom.end = false
          sidesToSiblings[3] = 1
        }

        this.end = true
        this.node = placeImg( `river-${sidesToSiblings.join( `` )}.png`, x, y, `b` )
      }

      data.entities[y][x] = this
    }
    evolve() {
      optionsAvaiable( {
        count: 1,
        state: true,
        option: gamebox.querySelector( `[src="./options/river.png"]` )
      } )
    }
  },
  Flower: class Flower extends LivingEntity {
    constructor( x, y ) {
      super( x, y, `flower`, `entity` )

      if (!data.placedLands[y][x])
        return
      else if (data.entities[y][x]) {
        if (data.entities[y][x].stage === `flower`) {
          data.entities[y][x].count++
        }
        return
      }
  
      this.count = 1
      this.node = placeImg( `flower.png`, x, y, `b` )

      data.onclicks[y][x] = () => this.onclick()
      data.entities[y][x] = this
    }
    onclick() {
      let option = gamebox.querySelector( `[src="./options/flower.png"]` )
      optionsAvaiable( {
        count: +option.parentElement.dataset.count + this.count,
        hidden: false,
        state: true,
        option
      } )
      this.delete()
    }
  },
  Plague: class Plague extends LivingEntity {
    constructor( x, y, stage=`essence` ) {
      super( x, y, stage, `entity` )

      if (!data.entities[y])
        return
      if (data.entities[y][x])
        return

      let src = null
      if (stage === `essence`)
        src = `plague.png`
      if (stage === `live plague`)
        src = `plague-life.png`

      this.node = placeImg( src, x, y, `b` )

      data.onclicks[y][x] = () => this.onclick()
      data.entities[y][x] = this
    }
    evolve() {
      switch (this.stage) {
        case `essence`: {
          this.src = `plague-old.png`
          this.stage = `old plague`
        } break
        case `live plague`: {
          let e = data.entities
          let entities = {
            left: e[this.y] ? e[this.y][this.x - 1] : undefined,
            right: e[this.y] ? e[this.y][this.x + 1] : undefined,
            up: e[this.y - 1] ? e[this.y - 1][this.x] : undefined,
            bottom: e[this.y + 1] ? e[this.y + 1][this.x] : undefined,
            me: e[this.y] ? e[this.y][this.x] : undefined
          }

          if (!entities.me)
            return

          for (let side in entities)
            if (entities[side]) {
              if ([`cactus`, `bloomed`, `growed`].includes( entities[side].stage )) {
                entities[side].src = `cactus-infected.png`
                entities[side].stage = `infected`
              }
              else if (entities[side].stage === `animal`) {
                entities[side].src = `animal-zebra.png`
                entities[side].stage = `zebra`

                let option = gamebox.querySelector( `[src="./options/animal.png"]` )
                optionsAvaiable( {
                  count: +option.parentElement.dataset.count + 1,
                  state: true,
                  option
                } )
              }
              else if (entities[side].stage === `pond`) {
                entities[side].src = `pond-infected-${entities[side].node.src.slice( -8 )}`
                entities[side].stage = `infected pond`
              }
            }

          if (!entities.left)
            new LivingEntity.types.Plague( this.x - 1, this.y, `live plague` )
          if (!entities.right)
            new LivingEntity.types.Plague( this.x + 1, this.y, `live plague` )
          if (!entities.up)
            new LivingEntity.types.Plague( this.x, this.y - 1, `live plague` )
          if (!entities.bottom)
            new LivingEntity.types.Plague( this.x, this.y + 1, `live plague` )
          this.delete()
        }
      }
    }
    onclick() {
      if (this.stage === `essence`) {
        let option = gamebox.querySelector( `[src="./options/plague.png"]` )
        optionsAvaiable( {
          count: +option.parentElement.dataset.count + 1,
          hidden: false,
          state: true,
          option
        } )
        this.delete()
      }
    }
  }
}

init()
function init() {
  let {gameSize, tilesInOneRow, placedLands, center, mouse} = data

  center.x = center.y = Math.floor( tilesInOneRow / 2 )
  data.tileSize = gameSize / tilesInOneRow
  canvas.width = canvas.height = gameSize
  gamebox.style.width = gamebox.style.height = `${gameSize}px`
  
  for (let i0 = 0;  i0 < tilesInOneRow;  i0++) {
    data.placedLands.push( new Array( 20 ) )
    data.entities.push( new Array( 20 ) )
    data.onclicks.push( new Array( 20 ) )
  }
  
  buttons.forEach( button => button.addEventListener( `click`, () => {
    let state = null

    if (button.classList.contains( `disabled` ))
      return
    if (button.classList.contains( `active` )) {
      button.classList.remove( `active` )
      state = `deactivation`
    }
    else {
      button.classList.add( `active` )
      state = `activation`
    }

    functions[button.dataset.function]( button, state )
  } ) )

  draw()
}
function end() {
  console.log( data.state, Number.isInteger( data.state ) )
  if (Number.isInteger( data.state ))
    return

  gamebox.querySelectorAll( `.evolution_game > *` ).forEach( element => element.remove() )
  let div = document.createElement( `div` )
  let h2 = document.createElement( `h2` )
  let h3 = document.createElement( `h3` )
  let p = document.createElement( `p` )
  let button = document.createElement( `div` )
  let end = ``

  switch (data.state) {
    case `hackerman`: {
      end = `Hackerman!`
      p.textContent = `
        Restart gry w trybie goda i zdobywanie osiągnięć. Autor miał ciekawy pomysł
      `
    } break
    case `infected`: {
      end = `Śmiertelnie zarażony`
      p.textContent = `
        Umarłeś. Dlaczego trzymałeś zarazki? ;/
      `
    } break
    case `plague`: {
      end = `Epidemia`
      p.textContent = `
        Projekt chyba wyrwał się spod kontroli xd
      `
    } break
    case `cactupolis`: {
      end = `Cactupolis`
      p.textContent = `
        Nadchodzi era świetności!
      `
    } break
    case `win`: {
      end = `Biedny zeber`
      p.textContent = `
        Zabiłeś zebrę! Tym oto sposobem dostajesz dostęp do trybu boga!<br>
        Podczas nowej gry postaw jakikolwiek przedmiot
        a następnie wpisz "/kill zeber" i przejdź do następnej rundy
      `
    }
  }

  h2.textContent = `Gra skończona`
  h3.textContent = `Osiagnięte zakończenie: ${end}`
  button.className = `button`
  button.onclick = () => location.reload()
  div.appendChild( h2 )
  div.appendChild( h3 )
  div.appendChild( p )
  div.appendChild( button )
  div.className = `endscreen`
  gamebox.appendChild( div )
}
function draw() {
  ctx.clearRect( 0, 0, data.gameSize, data.gameSize )

  if (data.mouse.aboveCanvas)
    drawGrid( data.mouse.tileX, data.mouse.tileY )

  requestAnimationFrame( draw )
}
function drawGrid( x=-1, y=-1, w=1, h=1 ) {
  ctx.strokeStyle = `rgba( 0, 0, 0, .3 )`
  ctx.lineWidth = 2
  ctx.beginPath()

  if (Number.isInteger( x ) && Number.isInteger( y )) {
    let size = data.tileSize
    for (let i0 = 0;  i0 <= w;  i0++) {
      ctx.moveTo( x * size - size/2, (y + i0) * size )
      ctx.lineTo( (x + w) * size + size/2, (y + i0) * size )
    }
    for (let i0 = 0;  i0 <= h;  i0++) {
      ctx.moveTo( (x + i0) * size, y * size - size/2 )
      ctx.lineTo( (x + i0) * size, (y + w) * size + size/2 )
    }

  }
  else for (let i0 = 0;  i0 < data.tilesInOneRow;  i0++) {
    let pos = i0 * canvas.width / data.tilesInOneRow
  
    ctx.moveTo( pos, 0 )
    ctx.lineTo( pos, canvas.height )
  
    ctx.moveTo( 0, pos )
    ctx.lineTo( canvas.width, pos )
  }
  ctx.stroke()
}
function placeImg( src, x, y, scope, additionalPos=false ) {
  let img = new Image
  img.src = `./ingame_graphics/${src}`
  img.style.left = `${(additionalPos ? data.mouse.tileX + x : x) * data.tileSize}px`
  img.style.top = `${(additionalPos ? data.mouse.tileY + y : y) * data.tileSize}px`
  img.width = data.tileSize + 1

  entitiesBox[scope].appendChild( img )

  return img
}
function optionsAvaiable( config ) {
  let option = config.option || data.activeTile.option

  if (`state` in config && !data.god) {
    if (!config.state || config.count === 0)
      option.classList.add( `disabled` )
    else
      option.classList.remove( `disabled` )
  }

  if (Number.isInteger( config.count ) && !data.god)
    option.parentElement.dataset.count = config.count

  if (`hidden` in config && !data.god) {
    if (config.hidden)
      option.parentElement.classList.add( `hidden` )
    else
      option.parentElement.classList.remove( `hidden` )
  }
}

gamebox.addEventListener( `click`, e => {
  let img = new Image
  img.src = `./ingame_graphics/land_placing.gif?id=${++data.images}`
  img.style.left = `${data.mouse.tileX * data.tileSize - data.tileSize / 2}px`
  img.style.top = `${data.mouse.tileY * data.tileSize - data.tileSize / 2}px`
  img.width = data.tileSize * 2
  
  setTimeout( () => img.remove(), 600 )

  animationsBox.appendChild( img )

  if (!data.state)
    return

  let dataset = data.activeTile.option ? data.activeTile.option.parentElement.dataset : undefined
  let x = data.mouse.tileX
  let y = data.mouse.tileY

  if (e.path[0] !== canvas)
    return

  if (typeof data.activeTile.name === `string`)
    data.started = true

  switch (data.activeTile.name) {
    case `land`: {
      if (!!data.placedLands[y][x])
        return

      new LivingEntity.types.Land( x, y )
    } break
    case `pond`: {
      if (!data.placedLands[y][x] || data.entities[y][x])
        return

      new LivingEntity.types.River( x, y, `pond` )
    } break
    case `river`: {
      if (!data.placedLands[y][x] || data.entities[y][x])
        return

      let {entities} = data
      let siblingsCount = 0
      let rivers = {
        left: entities[y] ? entities[y][x - 1] : undefined,
        right: entities[y] ? entities[y][x + 1] : undefined,
        up: entities[y - 1] ? entities[y - 1][x] : undefined,
        bottom: entities[y + 1] ? entities[y + 1][x] : undefined
      }

      for (let side in rivers)
        if (rivers[side] instanceof LivingEntity.types.River)
          if (rivers[side].end || rivers[side].source)
            siblingsCount++

      if (siblingsCount != 1)
        return

      new LivingEntity.types.River( x, y )
    } break
    case `cactus`: {
      if (data.entities[y][x])
        return

      new LivingEntity.types.Cactus( x, y )
    } break
    case `animal`: {
      if (!data.placedLands[y][x] || data.entities[y][x])
        return
      else if (data.placedLands[y][x].stage === `cactuland 3`)
        return

      new LivingEntity.types.Animal( x, y )
    } break
    case `zebra`: {
      if (data.entities[y][x]) {
        let e = data.entities[y][x]
        if (e instanceof LivingEntity.types.River && e.node.src.slice( -8 ) === `1100.png`) {
          e.src = `river-zebra.png`
          e.stage = `drowned zebra`
        }
      }
      else if (!data.placedLands[y][x])
        return
      else if (data.placedLands[y][x].stage === `cactuland 3`)
        return
      else
        new LivingEntity.types.Animal( x, y, `zebra` )
    } break
    case `flower`: {
      if (data.entities[y][x])
        if (data.entities[y][x].stage === `essence`) {
          data.entities[y][x].src = `plague-life.png`
          data.entities[y][x].stage = `live plague`
        }
        else
          return
        
    } break
    case `plague`: {
      if (data.entities[y][x])
        return

        new LivingEntity.types.Plague( x, y )
    } break
    case `live plague`: {
      if (data.entities[y][x])
        return

        new LivingEntity.types.Plague( x, y, `live plague` )
    } break
    default: {
      if (data.onclicks[y])
        if (data.onclicks[y][x])
          data.onclicks[y][x]()
    }
  }

  if (!dataset)
    return

  dataset.count--

  if (dataset.count == 0) {
    data.activeTile.option.classList.add( `disabled` )
    data.activeTile.option.classList.remove( `active` )
    data.activeTile = {}
  }
} )
gamebox.addEventListener( `mousemove`, e => {
  let {x, y} = canvas.getBoundingClientRect()
  let m = data.mouse

  m.x = x = e.clientX - x
  m.y = y = e.clientY - y

  m.aboveCanvas = (x > 0 && y > 0 && x < data.gameSize && y < data.gameSize)

  if (m.aboveCanvas) {
    m.tileX = Math.floor( x / data.tileSize )
    m.tileY = Math.floor( y / data.tileSize )
  }
  else
    m.tileX = m.tileY = null
} )
document.addEventListener( `keydown`, e => {
  data.keys = `${data.keys}${e.key}`
} )