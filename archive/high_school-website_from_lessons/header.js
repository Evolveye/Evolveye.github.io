"use strict"

let DEBUG = false

const canvas = ele_canvas
const ctx    = canvas.getContext('2d')
const dots   = [].concat(
  [ // SKM
    {color:'firebrick' ,speed:6 ,track : [
      [-10,142],
      [950,320],
      [1250,335],
    ]},
    {color:'firebrick' ,speed:6 ,track : [
      [-19,142],
      [-10,142],
      [950,320],
      [1240,335],
    ]},
    {color:'firebrick' ,speed:6 ,track : [
      [-28,142],
      [-10,142],
      [950,320],
      [1230,335],
    ]},
    //
    {color:'blue' ,track : [
      [-10,142],
      [950,320],
      [1250,335],
    ]},
    {color:'blue' ,track : [
      [-19,142],
      [-10,142],
      [950,320],
      [1240,335],
    ]},
    {color:'blue' ,track : [
      [-28,142],
      [-10,142],
      [950,320],
      [1230,335],
    ]},
    //
    {color:'blue' ,speed:4 ,track : [
      [1250,335],
      [950,320],
      [-10,142],
    ]},
    {color:'blue' ,speed:4 ,track : [
      [1242,335],
      [950,320],
      [-10,142],
      [-17,142],
    ]},
    {color:'blue' ,speed:4 ,track : [
      [1234,335],
      [950,320],
      [-10,142],
      [-25,142],
    ]}
  ],
  [ // PKS
    {color:'green' ,track : [
      [290,-10],
      [413,170],
      [405,195],
      [210,133],
      [203,150],
      [230,165],
      [222,195],
      [330,220,3],

    ]},
    {color:'green' ,track : [
      [670,-10],
      [600,150],
      [577,235],
      [405,195],
      [210,133],
      [203,150],
      [230,165],
      [222,195],
      [330,220],
    ]},
    {color:'green' ,track : [
      [-10,473],
      [37,462],
      [42,462],
      [100,495],
      [120,495],
      [184,468],
      [230,455],
      [310,400],
      [400,375],
      [418,305],
      [300,300],
      [330,220],
    ]},
  ],
  [ // MZK
    {color:'royalblue' ,track : [
      [1250,310],
      [1175,310],
      [895,280],
      [730,262],
      [690,259],
      [400,195],
      [395,205],
      [440,215],
      [435,230],
      [410,225],
      [407,233],
      [330,220],
    ]},
    {color:'royalblue' ,track : [
      [-10,130],
      [60,140],
      [210,133],
      [203,150],
      [230,165],
      [222,195],
      [330,220],
      [300,300],
      [418,305],
      [386,450],
      [395,510],
    ]}
  ]
)

let sizeMultipler = 12.3
ctx.canvas.width  = sizeMultipler * 100
ctx.canvas.height = sizeMultipler * 41

let w = 25
let h = 10
function drawGrid() {
  ctx.lineWidth = 2
  for(let i = 1; i < h; i++) {
    if(!(i%4))
         ctx.strokeStyle = 'black'
    else ctx.strokeStyle = '#AAA'

    ctx.beginPath()
    ctx.moveTo(0,i*50)
    ctx.lineTo(canvas.width,i*50)
    ctx.stroke()
  }
  for(let i = 1; i < w; i++) {
    if(!(i%4))
         ctx.strokeStyle = 'black'
    else ctx.strokeStyle = '#AAA'

    ctx.beginPath()
    ctx.moveTo(i*50,0)
    ctx.lineTo(i*50,canvas.height)
    ctx.stroke()
  }
}

drawOnTrack()
function drawOnTrack() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  if(DEBUG) drawGrid()
  ctx.lineWidth = 1

  for(let dot of dots) {
    if(!('current' in dot)) dot.current = 0
    if(!('speed'   in dot)) dot.speed   = 2
    if(!('road'    in dot)) dot.road    = 0
    if(!('radius'  in dot)) dot.radius  = 5
    if(!('color'   in dot)) dot.color   = 'black'
    
    let vertexA = dot.track[dot.current]
    let vertexB = dot.track[dot.current+1] || dot.track[0]

    let A = vertexB[0] - vertexA[0]
    let B = vertexB[1] - vertexA[1]
    let angle = Math.atan2(vertexB[1] - vertexA[1],vertexB[0] - vertexA[0])

    if(DEBUG) {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.arc(vertexA[0] ,vertexA[1] ,4 ,0,2*Math.PI)
      ctx.arc(vertexB[0] ,vertexB[1] ,4 ,0,2*Math.PI)
      ctx.fill()
    }

    ctx.save()
    ctx.translate( vertexA[0] , vertexA[1] )

      if(DEBUG) {
        // ctx.globalCompositeOperation = 'destination-over'
        ctx.strokeStyle = 'firebrick'
        ctx.beginPath()
        ctx.moveTo(0,0)
        ctx.lineTo(0,100)
        ctx.moveTo(0,0)
        ctx.lineTo(100,0)
        ctx.stroke()
      }

      ctx.rotate( angle )

      if(DEBUG) {
        // ctx.globalCompositeOperation = 'destination-over'
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(0,0)
        ctx.lineTo(200,0)
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = dot.color
      ctx.beginPath()
      ctx.arc(dot.road ,0, dot.radius ,0,2*Math.PI)
      ctx.fill()
    ctx.restore()

    dot.road += dot.speed

    if(Math.abs(dot.road) > Math.sqrt(A*A + B*B)) {
      dot.road = 0
      if(dot.track[dot.current+2])
           dot.current++
      else dot.current = 0
    }
  }

  requestAnimationFrame(drawOnTrack)
}