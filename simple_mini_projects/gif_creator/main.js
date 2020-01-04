// import https from "https";
// import fs from "fs";
// import { strict } from "assert";


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

document.querySelector( `#gif` ).appendChild( gif.getImgTag() )

// fs.writeFileSync( `test.gif`, Buffer.from( gif.bufferData, `hex` ) )

// console.log( new Png( fs.readFileSync( `test.png` ) ).data )