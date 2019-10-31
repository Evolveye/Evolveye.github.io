function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

function rangedCeilFloor( num, max, min=0 ) {
  return num < min ? min
    : num > max ? max
    : num
}

function clockwiseAngle( angleA, angleB ) {
  let biggerAngle, smallerAngle, sign

  if (angleA > angleB) {
    biggerAngle = angleA
    smallerAngle = angleB
    sign = 1
  } else {
    biggerAngle = angleB
    smallerAngle = angleA
    sign = -1
  }

  const clockwiseMove = biggerAngle - smallerAngle
  const anticlockwiseMove = smallerAngle + 360 - biggerAngle

  if (anticlockwiseMove < clockwiseMove) return anticlockwiseMove * sign
  else return clockwiseMove * -sign
}

function draw() {

  ctx.clearRect( 0, 0, width, height )

  // ctx.fillStyle = `#f00`

  // for (const { x, y } of points) {
  //   ctx.beginPath()
  //   ctx.arc( x, y, 5, 0, Math.PI * 2 )
  //   ctx.fill()
  // }

  ctx.strokeStyle = `#5123ad`
  ctx.lineWidth = 3

  for (const circle of circles) {
    const { x, y } = circle

    if (!circle.pointToMove) circle.pointToMove = points[ random( 0, points.length - 1 ) ]

    ctx.beginPath()
    ctx.arc( x, y, 5, 0, Math.PI * 2 )
    ctx.stroke()
  }
}

document.onclick = ({ clientX, clientY }) => {
  const angle = Math.atan2( points[ 0 ].y - clientY, points[ 0 ].x - clientX ) * 180 / Math.PI
  console.log( angle, rangedCeilFloor( angle, 6, -6 ) )
}