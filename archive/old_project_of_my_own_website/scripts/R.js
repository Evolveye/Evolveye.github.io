"use strict"


/** DOM editor */
  const echo = string => {
    let script = document.currentScript
    script.insertAdjacentHTML('beforebegin',string)
    script.currentScript.remove()
  }
  const setClass = string => {
    let script = document.currentScript
    script.previousElementSibling.className += string
    script.currentScript.remove()
  }
/** */

/** Array with "keydown" codes
 * @type {Number[]} 
 */
  const KEYS = []
  window.addEventListener('keydown' ,e => { KEYS[e.keyCode]=true  })
  window.addEventListener('keyup'   ,e => { KEYS[e.keyCode]=false })
/** */


/** Methods & prototypes */
  /** Console methods */
      console.R_i = (...data) => { console.info('%cINFO','color:royalblue; font-weight:bold;',...data) }
      console.R_w = (...data) => { console.info('%cWARN','color:red; font-weight:bold;',...data) }
      console.R_err = (...data) => {
        let logLineDetails = new Error().stack.split("at ")[2].split(':')
          , pathfile = logLineDetails[logLineDetails.length-3].split('/')
          , file = pathfile[pathfile.length-1]
          , line = logLineDetails[logLineDetails.length-2]
          , char = logLineDetails[logLineDetails.length-1].split(')')[0]
        console.info(`%c ERROR from ${file} (${line}:${char}) `,'color:white; font-weight:bold; background:red', ...data)
      }


  /** Element.prototype */
      Element.prototype.remove = function() {
        this.parentElement.removeChild(this)
      }
      Element.prototype.inClass = function(className) {
        let classes = this.className.split(' ')
        return classes.includes(className)
      }


  /** String.prototype */
      String.prototype.allIndexesOf = function(text) {
        let indexes = []
        let pos = this.indexOf(text)

        while(pos !== -1) {
          indexes.push(pos)
          pos = this.indexOf(text, pos + 1)
        }

        return indexes
      }
/** */


const R = {
  cache : {}
 ,library: {
    tags : ['textarea','nav']
  }
 ,translator : {
    storage : []
   ,dictionary : {}
  }
 ,tags : {
   __constructor(ele=null ,root=false) {
      let RTags
      if(ele) {
        if(root) 
             RTags = ele.querySelectorAll('[data-r]')
        else RTags = [ele]
      } else RTags = document.querySelectorAll('[data-r]')

      for(let tag of RTags) {
        let name = tag.getAttribute('name')

        if(!name) {
          tag.innerHTML = '<strong>Name of tag must be defined inside "name" attribute!</strong>'
          continue
        }

        tag.removeAttribute('name')
        name = name.replace(/\r?\n|\r|\s+/,'')
        let Rtag = tag.dataset.rTag || tag.nodeName.toLowerCase()

        if(!R.library.tags.includes(Rtag)) {
          tag.innerHTML = '<strong>That is not R tag!</strong>'
          continue
        }

        if(R.tags[Rtag]) {
          let config = {
            initializer : tag,
            name
          }
          R.tags[Rtag].__constructor(config)
        } else {
          tag.innerHTML = `<strong>Tag</strong> (${Rtag}) <strong> is not valid!</strong>`
        }
      }
    }
   ,textarea : {
     __constructor(config) {
        config.id = Object.keys(R.tags.textarea).length
        config.disabled = config.initializer.disabled
        config.text = config.initializer.value
            .split('\n')
            .filter(item => /\s+\|(.*)/.test(item) )
            .map(item => item.replace(/\s+\|/,'') )

        R.tags.textarea[`${config.id}_${config.name}`] = new RTextarea(config)
      }
    }
   ,nav : {
     __constructor(config) {
        config.scopes = config.initializer.querySelectorAll('ul')
        R.tags.nav[config.name] = new RNav(config)
      }
    }
  }
 ,Range : {
   get() {
      return window.getSelection().getRangeAt(0) || null
    }
   ,toSelection(range) {
      let sel = window.getSelection()

	    if(sel.rangeCount > 0) 
        sel.removeAllRanges()
      
      sel.addRange(range)

      return sel
    }
   ,create(node1,offset1 ,node2,offset2) {
        let offsets = {
          one : {node:node1,offset:offset1}
         ,two : {node:node2,offset:offset2}
        }

        for(let i in offsets) {
          while(offsets[i].node.nodeType != 3 && (offsets[i].node.textContent || offsets[i].offset)) {
            if(!offsets[i].node.textContent && offsets[i].offset) {
              offsets[i].node = offsets[i].node.nextSibling
              offsets[i].offset--
            } else offsets[i].node = offsets[i].node.firstChild
          }
          if(!offsets[i].node.textContent && !offsets[i].offset) continue

          while(offsets[i].node.data.length < offsets[i].offset) {
            offsets[i].offset -= offsets[i].node.data.length + 1
            offsets[i].node    = offsets[i].node.nextSibling

            while(offsets[i].node.nodeType != 3 && (offsets[i].node.textContent || offsets[i].offset)) {
              if(!offsets[i].node.textContent && offsets[i].offset) {
                offsets[i].node = offsets[i].node.nextSibling
                offsets[i].offset--
              } else offsets[i].node = offsets[i].node.firstChild
            }
          }
        }
        let range = document.createRange()
            range.setStart(offsets.one.node ,offsets.one.offset)
            range.setEnd(offsets.two.node ,offsets.two.offset)
            
        return range
    }
  }
 ,String : {
   allIndexesOf(string,text) {
    let indexes = []
    let pos = string.indexOf(text)

    while(pos !== -1) {
      indexes.push(pos)
      pos = string.indexOf(text, pos + 1)
    }

    return indexes
   }
  }
 ,Element : {
    inClass(ele ,className) {
        let classes = ele.className.split(' ')
        return classes.includes(className)
    }
  }
 ,Object : {
      classif(object ,nesting ,reverse=false) {
        // Variables
          let values = {}
            , sorted = []
            , points = {}
            , place  = {}
            , arr    = []
        // Convert object to array
          // I: {a:1 ,b:2 ,c:3}
          // O: [{name:a, num:1},{name:b, num:2},{name:c, num:3}]
          for(let i in object) sorted.push({name:i,num:this.getDeep(object[i],nesting)})

          // Sorting
          sorted.sort((l,r) => reverse ? l.num - r.num : r.num - l.num)

        // Object with values and their quantities
          for(let i of sorted) {
            if(!values[i.num]) values[i.num] = []
            values[i.num].push(sorted.indexOf(i))
          }

        // Set place of object keys
          place.helper = {last:0,place:0}
          for(let i of sorted) {
            if(place.helper.last != i.num) {
              place.helper.last = i.num
              ++place.helper.place
            }
            place[i.name] = place.helper.place ? place.helper.place : 1
          }
          delete place.helper

        // Set points of object keys
          points.length = sorted.length
          for(let i in values) {
            points.helper = 0 
            for(let j of values[i])
              points.helper += sorted.length - j

            points.helper /= values[i].length
            for(let j of values[i]) points[sorted[j].name] = points.helper
          }
          delete points.helper

        // Create place array
          for(name in place) {
            if(!arr[place[name]-1]) arr[place[name]-1] = []
            object[name]._name = name
            arr[place[name]-1].push( object[name] )
          }
        return {arr ,place ,points}
      }
     ,juxta(object ,nesting ,reverse=false) {
        // Variables
          let values = []
          let arr    = [] // arr[number][element] = how many
          let endObj = {}
          let helper = []

        // Get values
          for(let i in object) {
            let nums = this.getDeep(object[i],nesting)
            let juxObj = {_name:i,values:{}}
                juxObj.values = Object.assign({} ,nums)
            for(let num in nums) {
              if(!values.includes(num)) values.push(num)
              if(!arr[num]) arr[num] = {}
              arr[num][i] = nums[num]
            }
          }

        // Procesing
          values.sort( (a,b) => b-a)
          for(let element in object) // eleNum
            for(let number of values)
              if(arr[number][element]) {
                endObj[element] = number
                break
              }
          for(let element in object) {
            let place = 1
            let eleTest = []
            for(let number of values) {
              let _break = true

              if(eleTest.length) {
                for(let ele of eleTest) {
                  if(arr[number][ele] && !arr[number][element]) {
                    eleTest.splice( eleTest.indexOf(ele),1 )
                    ++place
                  }
                }
              }
              if(!arr[number][element]) continue
              for(let ele in arr[number]) {
                if(ele===element || (eleTest.length && !eleTest.includes(ele))) continue
                if(endObj[ele] > number && !eleTest.length) continue
                
                if(arr[number][ele] >  arr[number][element]) ++place
                if(arr[number][ele] == arr[number][element]) {
                  if(!eleTest.includes(ele)) eleTest.push(ele)
                  _break = false
                }
              }
              if(_break) break
            }
            if(!helper[endObj[element]]) helper[endObj[element]] = []
            if(!helper[endObj[element]][place-1]) helper[endObj[element]][place-1] = []
            helper[endObj[element]][place-1].push(element)
          }

        // Final operations
          helper = helper.filter( a => a!==undefined )
          if(!reverse)
            helper.reverse()

          if(reverse)
            for(let position of helper)
              position.reverse()

          let globalPlace = 1
          for(let position of helper) {
            for(let place of position) {
              for(let item of place) {
                endObj[item] = position.indexOf(place) + globalPlace
              }
            }
            globalPlace += position.length
          }

        return endObj
      }
     ,getDeep(object, path='') {
        let obj = object
        if(path.length > 0)
          for(let i=0, p=path.split('.'); i<p.length; i++) {
            obj = obj[p[i]];
          }

        return obj
      }
  }
 ,mktime(...timeData) {
    // Set variables
      let times=timeData ,format=''
  
      if(typeof timeData[timeData.length-1]==='string') {
        times = timeData.slice(0,-1)
        format = timeData[timeData.length-1]
      }
  
      let ms = times[0] || 0
        , s  = times[1] || 0
        , m  = times[2] || 0
        , h  = times[3] || 0
        , D  = times[4] || 1
        , M  = times[5] || 1
        , Y  = times[6] || 0

    // Error detector
      if(!M || !D) console.log('err')
      let DInM    = [31,null,31,30,31,30,31,31,30,31,30,31]
          DInM[1] = (Y % 4 == 0 && Y % 100 != 0 || Y % 400 == 0) ? 29 : 28
  
    // Processing
      s  += Math.floor(ms/1000)
      m  += Math.floor(s/60)
      h  += Math.floor(m/60)
      D  += Math.floor(h/24)
  
      M = Math.floor(M%12)===0 ? 12 : Math.floor(M%12)
      while(D > DInM[M-1]) {
        D -= DInM[M-1]
        ++M
        if(M > 12) {
          M = 1
          ++Y
          DInM[1] = (Y % 4 == 0 && Y % 100 != 0 || Y % 400 == 0) ? 29 : 28
        }
      }
      
      let _ms  = ms%1000
        , _s   = s%60
        , _m   = m%60
        , _h   = h%24
        , DInY = DInM[1]===28 ? 365 : 366
  
    // Return switch
      switch(format) {
        case 'milis':
          return (0
            + _ms
            + _s*1000
            + _m*1000*60
            + _h*1000*60*60
            +  D*1000*60*60*24
            +  M*1000*60*60*24*DInM[M-1]
            +  Y*1000*60*60*24*DInY
            )
        case '': return {DInY ,Y ,M ,D ,h:_h ,m:_m ,s:_s ,ms:_ms}
      }
  
    // Format converter
       //Nuff said...
  }
 ,getFile(src, scriptRemove=true, cb) {
      let script = document.currentScript
      let isSite = src.slice(0,4).toLowerCase() == 'http'
      let lang   = isSite ? 'www' : src.split(/\./g).splice(-1)[0].toLowerCase()
      let toDocHead
      let imported
      switch(lang) {
        case 'js':
          {
            let isCreated = document.querySelector(`script[href="${src}"]`)
            if(isCreated) {
              if(cb) cb(isCreated.textContent)
              return
            }

            imported = document.createElement('script')
            imported.src = src

            toDocHead = true
          }
        break

        case 'css':
        case 'htm':
        case 'html':
          {
            let isCreated = document.querySelector(`link[href="${src}"]`)
            if(isCreated) {
              if(cb) cb(isCreated.import)
              return
            }

            imported = document.createElement('link')
            if(lang == 'CSS') imported.rel = 'stylesheet'
            else imported.rel = 'import'
            imported.href = src

            toDocHead = true
          }
        break

        default:
          {
            if(!cb) return
            let xhttp = new XMLHttpRequest()
            xhttp.open("GET", src, true)

            xhttp.onreadystatechange = function(e) {
              if (this.readyState == 4 && this.status == 200) cb(this.responseText)
              else if (this.readyState == 1 && this.status == 404) cb(null)
            }

            xhttp.send()
          }
      }

      if(imported) {
        imported.onload = function(e) {console.log('diablo')
          if(cb) {
            if(lang == 'js') cb(this.textContent)
            else cb(this.import)
          } else if(lang==='html' || lang==='htm')
            script.insertAdjacentHTML('afterend', this.import.body.innerHTML)
            
          if(scriptRemove) script.remove()
        }
        console.dir(imported)
      }
      if(toDocHead) document.head.appendChild(imported)
  }
 ,getUrlParams(URL=window.location.search) {
      return (/\?/.test(URL) ? URL.split('?')[1] : '')
        .split('&')
        .reduce((params, param) => {
          let [ key ,value ] = param.split('=')
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : ''
          return params
        },{})
    }
 ,translate(language, path='.', root) {
    if(!language) return false

    let langIsExist  = language in R.translator.dictionary

    //*
    //* I checked this language
      if(langIsExist) {
        let dictionary = R.translator.dictionary[language]
        if(!dictionary) return false

        let items = document.querySelectorAll('[data-r-tr]')
        for(let item of items) {
          let key = item.dataset.rTr
          if(!key) continue

          //* It is scoped translation TODO
            if(key.startsWith('__')) {
             // Haven't translation
                if(!(key in dictionary)){
                 // Page translation
                    if(key.slice(-5) == '.html' || key.slice(-4) == '.htm') {
                      let xhttp = new XMLHttpRequest()
                      xhttp.open("GET", key.slice(2), true)
                      xhttp.onreadystatechange = function(e) {
                       // file exist
                          if (this.readyState == 4 && this.status == 200) {
                            let definition = JSON.stringify(this.responseText)
                            dictionary[key.slice(2)] = definition

                            R.translate(language, null, item)
                
                       // file not exist
                          } else if (this.readyState == 1 && this.status == 404)
                            dictionary[key.slice(2)] = false
                      }
                      xhttp.send()

                 // "Key : value" translation
                    } else {
                      let xhttp = new XMLHttpRequest()
                      xhttp.open("GET", `${key.slice(2)}.json`, true)
                      xhttp.onreadystatechange = function(e) {
                       // file exist
                          if (this.readyState == 4 && this.status == 200) {
                            let definition = JSON.parse(this.responseText)
                            for(let definition of definitions)
                              dictionary[`${key.slice(2)}__${definition}`] = definition
                            
                            R.translate(language, null, item)
                
                       // file not exist
                          } else if (this.readyState == 1 && this.status == 404)
                            dictionary[key.slice(2)] = false
                      }
                      xhttp.send()
                    }
             // Have translation
              } else {
                let scopedItems = item.querySelectorAll('[data-r-tr]')
                for(let scopedItem of scopedItems)
                  scopedItem.dataset.rTr = `${key.slice(2)}_|${scopedItem.dataset.rTr}`
              }

          //* It is NOT scoped translation
            } else {
              if(dictionary[key]) item.innerHTML = dictionary[key]
            }
        }

        return true

    //* I NOT checked this language
      } else {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", `${path}.json`, true)
        xhr.onreadystatechange = function(e) {
         // file exist
            if (this.readyState == 4 && this.status == 200) {
              let langs = JSON.parse(this.responseText)
              R.translator.storage.push(language)

              let dictionary = R.translator.dictionary
              for(let lang in langs) {
                dictionary[lang] = langs[lang]
                  for(let key in langs[lang]) dictionary[lang][key] = langs[lang][key]
              }

              R.translate(language)

         // file not exist
            } else if (this.readyState == 1 && this.status == 404)
              R.translator.dictionary[language] = false
        }
        xhr.send()
      }
    //*
  }
 ,ready(func) {
    if(!this.cache.whenReady) this.cache.whenReady = []
    this.cache.whenReady.push(func)
  }
}


document.addEventListener('DOMContentLoaded', e => {
  R.tags.__constructor()

  if(R.cache.whenReady) {
    let readyFuncs = R.cache.whenReady
    for(let readyFunc of readyFuncs) readyFunc()
    delete R.cache.whenReady
  }
})