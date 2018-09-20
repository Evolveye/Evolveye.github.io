'use strict'

const blocks = [1,1,0,1,1,1,0,0,0,1]
const blockData = {
  size: 20
}
let wallsChangerTime = 50

//: Canvas
  const canvas = document.createElement( 'canvas' )
  canvas.width = 500
  canvas.height = 500

  header.insertAdjacentElement( 'afterend', canvas )

  const gl = canvas.getContext( 'experimental-webgl' )


//: Shaders
  const vertexShader = createShader( gl, gl.VERTEX_SHADER, `
    uniform mat4 projMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 moveMatrix;
    attribute vec4 position;

    attribute vec3 color;
    varying vec3 vColor;

    void main() {
      gl_Position = position * projMatrix * viewMatrix * moveMatrix;
      vColor = color;
    }
  ` )

  const fragmentSource = createShader( gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4( vColor, 1 );
    }
  ` )

  const shaderProgram = createProgram( gl, vertexShader, fragmentSource )


//: Data & association
  const data = {
    vertices: [
      .5,  .5,  .5,
      .5,  .5, -.5,
     -.5,  .5, -.5,
     -.5,  .5,  .5,
 
      .5, -.5,  .5,
      .5, -.5, -.5,
     -.5, -.5, -.5,
     -.5, -.5,  .5,
    ],
    indices: [],
    colors: [0,1,0,  1,0,0,  1,0,1,  0,0,1,  1,1,0,  1,1,1,  0,0,0,  0,1,1]
  }

  // Vertex buffer
  const vertexBuffer = gl.createBuffer()
  const a_coordinatesPos = gl.getAttribLocation( shaderProgram, 'position' )

  gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.vertices ), gl.STATIC_DRAW )
  gl.enableVertexAttribArray( a_coordinatesPos )
  gl.vertexAttribPointer( a_coordinatesPos, 3, gl.FLOAT, false, 0, 0 )
  gl.bindBuffer( gl.ARRAY_BUFFER, null )

  // Indices buffer
  const indicesBuffer = gl.createBuffer()

  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indicesBuffer )
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data.indices ), gl.STATIC_DRAW )
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null )

  // Colors buffer
  const colorsBuffer = gl.createBuffer()
  const a_colorPos = gl.getAttribLocation( shaderProgram, 'color' )

  gl.bindBuffer( gl.ARRAY_BUFFER, colorsBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.colors ), gl.STATIC_DRAW )
  gl.enableVertexAttribArray( a_colorPos )
  gl.vertexAttribPointer( a_colorPos, 3, gl.FLOAT, false, 0, 0 )
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null )

  // Transformations
  const u_projMatrix = gl.getUniformLocation( shaderProgram, 'projMatrix' )
  const   projMatrix = new Float32Array( [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1] )

  const u_viewMatrix = gl.getUniformLocation( shaderProgram, 'viewMatrix' )
  const   viewMatrix = new Float32Array( [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1] )

  const u_moveMatrix = gl.getUniformLocation( shaderProgram, 'moveMatrix' )
  const   moveMatrix = new Float32Array( [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1] )


//: Draw
  let lastFrameTime = 0
  let animateId = 0

  gl.useProgram( shaderProgram )

  gl.enable( gl.DEPTH_TEST )
  gl.depthFunc( gl.LEQUAL )
  gl.viewport( 0, 0, canvas.width, canvas.height )

  gl.clearDepth( 1 )
  gl.clearColor( 0, 0, 0, 0 )

  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indicesBuffer )
  animate( 0 )

  setTimeout( wallsChanger, wallsChangerTime)



//: Functions
  function rotateX( mat, angle ) {
    let cos = Math.cos( Math.PI / 180 * angle )
    let sin = Math.sin( Math.PI / 180 * angle )
    let mat1 = mat[1],  mat5 = mat[5],  mat9 = mat[9]

    mat[1]  = mat[1]  * cos - mat[2]  * sin
    mat[5]  = mat[5]  * cos - mat[6]  * sin
    mat[9]  = mat[9]  * cos - mat[10] * sin

    mat[2]  = mat[2]  * cos + mat1 * sin
    mat[6]  = mat[6]  * cos + mat5 * sin
    mat[10] = mat[10] * cos + mat9 * sin
  }

  function rotateY( mat, angle ) {
    let cos = Math.cos( Math.PI / 180 * angle )
    let sin = Math.sin( Math.PI / 180 * angle )
    let mat0 = mat[0],  mat4 = mat[4],  mat8 = mat[8]

    mat[0] = mat[0] * cos + mat[2]  * sin
    mat[4] = mat[4] * cos + mat[6]  * sin
    mat[8] = mat[8] * cos + mat[10] * sin

    mat[2]  = mat[2]  * cos - mat0 * sin
    mat[6]  = mat[6]  * cos - mat4 * sin
    mat[10] = mat[10] * cos - mat8 * sin
  }

  function rotateZ( mat, angle ) {
   let cos = Math.cos( Math.PI / 180 * angle )
   let sin = Math.sin( Math.PI / 180 * angle )
   let mat0 = mat[0],  mat4 = mat[4],  mat8 = mat[8]

   mat[0] = mat[0] * cos - mat[1] * sin
   mat[4] = mat[4] * cos - mat[5] * sin
   mat[8] = mat[8] * cos - mat[9] * sin

   mat[1] = mat[1] * cos + mat0 * sin
   mat[5] = mat[5] * cos + mat4 * sin
   mat[9] = mat[9] * cos + mat8 * sin
  }

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

    rotateX( moveMatrix, delay*.02 )
    rotateY( moveMatrix, delay*.04 )
    rotateZ( moveMatrix, delay*.04 )

    gl.uniformMatrix4fv( u_projMatrix, false, projMatrix )
    gl.uniformMatrix4fv( u_viewMatrix, false, viewMatrix )
    gl.uniformMatrix4fv( u_moveMatrix, false, moveMatrix )
    
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indicesBuffer )
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data.indices ), gl.STATIC_DRAW )

    gl.clear( gl.COLOR_BUFFER_BIT )
    gl.drawElements( gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0 )

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