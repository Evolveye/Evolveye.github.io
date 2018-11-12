class Game {
  constructor() {
    this.container = document.querySelector( `.Game` )
    this.earth = this.container.querySelector( `.earth` )
    this.earthMagnetism = 25
    this.earthGrowingMagnetism = 0
    this.earthLife = 100

    this.earthInfo = {
      rocket: this.container.querySelector( `#rocket` ),
      magnetism: this.container.querySelector( `#earth-magnetism` ),
      life: this.container.querySelector( `#earth-life` ),
    }

    this.meteoriteInfo = {
      distance: this.container.querySelector( `#meteorite-distance` ),
      speed: this.container.querySelector( `#meteorite-speed` ),
      size: this.container.querySelector( `#meteorite-size` )
    }

    this.audio = {
      newMessage: new Audio( `./wav/new_message.wav` ),
      magnet: new Audio( `./wav/magnet.wav` )
    }

    this.spaceStation = {
      element: this.container.querySelector( `#space_station` ),
      speed: this.container.querySelector( `#space_station-speed` ),
      magnetism: this.container.querySelector( `#space_station-magnetism` ),
      size: 50
    }

    this.endscreen = {
      element: this.container.querySelector( `.endscreen` ),
      title: this.container.querySelector( `#endscreen-title` ),
      content: this.container.querySelector( `#endscreen-content` )
    }
    this.endscreen.element.style.display = `none`

    this.upgrades = false

    this.messenger = this.container.querySelector( `#messages` )

    /** @type {HTMLCanvasElement} */
    this.canvas = document.querySelector( `canvas` )

    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext( `2d` )

    this.nearestmeteoriteDistance = 75
    this.round = 0
    this.timeStart = Date.now()
    this.baguvix = false
  }
}
class Player {
  constructor( texSrc, x, y, sizeMultiplier ) {
    this.tex = new Image
    this.tex.src = texSrc
    this.tex.onload = e => {
      this.tex.width *= sizeMultiplier
      this.tex.height *= sizeMultiplier
    }

    this.x = x
    this.y = y
    this.speedMultiplier = .49
    this.acceleration = 0
    this.rotation = -90

    this.magnets = false
    this.magnetPower = 13

    this.sterable = false
    this.magnetismable = false
    this.upgradeable = false
  }

  update() {
    let isOffScreen = offScreen( this.x, this.y, this.tex.width )
    if (isOffScreen.offScreen) {
      sendMessage( `Przypominam Ci, że nie bawimy się w chowanego...` )
      this.acceleration = 0

      switch (isOffScreen.where) {
        case `left`:
          this.x += this.tex.width + 30
          break
        case `right`:
          this.x -= this.tex.width + 30
          break
        case `top`:
          this.y += this.tex.width + 30
          break
        case `bottom`:
          this.y -= this.tex.width + 30
          break
      }
      delete meteorites[meteorites.indexOf( this )]
      return
    }

    let nearestMeteorite = { distance:Infinity, instance:null }
    let criticalDistanceToEarth = distance( this.x, this.y, window.innerWidth / 2, window.innerHeight / 2) - (this.tex.width) / 2 - 30
    let criticalDistanceToSun = distance( this.x, this.y, 0, window.innerHeight / 2) - (this.tex.width) / 2 - 100

    if (criticalDistanceToSun < -1)
      ending( `BOOM with sun` )
    if (criticalDistanceToEarth < -1)
      ending( `BOOM with earth` )

    for (let meteorite of meteorites) {
      if (!meteorite)
        continue

      let mCX = meteorite.x + meteorite.size / 2
      let mCY = meteorite.y + meteorite.size / 2
      let x = distance( this.x, this.y, mCX, mCY) - (this.tex.height + meteorite.size) / 2
  
      if (x <= game.nearestmeteoriteDistance && x < nearestMeteorite.distance) {
        nearestMeteorite.instance = meteorite
        nearestMeteorite.distance = x + 5

        if (x < -3)
          ending( `BOOM with meteorite` )
      }

      if (this.magnets && x <= this.magnetPower)
        meteorite.rotation = Math.atan2( this.y - meteorite.y, this.x - meteorite.x ) * 180 / Math.PI
    }

    nearestmeteoriteInfo( nearestMeteorite )

    this.x += Math.cos( this.rotation * Math.PI / 180 ) * this.acceleration
    this.y += Math.sin( this.rotation * Math.PI / 180 ) * this.acceleration
  }

  upgrade( type ) {
    if (!this.upgradeable)
      return

    switch (type) {
      case `speed`:
        if (game.earthLife > 30 && game.earthMagnetism > 5) {
          game.earthLife -= 30
          game.earthMagnetism -= 5
          player.speedMultiplier *= 3 / 4
        }
        break
      case `magnetism`:
        if (game.earthLife > 20 && game.earthMagnetism > 10) {
          game.earthLife -= 20
          game.earthMagnetism -= 10
          player.magnetPower += 7
        }
        break
    }
  }
}
class Meteorite {
  constructor( texSrc, x, y, speed, rotation, size ) {
    this.tex = new Image
    this.tex.src = texSrc
    this.tex.width = this.tex.height = size

    this.x = x
    this.y = y
    this.speed = speed
    this.rotation = rotation
    this.size = size

    this.inAtmosphere = false

    this.interval = setInterval( () => {
      if (meteorites.indexOf( this ) == -1)
        clearInterval( this.interval )
      else if (this.inAtmosphere) {
        if (this.speed > 0)
          this.speed -= .01
        else {
          this.speed = 0

          clearInterval( this.interval )
          setTimeout( () => {
            delete meteorites[meteorites.indexOf( this )]
            game.earthGrowingMagnetism = true
            game.earthMagnetism += size / 10
            setTimeout( () => game.earthGrowingMagnetism = false, 1000 )
          }, 1000 )
        }
      }
    }, 250)
  }

  static get randomSet() {
    let [ speed, size ] = [random( 5, 30 ),random( 10, 30 )]
    return [
      // x,y,speed,rotation,size

      [-size,-size,speed,random( 5, 85 ),size],
      [-size,game.container.clientHeight + size,speed,random( -5, -85 ),size],
      [game.container.clientWidth + size,-size,speed,random( 95, 175 ),size],
      [game.container.clientWidth + size,game.container.clientHeight + size,speed,random( 185, 265 ),size],

      [-size,random( size, game.container.clientHeight - size ),speed,random( -80, 80 ),size],
      [-size,random( size, game.container.clientHeight - size ),speed,random( -80, 80 ),size],
      [-size,random( size, game.container.clientHeight - size ),speed,random( -80, 80 ),size],
      [random( size, game.container.clientWidth - size ),-size,speed,random( 10, 160 ),size],
      [random( size, game.container.clientWidth - size ),-size,speed,random( 10, 160 ),size],
      [random( size, game.container.clientWidth - size ),-size,speed,random( 10, 160 ),size],
      [game.container.clientWidth + size,random( size, game.container.clientHeight - size ),speed,random( 190, 260 ),size],
      [game.container.clientWidth + size,random( size, game.container.clientHeight - size ),speed,random( 190, 260 ),size],
      [game.container.clientWidth + size,random( size, game.container.clientHeight - size ),speed,random( 190, 260 ),size],
      [random( size, game.container.clientWidth - size ),game.container.clientHeight + size,speed,random( 280, 350 ),size],
      [random( size, game.container.clientWidth - size ),game.container.clientHeight + size,speed,random( 280, 350 ),size],
      [random( size, game.container.clientWidth - size ),game.container.clientHeight + size,speed,random( 280, 350 ),size],

    ][random( 0, 15 )]
  }

  update() {
    if (offScreen( this.x, this.y, this.size * 2 ).offScreen) {
      delete meteorites[meteorites.indexOf( this )]
      return
    }
    
    let distanceToEarth = distance( this.x + this.tex.width / 2, this.y + this.tex.height / 2, window.innerWidth / 2, window.innerHeight / 2) - this.size / 2 - 35

    if (distanceToEarth < 0) {
      if (game.earthLife > 50) {
        delete meteorites[meteorites.indexOf( this )]
        game.earthLife -= 50
      }
      else {
        game.earthLife = 0
        ending( `EARTH DESTROYED by meteorite` )
      }
    }
    else if (distanceToEarth < game.earthMagnetism * .5 + 5)
      this.inAtmosphere = true
    else
      this.inAtmosphere = false

    this.x += Math.cos( this.rotation * Math.PI / 180 ) * this.speed
    this.y += Math.sin( this.rotation * Math.PI / 180 ) * this.speed
  }
}


class Sunbeam {
  constructor( texSrc, speed, rotation, size ) {
    this.tex = new Image
    this.tex.src = texSrc
    this.tex.width = this.tex.height = size

    this.rotation = rotation
    this.speed = speed
    this.size = size

    this.x = 0
    this.y = window.innerHeight / 2
    this.inAtmosphere = false
    this.earthInfluence = Math.random() > .5  ?  5  :  -5

    this.interval = setInterval( () => {
      if (this.inAtmosphere) {
        if (this.speed > 0)
          this.rotation += this.earthInfluence
        else {
          this.speed = 0

          clearInterval( this.interval )
          setTimeout( () => delete sunbeams[sunbeams.indexOf( this )], 100 )
          
        }
      }
    }, 5)
  }

  update() {
    if (offScreen(this.x, this.y, this.size).offScreen) {
      delete sunbeams[sunbeams.indexOf( this )]
      return
    }

    let distanceToEarth = distance( this.x + this.tex.width / 2, this.y + this.tex.height / 2, window.innerWidth / 2, window.innerHeight / 2) - this.size / 2 - 35

    if (distanceToEarth < 0) {
      delete sunbeams[sunbeams.indexOf( this )]

      if (game.earthLife > 0)
        --game.earthLife
      else {
        game.earthLife = 0
        ending( `EARTH DESTROYED by sunbeam` )
      }
    }
    else if (distanceToEarth < game.earthMagnetism * .5 + 10)
      this.inAtmosphere = true
    else
      this.inAtmosphere = false

    this.x += Math.cos( this.rotation * Math.PI / 180 ) * this.speed
    this.y += Math.sin( this.rotation * Math.PI / 180 ) * this.speed
  }
}