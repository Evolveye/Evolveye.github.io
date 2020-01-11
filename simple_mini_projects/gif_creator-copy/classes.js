export class Gif {
  /*\
   *                                     ,,,----------,
   *                                     |||          |
   *                                    10010001      |
   *                                    --------      |
   *                                       |          v
   *                                       v       2^(N+1) colors
   * GIF := 47 49 46 38 39 61 0A 00 0A 00 91 00 00 FF FF FF FF 00 00 00 00 FF 00 00 00 21 F9 04 00 00 00 00 00 2C 00 00 00 00 0A 00 0A 00 00 02 16 8C 2D 99 87 2A 1C DC 33 A0 02 75 EC 95 FA A8 DE 60 8C 04 91 4C 01 00 3B
   *        ----------------- -------------------- ----------------------------------- ----------------------- ----------------------------- -------------------------------------------------------------------------- --
   *        HEADER            LOGICAL SCREEN       GLOBAL COLOR TABLE                  GRAPHICS CONTROL        IMAGE DESCRIPTOR              IMAGE DATA                       02                                        TRAILER
   *                                                                                                           EXTENSION
  \*/

  /**
   * @param {Any} colorsDefinitions object with properties ised in imageData meaning colors in hex; { r:"FF 00 00" }
   * @param {string[][][]} imageData userfriendly gif frames data
   */
  constructor( colorsDefinitions, imageData ) {
    const colorsAliases = Object.keys( colorsDefinitions )

    this.globalColorDefinitions = colorsDefinitions

    this.width = Gif.get2ByteCode( imageData[ 0 ][ 0 ].length )
    this.height = Gif.get2ByteCode( imageData[ 0 ].length.toString( 16 ) )
    this.globalColorTableFlag = 1
    this.colorResolution = (this.globalColorTableFlag ? ~~Math.log2( colorsAliases.length ) - 1 : 0)
    this.sortColorsFlag = 0
    this.sizeOfGlobalColorTable = this.colorResolution // i don't know the difference ;/
    this.backgroundColorIndex = Gif.get1ByteCode( this.globalColorTableFlag ? 0 : 0 )
    this.pixelAspectRatio = Gif.get1ByteCode( 0 )
    this.delay = Gif.get2ByteCode( 0 )

    // HEADER
    this.bufferData = `47 49 46 38 39 61 `

    // LOGICAL SCREEN
    this.bufferData += `${this.width} ${this.height} `
    this.bufferData += parseInt( ``
      + this.globalColorTableFlag
      + Gif.getNumberInRadix( this.colorResolution, 2, 3 )
      + this.sortColorsFlag
      + Gif.getNumberInRadix( this.sizeOfGlobalColorTable, 2, 3 )
    , 2 ).toString( 16 ).toUpperCase()
    this.bufferData += ` ${this.backgroundColorIndex} ${this.pixelAspectRatio}`

    // GLOBAL COLOR TABLE
    colorsAliases.forEach( alias => this.bufferData += ` ${colorsDefinitions[ alias ]}` )

    // APPLICATION EXTENSION
    if ( imageData.length > 1 ) {
      const loops = Infinity
      this.bufferData += ` 21 FF 0B 4E 45 54 53 43 41 50 45 32 2E 30 03 01 ${loops == Infinity ? "00 00" : Gif.get2ByteCode( loops )} 00`
    }

    imageData.forEach( data => {
      // GRAPHICS CONTROL EXTENSION
      //    BITS:  1-3:(future)  4-6:(what happens to the current image data when you move onto the next)  7:(user input flag, 0 recommended)  8:transparency
      //                            0 - no disposal method - no animations
      //                            1 - draw on previus frame
      //                            2 - clear to background color
      //                            3 - back to state before that frame
      //                            4-7 are yet to be defined
      //
      //                             ^
      //                             |                       000 001 0 0
      this.bufferData += ` 21 F9 04 ${imageData.length > 1 ? "04" : "00"} ${this.delay} 00 00`

      // IMAGE DESCRIPTOR
      this.bufferData += ` 2C 00 00 00 00 ${this.width} ${this.height} 00`

      // IMAGE DATA
      this.addFrame( data )
    } )

    // TRAILER
    this.bufferData += ` 3B`
    this.bufferData = this.bufferData.replace( / /g, `` )
  }
  /**
   * @param {string[][]} imageData userfriendly image data
   */
  addFrame( imageData ) {
    const colorsAliases = Object.keys( this.globalColorDefinitions )
    const realGlobalColorTableSize = this.sizeOfGlobalColorTable + 1
    const flattedImage = [ ...imageData.flat(), `EiO` ]
    const codeTable = colorsAliases.concat( [`CLEAR`, `EiO` ] )
    const codeStream = [ { length:3, index:(2 ** realGlobalColorTableSize) } ]

    let sequence = flattedImage[ 0 ]
    let length = 2 ** realGlobalColorTableSize - 1

    for (let code = 0; flattedImage[ code ] != `EiO`;) {
      let founded = true
      let k = code + 1

      while (founded && k <= flattedImage.length) {
        const nextSequence = flattedImage.slice( code, k ).join( `` )

        if (codeTable.indexOf( nextSequence ) != -1) {
          sequence = nextSequence
          k += 1
        } else {
          const index = codeTable.indexOf( sequence )

          if (codeTable.length > 2 ** length && codeStream[ codeStream.length - 1 ].index != index ) length++

          codeTable.push( nextSequence )
          codeStream.push( { length, index } )

          sequence = ""
          founded = false
        }
      }

      code = k - 1
    }
    codeStream.push( { length, index:(2 ** realGlobalColorTableSize + 1) } )

    // const indexCode = codeStream.reduce( (code, { length, index }) => `${code}#${index} `, `` )
    const byteCode = codeStream.reduce( (code, { length, index }) => ` ${index.toString( 2 ).padStart( length, `0` )}${code} `, `` )
    const hexCode = (function(){
      let length = 0
      let data = ``
      let temp = byteCode.replace( / /g, `` )

      while (temp.length) {
        const byte = temp.slice( -8 )

        data += `${parseInt( byte, 2 ).toString( 16 ).padStart( 2, `0` )} `
        temp = temp.slice( 0, -8 )
        length++
      }

      return { data:data.toUpperCase(), length }
    }())

    this.bufferData += ` 0${realGlobalColorTableSize} ${Gif.getNumberInRadix( hexCode.length, 16, 2)} ${hexCode.data}00`
  }
  getSrc() {
    const charCodes = this.bufferData
      .replace( /\r|\n/g, `` )
      .replace( /([\da-fA-F]{2}) ?/g, `0x$1 `)
      .replace( / +$/, `` )
      .split( ` ` )

    return `data:image/gif;base64,${btoa( String.fromCharCode( ...charCodes ) )}`
  }
  getImgTag( width, height ) {
    const img = document.createElement( `img` )

    img.src = this.getSrc()

    if (width && height) {
      img.width = width
      img.height = height
    }

    return img
  }

  /**
   * @param {number} number
   */
  static get1ByteCode( number ) {
    return number.toString( 16 ).toUpperCase().padStart( 2, `0` )
  }
  /**
   * @param {number} number
   */
  static get2ByteCode( number ) {
    const code = number.toString( 16 ).toUpperCase().padStart( 4, `0` )

    return `${code.slice( 2 )} ${code.slice( 0, 2 )}`
  }
  /**
   * @param {number} number
   * @param {number} radix
   * @param {number} length
   */
  static getNumberInRadix( number, radix, length ) {
    return number.toString( radix ).padStart( length, `0` )
  }
}
export class Png {
  /**
   * @param {Buffer} buffer
   */
  constructor( buffer ) {
    this.signature = buffer.slice( 0, 8 )
    this.header = {}
    this.data = {}
    this.end = null

    let i = 8
    while (i < buffer.length) {
      const length = Png.bufferToNum( buffer.slice( i,     i + 4 ) )
      const type = buffer.slice( i + 4, i + 8 ).toString()
      const data = buffer.slice( i + 8, i + 8 + length )
      const crc = buffer.slice( i + 8 + length, i + 8 + length + 4 )

      if (type === `IHDR`) {
        this.header.width = Png.bufferToNum( data.slice( 0, 4 ) )
        this.header.height = Png.bufferToNum( data.slice( 4, 8 ) )
        this.header.bitDepth = buffer[ 8 ]
        this.header.color = buffer[ 9 ]
        this.header.compression = buffer[ 10 ]
        this.header.filter = buffer[ 11 ]
        this.header.interlace = buffer[ 12 ]
      } else if (type === `IDAT`) {
        this.data.windowSize = data[ 0 ] >> 4
        this.data.method = data[ 0 ] & 15
        this.data.level = data[ 1 ] >> 6
        this.data.dict = data[ 1 ] >> 5 & 1
        this.data.checksum = Png.bufferToNum( data.slice( 0, 2 ) ) % 31
        this.data.lastBlock = data[ 3 ] & 1
        this.data.blockType = data[ 3 ] >> 1 & 3
        this.data.dataLength = Png.bufferToNum( data.slice( 3, 5 ).reverse() )
        this.data.length = Png.bufferToNum( data.slice( 5, 7 ).reverse() )
        this.data.lineFilter = data[ 7 ]

        //...and problem, because I have weird values in buffer
           console.log( data )
        // <Buffer 18 57 63 cf f8 f0 c0 1f 00 05 00 01 ff>
      } else if (type === `IEND`) {
      }

      i += 8 + length + 4
    }
  }

  /**
   * @param {Buffer} buffer
   */
  static bufferToNum( buffer ) {
    return buffer.reduceRight( (a, b, i, { length }) => a + b * 256 ** (length - 1 - i) )
  }
}