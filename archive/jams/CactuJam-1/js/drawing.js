function draw() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height )
  let x, y, width, height, rotation, scaleX

  // Earth
  ;({x, y, width, height} = game.earth.getBoundingClientRect())

  if (game.earthGrowingMagnetism > 0)
    ctx.lineWidth = 5

  scaleX = .5
  for (let i0 = game.earthMagnetism;  i0 > 0;  i0 -= 20) {
    let r = 30 + i0
    magnetism( scaleX, (x + width / 4) / scaleX, y + height / 2, r, randoms[0]  )
    magnetism( scaleX, (x + width / 4 * 3) / scaleX, y + height / 2, r, randoms[1] )
  }
  ctx.lineWidth = 1

  // Player
  ;({ x, y, rotation } = player)
  ;({ width, height } = player.tex)
  scaleX = .75

  ctx.save()
    ctx.translate( x, y )
    ctx.rotate( rotation * Math.PI / 180 )

    if (player.magnets) {
      ctx.save()
      ctx.rotate( 90 * Math.PI / 180 )
      for (let i0 = player.magnetPower;  i0 > 0;  i0 -= 15) {
        let r = 10 + i0
        magnetism( scaleX,  width / 5, 0, r, randoms[0]  )
        magnetism( scaleX, -width / 5, 0, r, randoms[1] )
      }
      ctx.restore()
    }

    ctx.drawImage( player.tex, -width / 2, -height / 2, width, height )
  ctx.restore()

  // Entities
  drawEntities( meteorites )
  drawEntities( sunbeams )


  // ctx.fillStyle = `red`
  // ctx.beginPath()
  // ctx.arc( window.innerWidth / 2, window.innerHeight / 2, 10, 0, Math.PI * 2 )
  // ctx.fill()
}

function drawEntities( entitiesArray ) {
  for (let entity of entitiesArray) {
    if (!entity)
      continue

    ;({ x, y, rotation } = entity)
    ;({ width, height } = entity.tex)

    ctx.save()
      ctx.translate( x + width / 2, y + height / 2 )
      ctx.rotate( (rotation) * Math.PI / 180 )
      ctx.drawImage( entity.tex, -width / 2, -height / 2, width, height )
    ctx.restore()
  }
}

function magnetism( scaleX, x, y, r, endAngle ) {
  ctx.save()
    ctx.scale(scaleX, 1)

    ctx.beginPath()
    ctx.strokeStyle = `rgba( 0, 0, 255, .5 )`
    ctx.arc( x, y, r, endAngle, endAngle + Math.PI, false)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = `rgba( 255, 0, 0, .5 )`
    ctx.arc( x, y, r, endAngle + Math.PI, endAngle + Math.PI*2, false)
    ctx.stroke()

  ctx.restore()
}