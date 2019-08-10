"use strict"

/** Class of web code editors */
class RNav {
 /** Constructor
   * @param {String} name Name of textarea - Text
   * @param {{}} [config={}] Object with settings
   */
  constructor(config={}) {
    this.scopes = {}
    let RNav = document.createElement('nav')
        RNav.className = `RTag RNav ${config.name}`
        RNav.id = `RNav_${config.id}`

     // inside
        for(let scope of config.scopes) {
          let name = scope.getAttribute('name') || config.scopes.indexOf(scope)
          let title = scope.getAttribute('title') || name

          if(this.scopes[name]) continue

          scope.removeAttribute('name')
          scope.removeAttribute('title')
          scope.dataset.rNavName = `${name}`
          name = name.replace(/\r?\n|\r|\s+/,'_')

          let li = document.createElement('li')
              li.className = `title ${name}`
              li.innerHTML = title

          scope.insertAdjacentElement('afterbegin',li)
          this.scopes[name] = scope
          RNav.appendChild(scope)
        }
        
    this.ele = RNav

    if(config.initializer) {
      config.initializer.insertAdjacentElement('beforebegin',RNav)
      config.initializer.remove()
      delete config.initializer
    }
  }

 /** New item
   * @param {String} navName RNav name
   * @param {String} scopeName Scope name
   * @param {String} innerHTML HTML to inserted
   */
  static item_insert(navName ,scopeName ,innerHTML) {
    let nav = R.tags.nav[navName]
    if(!nav) {
      console.R_w(`RNav: We have not "${navName}" nav in storage!`)
      return
    }

    let scope = nav.scopes[scopeName]
    if(!scope) {
      console.R_w(`RNav: "${navName}" nav have not "${scopeName}" scope!`)
      return
    }

    let li = document.createElement('li')
        li.className = 'item'
        li.setAttribute('onclick',`RNav.item_active("${navName}",this)`)
        li.innerHTML = innerHTML

    scope.appendChild(li)
  }

 /** Change active element
   * @param {String} nav RNav name
   * @param {Element} item New active element
   */
  static item_active(navName ,item) {
    let nav = R.tags.nav[navName]
    if(!nav) {
      console.R_w(`RNav: We have not "${navName}" nav in storage!`)
      return
    }
    let oldActive = nav.ele.querySelector('li.item.active')
    if(oldActive) oldActive.className = "item"
    if(item) item.className = "item active"
  }

 /** Getter of navs scopes and items
   * @param {String} navName RNav name
   * @param {String} scopeName Scope name
   * @param {String|Number} itemData Number of child (counting from the top) or them text content
   */
  static get(navName ,scopeName=null ,itemData=null) {
    let nav = R.tags.nav[navName]
    if(!nav) return null
    else if(!scopeName) return nav

    let scope = nav.scopes[scopeName]
    if(!scope) return null
    else if(!itemData) return scope
    
    let itemType = typeof itemData
    let items = scope.children
    if(itemType == 'number') {
      let item = items[itemData - 1]
      if(!item) return null
      else return item

    } else if(itemType == 'string') {
      for(let item of items)
        if(item.textContent == itemData)
          return item
    }
  }
}