"use strict"

class RHashes {
/** Constructor */
  static init(totally=false) {
    let lasthashes = RHashes.hashes ? Object.assign(RHashes.hashes) : {}
    RHashes.hashes = {}
    let hashes = RHashes.hashes
    let funcs  = RHashes.onchangeFuncts || {}
    let hash   = window.location.hash ? window.location.hash.slice(1).split('#') : []

    for(let _variable of hash) {
      let variable = _variable.split('=')
      let property = variable[0]
      let value    = variable[1]

      if(!property) continue
      hashes[property] = value
    }

    if(funcs)
      for(let property in lasthashes)
        if(funcs[property]) {
          if(!hashes[property]) funcs[property](null)
          else if(hashes[property] != lasthashes[property]) funcs[property](hashes[property])
        }

    if(totally) RHashes.onchangeFuncts = {}
    if(hash.length) RHashes.build()
  }
/** */

/** Change RHashes.hash */
 /** Setter 
  * @param {String} property Hash property
  * @param {String} value Hash value to set
  */
  static set(property ,value='') {
    if(!property) return
    let hashes = RHashes.hashes
    let func   = RHashes.onchangeFuncts[property]

    if(hashes[property] === value) return
    else {
      if(func != undefined) func(value)
      hashes[property] = value
    }

    RHashes.build()
  }

 /** Deleter 
  * @param {String} property Hash property to delete
  */
  static del(property) {
    let hashes = RHashes.hashes
    let func   = RHashes.onchangeFuncts[property]

    if(hashes[property]) {
      if(func != undefined) func(null)
      delete hashes[property]
    }

    RHashes.build()
  }
/** */

 /** Getter 
  * @param {String} property Hash property
  */
  static get(property) {
    return RHashes.hashes[property]
  }

 /** Builder 
  */
  static build() {
    let hashes = RHashes.hashes
    let hash = ''
    
    for(let i in hashes) hash += `#${i}=${hashes[i]}`

    window.location.hash = hash
  }


 /** Changes handler 
  * @param {String} property Hash property
  * @param {String} func Function that is called after change
  */
  static onchange(property, func, immediately) {
    let events = RHashes.onchangeFuncts
    events[property] = func

    if(immediately) func(RHashes.hashes[property])
  }
}

/** Initializers */
  RHashes.init(true)
  window.addEventListener('hashchange', e => {
    RHashes.init()
  })
/** */