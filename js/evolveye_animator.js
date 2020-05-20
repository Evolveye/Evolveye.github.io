
/*\
 *  Simple SVG avatar animator
\*/


const pathD = `
  M 210 10

  c    -4.4  1    -9.1  2.3   -10.5  2.9    -4.1  1.8    -8.7  6.5  -10.5  10.7      -2.8  7   -7.5  10.7    -16.5  13      -3.8  1
    -5.1  0.9   -8.5  -0.5   -2.2  -0.9   -7.8  -2.9  -12.5  -4.5   -9.5  -3.1  -11.7  -4.6  -13.7  -9.3   -1.1  -2.7   -1.8  -3.2
    -4.7  -3.2        -4  0    -8.3  3.2   -11.7  8.6    -1.7  2.9      -2  4.5    -1.6  8.7     0.3  2.9     0.8  6.1     1.2  7.3
      0.9  2.8      -2  5.7    -4.9  4.8     -5  -1.4    -11.3  -5    -17  -9.8   -3.3  -2.7   -6.4  -5.5     -6.8  -6   -1.3  -1.9
    -4.2  0.8      -5.6  5    -1.1  3.2    -1.2  5.8   -0.2  13.7       1  8.6    0.9  10.2   -0.5  12.3    -2.1  3.3        -4  3
  -10.6  -1.6   -3.2  -2.2     -6.1  -4     -6.5  -4      -0.4  0   -1.7  -0.8   -2.8  -1.8   -2.8  -2.4   -8.7  -4.1  -11.2  -3.1
    -1.1  0.4    -2.8  1.9    -3.8  3.3    -1.6  2.5      -2  2.6        -8  2   -5.8  -0.6   -6.5  -0.5    -7.5  1.4    -0.6  1.1
    -1.1  6.2   -1.1  11.3       0  5.1   -0.5  14.3   -1.1  20.4     -1  10.3   -0.9  11.7      1  17.9     1.2  3.8     2.1  8.1
      2.1  9.7       0  1.6    -2.2  9.9     -5  18.4   -6.6  20.6   -6.8  25.7   -0.9  39.3    7.2  16.8    6.3  29.1   -2.6  39.2
      -5.4  6    -6.8  8.8   -8.5  15.9   -2.5  10.7    0.6  31.7    6.5  44.9     2.9  6.4     11  14.3   19.7  19.2     9.2  5.2
    10.1  7.3     10.9  25    0.7  14.6    1.9  20.1    5.7  27.6     3.9  7.4   12.8  15.4   17.1  15.4       1.9  0    2.1  -0.6
    2.1  -5.8        0  -6    1.1  -8.2    4.1  -8.2         3  0   17.1  10.2   26.5  19.1     4.9  4.8     9.9  8.9      11  9.2
        1  0.3     5.9  1.5    10.8  2.7    10.9  2.7    15.9  4.8    23.4  9.8     5.3  3.6     8.7  4.8    16.7  5.8     1.7  0.2
      6.4  0.8    10.5  1.3     9.1  1.2    20.2  3.6      22.9  5     1.1  0.6     4.7  1.1       8  1.1       5.2  0    7.2  -0.6
    14.8  -4.6

  l   8.8 -4.6      9.1 0.6

  c   7.5  0.4    10.4  0.1     16  -1.5   26.5  -7.9   29.7  -8.3   33.2  -4.6     1.7  1.8     2.2  3.6     2.2  7.4       0  2.8
      0.3  5.8     0.6  6.7     1.4  3.6     7.8  1.1   16.4  -6.4    8.6  -7.4    11  -14.1   8.4  -23.5    -4.4  -16  -3.8  -20.1
    3.8  -26.5    2.9  -2.5    8.6  -7.7  12.6  -11.6    4.2  -4.2    7.9  -7.1      8.9  -7     2.8  0.4     5.1  4.6    7.3  13.1
    4.2  16.5    5.5  16.7      14  1.4      3.4  -6   7.5  -14.4   9.1  -18.6    3.3  -8.9   7.2  -14.9  10.2  -15.7    4.1  -1.1
    7.2  -0.6    10.7  1.7     5.6  3.8       6.9  4     7.6  1.2    1.1  -4.5  -0.4  -10.9    -5.8  -25

  l   -5.3 -14        0 -12

  c   0.1  -12   0.1  -12.1   4.9  -24.5    3.3  -8.6      5  -14.5     5.3  -19      0.6  -7    1.8  -9.1     6.3  -11    3.9  -1.6
    4.5  -5.3   2.6  -15.5    -3.1  -16  -7.4  -22.1  -27.4  -38.9  -11.3  -9.5 -13.2  -13.6 -13.1  -27.1   0.1  -10.5  -1.5  -19.4
  -5.1  -28.4   -2.5  -6.4   -1.8  -9.7   2.5  -12.3       1.8  -1    3.6  -2.5    3.8  -3.2      0.8  -2     -2.4  -5   -9.5  -9.1
      -3.5  -2   -9.1  -5.3  -12.6  -7.5   -3.4  -2.2    -9.1  -4.9  -12.5  -6.1   -3.4  -1.2   -6.8  -2.7   -7.4  -3.2   -2.4  -1.8
    -1.3  -5.1    3.2  -9.7    4.6  -4.7    5.2  -7.4       1.7  -8   -0.9  -0.1  -10.3  -0.4  -20.7  -0.5  -17.2  -0.2  -19.5  -0.5
  -23.3  -2.4     -7  -3.6   -14.9  -10  -17.8  -14.7   -3.3  -5.2   -6.6  -5.8    -10.7  -2    -2.3  2.1    -4.7  7.9   -4.7  11.4
        0  0.7      -1.6  2    -3.7  2.8      -3  1.3     -4.7  1.4   -10.1  0.4   -7.2  -1.2    -17.7  -6  -20.5  -9.3   -3.6  -4.3
    -5.7  -8.3  -5.7  -10.8

  z
`

// update()
// setInterval( update, 1000 * 2 )

const avatars = document.querySelectorAll( `svg.avatar-evolveye` )
const elements = []
const [ originalWidth, originalHeight ] = [ 440, 440 ]
window.elements = elements
avatars.forEach( svg => {
  const svgBoundings = svg.getBoundingClientRect()
  const factor = svgBoundings.width / originalWidth

  const pathData = shapeModifier( pathD, factor )
  const pupilCX = 298 * factor
  const pupilCY = 179 * factor
  const pupilRX = 44 * factor
  const pupilRY = 60 * factor

  svg.insertAdjacentHTML( `beforeend`, `<path fill="#33d" d="${pathData}"/>` )
  svg.insertAdjacentHTML( `beforeend`, `<ellipse cx="${254 * factor}" cy="${189 * factor}" rx="${114 * factor}" ry="${123 * factor}" fill="#fff"/>` )
  svg.insertAdjacentHTML( `beforeend`, `<ellipse cx="${pupilCX}" cy="${pupilCY}" rx="${pupilRX}"  ry="${pupilRY}"  fill="#000"/>` )

  const pupil = svg.querySelector( `ellipse[fill="#000"]` )
  const { x, y, width, height, left, top } = pupil.getBoundingClientRect()

  elements.push( {
    path: svg.querySelector( `path` ),
    pathData,
    pupil,
    factor,
    pupilCX,
    pupilCY,
    pupilTop: top,
    pupilLeft: left,
    pupilWidth: pupilRX * 2,
    pupilHeight: pupilRY * 2,
  } )
} )

reshape()

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

function shapeModifier( path, factor=null, forceRandom=false) {
  const random = i => .5 * (Math.random() > .5 ? 1 : -1) * (i < 10 ? 5 : 1)
  const pathFragments = path.match( /\w[-. \d\n]+/g ).map( fragment => ({
    symbol: fragment.charAt( 0 ),
    data: fragment.match( /[-.\d]+/g )?.map( numStr => Number( numStr ) )
  }))

  return pathFragments.map( ({ symbol, data=[] }) => {
    if (symbol == `c` && (!factor || forceRandom)) {
      return `c` + data.map( (num, i) => (num + random( i )) * (factor || 1) ).join( ` ` )
    }

    return symbol + ` ` + (factor ? data.map( num => num * factor ) : data).join( ` ` )
  } ).reduce( (str, line) => `${str} ${line}`, ``)
}

function reshape() {
  for (const { path, factor } of elements) path.setAttribute( `d`, shapeModifier( pathD, factor, true ) )

  setTimeout( reshape, 1000 * 2 )
}

document.addEventListener( `mousemove`, ({ clientX, clientY }) => {
  const { sign, abs, sqrt } = Math

  const addition = num => (sqrt( abs( num ) ) * (-1 / ((.05 * num) ** 2 + 1) + 1)) * sign( num )
  const position = (clienPos, pupilPos, dimension) => (clienPos - pupilPos) < dimension * 5 ? (clienPos - pupilPos) : dimension * 5

  for (const { pupil, pupilCX, pupilCY, pupilWidth, pupilHeight, pupilTop, pupilLeft, factor } of elements) {
    const x = position( clientX, pupilLeft + pupilWidth / 2, pupilWidth )
    const y = position( clientY, pupilTop + pupilHeight / 2, pupilHeight )

    pupil.setAttribute( `cx`, pupilCX + addition( x ) * factor )
    pupil.setAttribute( `cy`, pupilCY + addition( y ) * factor )
  }
} )