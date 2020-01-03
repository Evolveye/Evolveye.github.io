const gifHandler = document.querySelector( `#gif` )
const gif = new Gif( { w:`FF FF FF`, r:`FF 00 00`, b:`00 00 FF`, k:`00 00 00` }, [
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
] )

gifHandler.appendChild( gif.getImgTag() )