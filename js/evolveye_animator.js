const update = () => background.setAttribute( `d`, relocatePoints() )

const str = background.getAttribute( `d` )
const { x, y, width, height } = pupil.getBoundingClientRect()
const pupilX = x + width / 2
const pupilY = y + height / 2

update()
setInterval( update, 1000 * 2 )

function relocatePoints() {
  const factor = .5

  return str.match( /\w[-. \d\n]+/g ).map( line => {
    switch (line.charAt( 0 )) {
      // case `M`: return `M ${Math.random() * jump + 300} ${Math.random() * jump + 70}`
      case `c`: return `c` + line.match( /[-.\d]+/g )
        .map( numStr => Number( numStr ) )
        .map( (num, i) => num + factor * (Math.random() > .5 ? 1 : -1) * (i < 10 ? 5 : 1) )
        .reduce( (str, num) => `${str} ${num}`, `` )
      default: return line
    }
  } )
}

function mapNumber( num, numRange, destinationRange ) {
  const numRLen = numRange[ numRange.length - 1 ] - numRange[ 0 ]
  const destRLen = destinationRange[ numRange.length - 1 ] - destinationRange[ 0 ]
  const validatedNum = num < numRange[ 0 ]
    ? numRange[ 0 ]
    : num > numRange[ numRange.length - 1 ]
    ? numRange[ numRange.length - 1 ]
    : num

  return ((validatedNum - numRange[ 0 ]) / numRLen) * destRLen + destinationRange[ 0 ]
}

document.addEventListener( `mousemove`, ({ clientX, clientY }) => {
  const { sign, abs, sqrt } = Math

  const addition = num => (sqrt( abs( num ) ) * (-1 / ((.05 * num) ** 2 + 1) + 1)) * sign( num )
  const num = (client, pupil, dimension) => (client - pupil) < dimension * 5 ? (client - pupil) : dimension * 5

  const x = num( clientX, pupilX, width )
  const y = num( clientY, pupilY, height )

  pupil.setAttribute( `cx`, pupilX + addition( x )  )
  pupil.setAttribute( `cy`, pupilY + addition( y ) )
} )