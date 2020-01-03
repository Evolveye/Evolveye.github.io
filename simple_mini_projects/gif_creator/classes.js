class Gif {
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
   * @param {string[][]} imageData userfriendly image data
   */
  constructor( colorsDefinitions, imageData ) {
    const colorsAliases = Object.keys( colorsDefinitions )

    this.globalColorDefinitions = colorsDefinitions

    this.width = Gif.get2ByteCode( imageData[ 0 ].length )
    this.height = Gif.get2ByteCode( imageData.length.toString( 16 ) )
    this.globalColorTableFlag = 1
    this.colorResolution = (this.globalColorTableFlag ? ~~Math.log2( colorsAliases.length ) - 1 : 0)
    this.sortColorsFlag = 0
    this.sizeOfGlobalColorTable = this.colorResolution // i don't know the difference ;/
    this.backgroundColorIndex = Gif.get1ByteCode( this.globalColorTableFlag ? 0 : 0 )
    this.pixelAspectRatio = Gif.get1ByteCode( 0 )
    this.delay = Gif.get2ByteCode( 0 )

    this.bufferData = `47 49 46 38 39 61 `
    this.bufferData += `${this.width} ${this.height} `
    this.bufferData += parseInt( ``
      + this.globalColorTableFlag
      + Gif.getNumberInRadix( this.colorResolution, 2, 3 )
      + this.sortColorsFlag
      + Gif.getNumberInRadix( this.sizeOfGlobalColorTable, 2, 3 )
    , 2 ).toString( 16 ).toUpperCase()
    this.bufferData += ` ${this.backgroundColorIndex} ${this.pixelAspectRatio}`

    colorsAliases.forEach( alias => this.bufferData += ` ${colorsDefinitions[ alias ]}` )

    this.bufferData += ` 21 F9 04 00 ${this.delay} 00 00 `
    this.bufferData += `2C 00 00 00 00 ${this.width} ${this.height} 00`

    this.addFrame( imageData )

    this.bufferData += ` 3B`
    this.bufferDataBinary = this.bufferData.replace( / /g, `` )
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
  getImgTag() {
    const img = document.createElement( `img` )

    img.src = this.getSrc()

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