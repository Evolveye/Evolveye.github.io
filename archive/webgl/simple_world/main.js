'use strict'

//: Canvas
  /** @type {HTMLCanvasElement} */
  const canvas  =  document.querySelector( '[id="$canvas"]' )
  const gl      =  canvas.getContext( 'experimental-webgl' )

  canvas.width  = canvas.clientWidth
  canvas.height = canvas.clientHeight


//: Data defining
  // Given things
  const user_blocks = [
    { id:1, type:'block', name:'cloud', color:[240, 240, 240] },
    { id:2, type:'block', name:'grass', color:[34,  139, 34 ] },
    { id:3, type:'block', name:'dirt',  color:[165, 42,  42 ] }
  ]
  const game_shapes = {
    block: {
      vertices: [
        // front wall
        0, 0, 0,   20,0, 0,   0, 20,0,
        20,0, 0,   0, 20,0,   20,20,0,

        // back wall
        0, 0, 20,  20,0, 20,  0, 20,20,
        20,0, 20,  0, 20,20,  20,20,20,

        // right wall
        20,0, 20,  20,0, 0,   20,20,20,
        20,0, 0,   20,20,20,  20,20,0,
        
        // left wall
        0, 0, 20,  0, 0, 0,   0, 20,20,
        0, 0, 0,   0, 20,20,  0, 20,0,

        // top wall
        0, 0, 0,   20,0 ,0,   0, 0, 20,
        20,0 ,0,   0, 0, 20,  20,0, 20,

        // bottom wall
        0, 20,0,   20,20,0,   0, 20,20,
        20,20,0,   0, 20,20,  20,20,20
      ],
      colors: [
        /* * Colors
         * red: 1,0,0
         * green: 0,1,0
         * blue: 0,0,1
         * yellow: 1,1,0
         * cyan: 0,1,1
         * purple: .66, .13, .66
         */
        .66, .13, .66,
        1,   1,   0,

        1,   0,   0,
        0,   1,   0,

        0,   0,   0,
        .1,  0,   1,
      ],
      vertexShader: `
        attribute vec4 a_position;
        uniform mat4 u_matrix;
        
        attribute vec3 a_color;
        varying vec3 v_color;

        void main() {
          v_color = a_color;
          gl_Position = u_matrix * a_position;
        }
      `,
      fragmentShader: `
        precision mediump float;

        varying vec3 v_color;

        void main() {
          gl_FragColor = vec4( v_color, 1 );
        }
      `
    }
  }
  const game_map = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],
    [],
    [],
    [],
    [],
    [],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
    [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,3],
    [3,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,3,3,3,3],
    [3,3,3,2,2,2,2,3,2,2,2,2,2,3,3,3,3,3,3,3,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
  ]
  // const game_map = [
    //   [],
    //   [],
    //   [0,1,0, 0, 1,0,1, 0, 1,1,1, 0, 1,0,1, 0, 1,1,1, 0, 0,1,0],
    //   [1,1,1, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 1,1,1],
    //   [0,1,0, 0, 1,1,1, 0, 1,1,1, 0, 1,1,1, 0, 1,1,1, 0, 0,1,0],
    //   [0,0,0, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 0,0,0],
    //   [0,0,0, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 1,0,1, 0, 0,0,0],
    //   [],
    //   [1,0,1,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1]
    // ]
  const game_size = 10
  const unitX =  2 / gl.canvas.clientWidth
  const unitY = -2 / gl.canvas.clientHeight
  const webGLUtils = {
    m4: {
      makeZToWMatrix( fudgeFactor ) {
        return [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, fudgeFactor,
          0, 0, 0, 1,
        ];
      },
      projection( width, height, depth ) {
        // This matrix flips the Y axis so 0 is at the top.
        return [
           2 / width,   0, 0, 0,
           0, -2 / height, 0, 0,
           0, 0, 2 / depth,   0,
          -1, 1, 0, 1,
        ];
      },
      multiply( matrixA, matrixB ) {
        let a00 = matrixA[0 * 4 + 0]
        let a01 = matrixA[0 * 4 + 1]
        let a02 = matrixA[0 * 4 + 2]
        let a03 = matrixA[0 * 4 + 3]
        let a10 = matrixA[1 * 4 + 0]
        let a11 = matrixA[1 * 4 + 1]
        let a12 = matrixA[1 * 4 + 2]
        let a13 = matrixA[1 * 4 + 3]
        let a20 = matrixA[2 * 4 + 0]
        let a21 = matrixA[2 * 4 + 1]
        let a22 = matrixA[2 * 4 + 2]
        let a23 = matrixA[2 * 4 + 3]
        let a30 = matrixA[3 * 4 + 0]
        let a31 = matrixA[3 * 4 + 1]
        let a32 = matrixA[3 * 4 + 2]
        let a33 = matrixA[3 * 4 + 3]
  
        let b00 = matrixB[0 * 4 + 0]
        let b01 = matrixB[0 * 4 + 1]
        let b02 = matrixB[0 * 4 + 2]
        let b03 = matrixB[0 * 4 + 3]
        let b10 = matrixB[1 * 4 + 0]
        let b11 = matrixB[1 * 4 + 1]
        let b12 = matrixB[1 * 4 + 2]
        let b13 = matrixB[1 * 4 + 3]
        let b20 = matrixB[2 * 4 + 0]
        let b21 = matrixB[2 * 4 + 1]
        let b22 = matrixB[2 * 4 + 2]
        let b23 = matrixB[2 * 4 + 3]
        let b30 = matrixB[3 * 4 + 0]
        let b31 = matrixB[3 * 4 + 1]
        let b32 = matrixB[3 * 4 + 2]
        let b33 = matrixB[3 * 4 + 3]
        
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        ]
      },
      translation(tx, ty, tz) {
        return [
           1,  0,  0,  0,
           0,  1,  0,  0,
           0,  0,  1,  0,
           tx, ty, tz, 1,
        ];
      },
      xRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ];
      },
      yRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          c, 0, -s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1,
        ];
      },
      zRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
           c, s, 0, 0,
          -s, c, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1,
        ];
      },
      scaling(sx, sy, sz) {
        return [
          sx, 0,  0,  0,
          0, sy,  0,  0,
          0,  0, sz,  0,
          0,  0,  0,  1,
        ];
      },
      translate(m, tx, ty, tz) {
        return this.multiply(m, this.translation(tx, ty, tz));
      },
      xRotate(m, angleInRadians) {
        return this.multiply(m, this.xRotation(angleInRadians));
      },
      yRotate(m, angleInRadians) {
        return this.multiply(m, this.yRotation(angleInRadians));
      },
      zRotate(m, angleInRadians) {
        return this.multiply(m, this.zRotation(angleInRadians));
      },
      scale(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
      }
    }
  }

  // Script
  let arrays = {
    colors: [],
    drawable: {},
    blocks: ( () => {
      let blocks = {}
  
      for( let block of user_blocks ) {
        blocks[block.id] = {
          type: block.type,
          name: block.name,
          colors: ( () => {
            let colors = []

            // RGB of block color
            let RGB = [
              block.color[0] / 255,
              block.color[1] / 255,
              block.color[2] / 255
            ]

            let wallColorFunctions = [
              color => color,
              color => color,
              color => color + (1 - color) / 2,
              color => color + (1 - color) / 2,
              color => color - color / 2,
              color => color - color / 2
            ]

            for( let wallColorFunction of wallColorFunctions ) {
              let wallColors = [
                wallColorFunction( RGB[0] ),
                wallColorFunction( RGB[1] ),
                wallColorFunction( RGB[2] )
              ]
              wallColors = wallColors.concat( wallColors, wallColors )
              colors = colors.concat( wallColors.concat( wallColors ) )
            }

            return colors
          } )()
        }
      }
  
      return blocks
    } )()
  }

  console.log( arrays )

  arrays.drawable = ( () => {
    arrays.colors = []
    let drawable = []

    for( let row of game_map )
      for( let i0 = 0;  i0 < row.length;  i0++ ) {
        let rowNum  =  game_map.indexOf( row )
        let id      =  row[i0]
        let block   =  arrays.blocks[id]

        if( !id || !block )
          continue

        for( let i1 = 0;  i1 < game_shapes[block.type].vertices.length;  i1 += 3) {
          drawable.push(
            game_shapes.block.vertices[i1 + 0] + i0 * 20,
            game_shapes.block.vertices[i1 + 1] + rowNum * 20,
            game_shapes.block.vertices[i1 + 2]
          )
        }

        arrays.colors = arrays.colors.concat( block.colors )
      }

    return drawable
  } )()

//: Data association
  const vertexShader   = createShader( gl, gl.VERTEX_SHADER, game_shapes.block.vertexShader )
  const fragmentShader = createShader( gl, gl.FRAGMENT_SHADER, game_shapes.block.fragmentShader )
  const shaderProgram  = createProgram( gl, vertexShader, fragmentShader )

  // position
  const vertexBuffer = gl.createBuffer()
  const a_position = gl.getAttribLocation( shaderProgram, 'a_position' )

  gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( arrays.drawable ), gl.STATIC_DRAW )
  gl.enableVertexAttribArray( a_position )
  gl.vertexAttribPointer( a_position, 3, gl.FLOAT, false, 0, 0 )
  gl.bindBuffer( gl.ARRAY_BUFFER, null )

  // color
  const colorBuffer = gl.createBuffer()
  const a_color = gl.getAttribLocation( shaderProgram, 'a_color' )

  gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( arrays.colors ), gl.STATIC_DRAW )
  gl.enableVertexAttribArray( a_color )
  gl.vertexAttribPointer( a_color, 3, gl.FLOAT, false, 0, 0 )
  gl.bindBuffer( gl.ARRAY_BUFFER, null )

  // matrix
  const u_matrix = gl.getUniformLocation( shaderProgram, 'u_matrix' )
  let multiplier = 3
  let matrix = webGLUtils.m4.makeZToWMatrix( .5 )
  matrix = webGLUtils.m4.multiply( matrix, webGLUtils.m4.projection( gl.canvas.clientWidth, gl.canvas.clientHeight, 1000 ) )
  //matrix = webGLUtils.m4.translate( matrix, canvas.width / 4, canvas.height / 3, 0 )


//: Draw
  let lastFrameTime = 0
  let animateId = 0

  gl.useProgram( shaderProgram )

  gl.enable( gl.DEPTH_TEST )
  gl.depthFunc( gl.LEQUAL )
  gl.viewport( 0, 0, canvas.width, canvas.height )

  gl.clearDepth( 1 )
  gl.clearColor( 0, 0, 0, 0 )

  animate( 0 )


//: Functions
  function createShader( gl, type, source ) {
    const shader = gl.createShader( type )

    gl.shaderSource( shader, source )
    gl.compileShader( shader )

    return shader
  }

  function createProgram( gl, vertexShader, fragmentShader ) {
    const program = gl.createProgram()

    gl.attachShader( program, vertexShader )

    gl.attachShader( program, fragmentShader )
    gl.linkProgram( program )

    return program
  }

  function animate( time ) {
    let delay = time - lastFrameTime
    lastFrameTime = time
    
    matrix = webGLUtils.m4.zRotate( matrix, Math.PI/180 * multiplier )
    matrix = webGLUtils.m4.yRotate( matrix, Math.PI/180 * multiplier )
    matrix = webGLUtils.m4.xRotate( matrix, Math.PI/180 * multiplier )
    gl.uniformMatrix4fv( u_matrix, false, matrix )

    gl.clear( gl.COLOR_BUFFER_BIT )
    gl.drawArrays( gl.TRIANGLES, 0, arrays.drawable.length/3 )

    animateId = requestAnimationFrame( animate )
  }

  function wallsChanger() {
    data.indices = []

    if( Math.random() > .5 )
      data.indices.push(0,3,4,  3,4,7)

    if( Math.random() > .5 )
      data.indices.push(1,2,6,  1,6,5)

    if( Math.random() > .5 )
      data.indices.push(0,1,4,  4,5,1)

    if( Math.random() > .5 )
      data.indices.push(2,3,6,  3,6,7)

    setTimeout( wallsChanger, wallsChangerTime)
  }


//: