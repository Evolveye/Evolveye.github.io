// import https from "https";
// import fs from "fs";
// import { strict } from "assert";
import { Gif } from "./classes.js";
import { addElementToPage } from "../../js/importer.js";


//
// COMMENTS ARE FOR EASY COPY&PASTE TO NODE.JS
//


const gif = new Gif( { w:`FF FF FF`, r:`FF 00 00`, b:`00 00 FF`, k:`00 00 00` }, [
  [
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`w`,`w`,`w`,`w`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`w`,`w`,`w`,`w`,`b`,`b`,`b` ],
    [ `b`,`b`,`b`,`w`,`w`,`w`,`w`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`w`,`w`,`w`,`w`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
  ], [
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`r`,`r`,`b`,`b`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`k`,`k`,`k`,`k`,`b`,`b`,`b` ],
    [ `r`,`r`,`r`,`k`,`k`,`k`,`k`,`b`,`b`,`b` ],
    [ `b`,`b`,`b`,`k`,`k`,`k`,`k`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`k`,`k`,`k`,`k`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
    [ `b`,`b`,`b`,`b`,`b`,`r`,`r`,`r`,`r`,`r` ],
  ]
] )

const div = document.createElement( `div` )
const p = document.createElement( `p` )
const img = gif.getImgTag( 100, 100 )

p.style = `
  position: absolute;
  left: calc( 50% + 100px );
  top: 50%;
  transform: translateY( -50% );
  font-size: 10px;
`
p.innerHTML += `
const gif = new Gif( { w:"FF FF FF", r:"FF 00 00", b:"00 00 FF", k:"00 00 00" }, [
  [
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","w","w","w","w","b","b","b" ],
    [ "r","r","r","w","w","w","w","b","b","b" ],
    [ "b","b","b","w","w","w","w","r","r","r" ],
    [ "b","b","b","w","w","w","w","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
  ], [
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","r","r","b","b","b","b","b" ],
    [ "r","r","r","k","k","k","k","b","b","b" ],
    [ "r","r","r","k","k","k","k","b","b","b" ],
    [ "b","b","b","k","k","k","k","r","r","r" ],
    [ "b","b","b","k","k","k","k","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
    [ "b","b","b","b","b","r","r","r","r","r" ],
  ]
]
`.replace( /\n/g, `<br>` ).replace( / /g, `&nbsp;` )

div.appendChild( p )
div.appendChild( img )

addElementToPage( div )

// fs.writeFileSync( `test.gif`, Buffer.from( gif.bufferData, `hex` ) )
// console.log( new Png( fs.readFileSync( `test.png` ) ).data )