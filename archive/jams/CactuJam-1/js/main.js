"use strict"

const DEBUG = false
const player = new Player( `./img/rocket.png`, window.innerWidth / 2 - 42, window.innerHeight / 2 - 22, 3 )
const game = new Game
const { canvas, ctx } = game

/** @type {Meteorite[]} */
const meteorites = []
/** @type {Sunbeam[]} */
const sunbeams = []
const keys = []
const randoms = [0,0]
let nums = [0]


function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.imageSmoothingEnabled = false
}
function logic() {
  if (player.sterable) {
    if (keys[38] || keys[87]) // top
      player.acceleration += Math.sin( player.acceleration * Math.PI * player.speedMultiplier + .01 ) / 20
    else if (player.acceleration < 0.01)
      player.acceleration =  0
    else if (player.acceleration)
      player.acceleration -= .01
  
    if (keys[37] || keys[65]) // left
      player.rotation -= 2
    if (keys[39] || keys[68]) // right
      player.rotation += 2
  }
  if (keys[32] && player.magnetismable) { // space
    // game.audio.magnet.play()
    player.magnets = true
  }
  else
    player.magnets = false

  player.update()


  if (sunbeams.length) {
    for (let sunbeam of sunbeams)
      if (sunbeam)
        sunbeam.update()
  }

  if (meteorites.length) {
    for (let meteorite of meteorites)
      if (meteorite)
        meteorite.update()
  }
  
  if (game.upgrades) {
    if (
      player.x > game.spaceStation.x && player.x < game.spaceStation.x + game.spaceStation.size &&
      player.y > game.spaceStation.y && player.y < game.spaceStation.y + game.spaceStation.size
    ) {
      game.spaceStation.element.style.border = `2px solid gold`
      player.upgradeable = true
    }
    else {
      game.spaceStation.element.style.border = `1px dashed white`
      player.upgradeable = false
    }
  }
}
function spawnMeteorite( x, y, speed, rotation, size ) {
  meteorites.push( new Meteorite( `./img/meteorite.png`, x, y, speed / 10, rotation, size ) )
}
function spawnSunbeam( speed=3, rotation=0, size=7 ) {
  sunbeams.push( new Sunbeam( `./img/sunbeam.png`, speed, rotation, size ) )
}
function nearestmeteoriteInfo( nearestMeteorite={} ) {
  let { distance, speed, size } = game.meteoriteInfo

  if (!nearestMeteorite.instance) {
    distance.textContent = `---`
    speed.textContent = `---`
    size.textContent = `---`
  }
  else {
    distance.textContent = Math.floor( nearestMeteorite.distance * 10 ) / 10
    speed.textContent = Math.floor( nearestMeteorite.instance.speed * 100 ) / 10
    size.textContent = nearestMeteorite.instance.size
  }

}
function distance(aX, aY, bX, bY) {
  return Math.sqrt( (aX - bX) ** 2 + (aY - bY) ** 2 )
}
function ending( cause ) {
  let { element, title, content } = game.endscreen

  switch (cause) {
    case `EARTH DESTROYED by sunbeam`:
      title.innerHTML = `Ziemia spalona`
      content.innerHTML = ``
        + `Globalne ocieplenie sięgnęło najwyższej skali.<br>`
        + `Kwaśne deszcze wszędzie, kwaśno, brrr.`
      break
    case `EARTH DESTROYED by meteorite`:
      title.innerHTML = `Ziemia zniszczona`
      content.innerHTML = ``
        + `Jeśli chciałeś stworzyć nam księżyc to prawie Ci się udało.<br>`
        + `Prawie, ponieważ nie ma już nas - został sam ksieżyc.`
      break
    case `BOOM with meteorite`:
      title.innerHTML = `Statek zniszczony`
      content.innerHTML = ``
        + `Odczepiana kierownica czy przekroczenie prędkości na drodze mlecznej?<br>`
        + `To, że nie widziałeś znaków nie oznacza że nie ma w kosmosie regulacji prawnych.`
      break
    case `BOOM with earth`:
      title.innerHTML = `Twarde lądowanie`
      content.innerHTML = ``
        + `Jak mądrym trzeba być aby rozbić się o rodzimą planetę. Nie robi się tak.<br>`
        + `Miałeś sprowadzać meteory a nie siebię ;-;`
      break
    case `BOOM with sun`:
      title.textContent = `Piekarnik`
      content.innerHTML = ``
        + `Upiekłeś kapitana...<br><br>`
        + `Ciekawe jak to ejst wlecieć w słońce prawda? Kiedyś może się dowiesz... nowy kapitanie ^^`
      break
  }

  if (!game.baguvix) {
    element.style.display = `block`
    game.stoped = true
  }
  else 
    console.log( `GAME OVER: ${cause} -> ${title.innerHTML}` )
}
function sendMessage( message, type='normal' ) {
  if (game.stoped)
    return

  let { messenger, audio } = game
  messenger.insertAdjacentHTML( `beforeend`, `<li class="${type}">${message}</li>`)
  messenger.parentElement.scrollTop = messenger.parentElement.scrollHeight
  audio.newMessage.play()
}
function offScreen( x, y, size=0 ) {
  let data = { offScreen:true, where:null }

  if (x + size < 0)
    data.where = `left`
  else if (x - size > game.container.clientWidth)
    data.where = `right`
  else if (y + size < 0)
    data.where = `top`
  else if (y - size > game.container.clientHeight)
    data.where = `bottom`
  else
    data.offScreen = false

  return data
}
function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}
async function asyncPause( secondsOrCb ) {
  if (isNaN( secondsOrCb )) {
    return await new Promise( next => {
      let i = setInterval( () => {
        if (!secondsOrCb())
          return

        next()
        clearInterval( i )
      }, 1000 )
    } )
  }
  else
    return new Promise( resolve => setTimeout( resolve, secondsOrCb * 1000))
}


document.addEventListener( `keyup`,   e => keys[event.keyCode] = false )
document.addEventListener( `keydown`, e => keys[event.keyCode] = true  )
// window.addEventListener( `resize`,  e => resize() )

setInterval( () => {
  if (nums[0] > 500)
    nums[0] += 10
  else if (nums[0] > 240)
    nums[0] += 1

  if (game.round >= 3)
    spawnMeteorite( ...(Meteorite.randomSet) )

  spawnSunbeam( 2 * Math.floor( (Date.now() - game.timeStart) / 10000 ) / 10 )
}, 10000 - nums[0])
setInterval( () => game.earthLife < 100  ?  ++game.earthLife  :  null, 60000)

setInterval( () => {
  if (game.stoped)
    return

  logic()
  requestAnimationFrame( () => draw() )
}, 1000 / 60)

setInterval( () => {
  randoms[0] = Math.round( Math.random() * 360 )
  randoms[1] = Math.round( Math.random() * 360 )

  game.earthInfo.rocket.textContent = player.magnetPower
  game.earthInfo.magnetism.textContent = game.earthMagnetism
  game.earthInfo.life.textContent = game.earthLife
}, 200)


resize()