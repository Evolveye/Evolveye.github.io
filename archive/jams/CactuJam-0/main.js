function templatePusher( templateId ) {
  let main = document.querySelector( `main` )
  let mainChildren = main.children
  let template = document.head.querySelector( `#${templateId}` ).content

  for (let element of mainChildren)
    element.remove()
    
  main.appendChild( template, true )

  start()
}