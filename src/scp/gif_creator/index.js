import React from "react"

import Gif from "./class"

export const title = {
  en: `Gif creator`,
  pl: `Kreator gifów`,
}

export const description = {
  pl: `Prosty kreator gifów stworzony gdy chciałem zrozumieć jak zbudowany jest format plików .gif`,
  en: `Simple GIFs creator made when I wanted to learn how are builded .gif files formats`,
}

export const getComponent = () => {
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

  const divStyle = {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    height: `100%`,
  }
  const pStyle = {
    fontSize: `10px`,
    fontFamily: `monospace`,
    whiteSpace: `break-spaces`,
    letterSpacing: `1px`
  }

  return <>
    <div style={divStyle}>
      <img src={gif.getSrc()} alt="Generated from array GIF" width={100} height={100} style={{ imageRendering:`pixelated` }} />
      <p style={pStyle}>
        {
          `
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
          `
        }
      </p>
    </div>
  </>
}