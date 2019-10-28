function random( min, max ) {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

function loop() {
  for (const { x, y } of points) {
    const angle = Math.atan2(vertexB[1] - vertexA[1],vertexB[0] - vertexA[0])
  }
}

document.addEventListener( `click`, ({clientX:x, clientY:y}) => {
  console.log( points.some( point => point.distTo({ x, y }) < 100 ) )
})