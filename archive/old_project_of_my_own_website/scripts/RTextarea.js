"use strict"

/** Class of web code editors */
class RTextarea {
 /** Constructor
   * @param {{}} [config={}] Object with settings
   */
  constructor(config={}) {
   // General CSS
      if(!document.querySelector('style.RTextarea_generalCSS')) {
        let generalCSS = document.createElement('style')
            generalCSS.className = 'RTextarea_generalCSS'
            generalCSS.textContent = `
              .RTextarea {
                position: relative;
                max-width: 100%;
                min-width: 450px;
                width: min-content;
                background-color: white;
                border: 1px solid #E0E0E0;
                counter-reset: RTextarea_lines;
                --scrollbar-color: rgb(241, 241, 241);
                --scrollbar-thumb-color: rgb(193, 193, 193);
                --caret: #111;
                --fat: #DFF;
              }
                  .RTextarea * {
                    margin: 0;
                    padding: 0;
                    border: none;
                    box-sizing: border-box;
                  }
                  .RTextarea *:focus {
                    outline: none;
                    font-family: inherit;
                  }
                  .RTextarea .editor {
                    background-color: inherit;
                    position: relative;
                    font-family: monospace;
                    height: 100%;
                    overflow: auto;
                    resize: both;
                  }
                      .RTextarea .editor::-webkit-scrollbar {
                        width: 10px;
                        height: 10px;
                        background-color: var(--scrollbar-color);
                      }
                      .RTextarea .editor::-webkit-scrollbar-thumb {
                        background-color: var(--scrollbar-thumb-color)
                      }
                      .RTextarea .lines {
                        min-width: 2em;
                        padding: 5px;
                        min-height: 100%;
                      }
                          .RTextarea .line {
                            position: relative;
                            z-index: 5;
                          }


                      .RTextarea .linesnums {
                        background-color: whitesmoke;
                        border-right: 1px solid #E0E0E0;
                        font-family: inherit;
                        color: #999;
                        position: sticky;
                        left: 0;
                        padding: 5px 0;
                        min-height: 100%;
                        text-align: center;
                        float: left;
                        z-index: 6;
                        min-width: 2em;
                      }
                          .RTextarea .num {
                            font-family: inherit;
                            display: block;
                          }
                

                      .RTextarea .rangeEntity {
                        position: absolute;
                        display: block;
                      }
                          .RTextarea .fatRanges .rangeEntity {
                            border-left: 2px solid var(--fat);
                            border-radius: 2px;
                          }
                          .RTextarea .carets .rangeEntity {
                            border-left: 2px solid var(--caret);
                            z-index: 1;
                          }


                  .RTextarea .invisible {
                    position: absolute;
                    overflow: auto;
                  }
                      .RTextarea .invisible * {
                        position: absolute;
                      }
                      .RTextarea.helpline
            `
        document.head.appendChild(generalCSS)
      }

   // DOM
      let RTextarea  =  document.createElement('div')
          RTextarea.className = `RTag RTextarea ${config.name}`
          RTextarea.id = `RTextarea_${config.id}`

       // Structure
          let invisible = document.createElement('div')
              invisible.className = 'invisible editor'

           // Inside invisible
              let helpline    =  document.createElement('pre')
                  helpline.className = 'helpline'

              let textHandler =  document.createElement('textarea')
                  textHandler.className = 'textHandler'

              invisible.appendChild(helpline)
              invisible.appendChild(textHandler)

          let topbar    = document.createElement('div')
              topbar.className = 'topbar'

          let editor    = document.createElement('div')
              editor.className = 'editor'
              editor.tabIndex  = 1

           // Inside editor
              let linesnums = document.createElement('div')
                  linesnums.className = 'linesnums'

              let fatRanges = document.createElement('div')
                  fatRanges.className = 'fatRanges'

              let carets    = document.createElement('div')
                  carets.className = 'carets'

              let lines     = document.createElement('div')
                  lines.className = 'lines'

              editor.appendChild(linesnums)
              editor.appendChild(lines)
              editor.appendChild(fatRanges)
              editor.appendChild(carets)

          RTextarea.appendChild(invisible)
          RTextarea.appendChild(editor)
          RTextarea.appendChild(topbar)

      if(config.initializer) {
        config.initializer.insertAdjacentElement('beforebegin',RTextarea)
        config.initializer.remove()
        delete config.initializer
      }

   // Individual CSS
      let computedCSS = window.getComputedStyle(editor)
      config.fontSize = Number(computedCSS.fontSize.slice(0,-2))
      let individualCSS = document.createElement('style')
          individualCSS.className = 'RTextarea_individualCSS'
          individualCSS.textContent = `
            #RTextarea_${config.id} {
              font-size: ${config.fontSize}px;
              line-height: ${config.fontSize}px;
            }

            #RTextarea_${config.id} * {
              user-select: ${config.disabled ? 'inherit' : 'none'};
            }

            ${!config.disabled ? `
            #RTextarea_${config.id} .editor *::-moz-selection {
              background: transparent;
            }
            #RTextarea_${config.id} .editor *::selection {
              background: transparent;
            }
            ` : ''}

            #RTextarea_${config.id} .num,
            #RTextarea_${config.id} .line {
              min-height: ${config.fontSize + 2}px;
              max-height: ${config.fontSize + 2}px;
            }

            #RTextarea_${config.id} .line {
              user-select: ${config.disabled ? 'inherit' : 'text'};
            }

            #RTextarea_${config.id} .rangeEntity {
              height: ${config.fontSize + 2}px;
            }

            #RTextarea_${config.id} .invisible {
              font-size: ${config.fontSize}px;
            }
          `
      RTextarea.appendChild(individualCSS)

   // Events
      if(!config.disabled) {
        textHandler.oninput = e => {
          if(this.cache.keyGuard) {
            this.textInsert(textHandler.value)
            this.keyAfter()
          }
        }
  
        document.addEventListener('mouseup', e => {
          if(document.activeElement == editor)
            textHandler.focus()
        })
  
        RTextarea.onkeydown = e => {
          this.cache.keyGuard = false
  
          if(/^(17|18)$/.test(e.which)) e.preventDefault()
  
          if(this.keyDataCheck(e.which)) {
            this.cache.keyGuard = true
            textHandler.value = ''
            textHandler.focus()
          } else {
            this.keyAfter()
            this.range_show()
          }
        }
  
        document.addEventListener('mousedown' ,e => {
          if(document.body.dataset.rTextarea == 'selection protection') {
            delete document.body.dataset.rTextarea
            document.body.style.userSelect = 'auto'
          }
        })
  
        editor.onselectstart = e => {
          if(KEYS[18] && this.range_last) {
            this.range_modify(this.range_last ,'add')
          } else this.ranges = []
        }
  
        document.addEventListener('selectionchange' ,e => {
          if(document.activeElement != editor && document.activeElement != textHandler) {
            let rangeEntities = this.editor.querySelectorAll('i.rangeEntity')
            for(let i of rangeEntities) i.remove()
          }
  
          if(document.activeElement != editor) return
  
          document.body.dataset.rTextarea = 'selection protection'
          document.body.style.userSelect = 'none'
          editor.style.userSelect = 'text'
  
          this.range_last = this.range_create(0)
          this.range_show()
        })
      }

   // this.
      this.ele          =  RTextarea
      this.editor       =  editor
      this.linesnums    =  linesnums
      this.lines        =  lines
      this.helpline     =  helpline
      this.textHandler  =  textHandler
      this.fatRanges    =  fatRanges
      this.carets       =  carets
      this.ranges       =  []
      this.range_last   =  []
      this.cache        =  {}
      this.config       =  {
        creating : true
       ,caretTime : 5
      }
   // Conditions / config
      if(config.keybinding) {
        this.bindedKeys = {
        }
        console.R_i('keybinding is currently do not working')
      }

      if(config.shortcuts) {
        this.shortcuts = {
        }
        console.R_i('keybinding is currently do not working')
      }

      if(config.rangeTypes) {
        console.R_i('rangeTypes is currently do not working')
      }

      if(config.text) {
        for(let line of config.text)
          this.line_create({text:line})
      } else this.line_create()

      setInterval(() => { this.caretGleaming() },100)
      this.lines.style.marginLeft = `${this.linesnums.offsetWidth}px`
      // this.editor.style.height = `${this.line_get('count') * 18 + 10}px`
      // this.editor.style.height = `${this.editor.scrollHeight}px`
      this.config.creating = false
  }
 /** */

 /** Keys & text */
   /** Key data check
     * @param {Number} keycode Pressed key keycode
     */
    keyDataCheck(keycode) {
        let state = false
        let ranges = this.ranges
        let ctrl = false

        if(KEYS[17]) {
          state = true
          switch(keycode) {
            case 86: // V
              // It's automatically
            break
            case 67: // C
            case 88: // X
              this.textHandler.value = this.range_get('selected')
              this.textHandler.select()
              document.execCommand("copy")
              if(keycode == 88) this.textInsert()
            break
            case 65: // A
              this.ranges = []
              this.range_last = this.range_create(0
                ,{first:1 ,last:this.line_get('count')}
                ,{start:'start',end:'end'}
              )
              this.range_show()
            break
            default: state = false
          }
        } else {
          switch(keycode) {
            case 37: //left
              this.range_modify('all', 'changePos', {extend:KEYS[16] ,offset:-1})
            break
            case 38: //up
              this.range_modify('all', 'changePos', {extend:KEYS[16] ,line:1})
            break
            case 39: //right
              this.range_modify('all', 'changePos', {extend:KEYS[16] ,offset:1})
            break
            case 40: //down
              this.range_modify('all', 'changePos', {extend:KEYS[16] ,line:-1})
            break
            case 8: //backspace
              this.range_modify('all', 'changePos', {extend:true ,offset:-1})
              this.textInsert()
            break
            case 46: //delete
              this.range_modify('all', 'changePos', {extend:true ,offset:1})
              this.textInsert()
            break
            case 36: //home
              this.range_modify('all', 'changePos', {offset:'start line'})
            break
            case 35: //end
              this.range_modify('all', 'changePos', {offset:'end line'})
            break
            default: state =  true
          }
        }

     return state
    }

   /** Operations after onkeydown
     */
    keyAfter() {
        let ranges = this.ranges
        let carets = this.carets.querySelectorAll('i.rangeEntity')

        if(carets.length == 1) {
          let caret = {
            top    : -10 + carets[0].offsetTop
           ,bottom :  10 + carets[0].offsetTop + carets[0].offsetHeight
           ,left   : -10 + carets[0].offsetLeft - this.linesnums.offsetWidth
           ,right  :  10 + carets[0].offsetLeft + carets[0].offsetWidth
          }
          let editor = {
            top    : this.editor.scrollTop
           ,bottom : this.editor.scrollTop + this.editor.clientHeight
           ,left   : this.editor.scrollLeft
           ,right  : this.editor.scrollLeft + this.editor.clientWidth
          }
          if(caret.bottom > editor.bottom) this.editor.scrollTop = caret.bottom - this.editor.clientHeight
          else if(caret.top < editor.top)  this.editor.scrollTop = caret.top
          else if(caret.right > editor.right) this.editor.scrollLeft = caret.right - this.editor.clientWidth
          else if(caret.left < editor.left)   this.editor.scrollLeft = caret.left
        }
        this.textColoring()
        this.lines.style.marginLeft = `${this.linesnums.offsetWidth}px`
    }

   /** Text inserter
     * @param {String} [text=''] String to insert to ranges
     */
    textInsert(data='') {
     // Variables
        let ranges    = this.ranges
        let text      = data.split(/\n/)
        let fTxtLine  = text[0]
        let nTxtLines = text.slice(1).reverse()
        let allRanges = this.ranges.concat(this.range_last)
        let position  = /(left|right)/.test(data.pos) ? data.pos : 'left'

     // Loop
        for(let range of allRanges) {
          let its       = 'start'

          if(range.end < range.start)
              its       = 'end'

          let next      = its == 'start' ? 'end' : 'start'
          let me        = {start:{} ,end:{}}
          let allRanges_copy = allRanges.slice()

          me[its] = {line:range.line ,offset:range.start}
          for(let aRange of allRanges_copy) {
            if(aRange.id != range.id) continue
            if(aRange.end >= 0 && aRange.end < Number.MAX_VALUE) {
              me[next].line = aRange.line
              me[next].offset = aRange.end
            }
            if(aRange.line != range.line)
              allRanges.splice(allRanges.indexOf(aRange),1)
          }

          for(let aRange of allRanges) {
            if(aRange.id == range.id || aRange.line < me.end.line) continue

            if(aRange.line == me.end.line && (aRange.start >= me.end.offset || aRange.end >= me.end.offset)) {
              if(aRange.start >= me.end.offset && aRange.start < Number.MAX_VALUE) {
                if(nTxtLines.length)
                     aRange.start = nTxtLines[0].length + (aRange.start - me.end.offset)
                else aRange.start = fTxtLine.length + me.start.offset + (aRange.start - me.end.offset)
              }
              if(aRange.end >= me.end.offset && aRange.end < Number.MAX_VALUE) {
                if(nTxtLines.length)
                     aRange.end = nTxtLines[0].length + (aRange.end - me.end.offset)
                else aRange.end = fTxtLine.length + me.start.offset + (aRange.end - me.end.offset)
              }
              aRange.line -= me.end.line - me.start.line - nTxtLines.length
            } else if(aRange.line > me.end.line) {
              aRange.line -= me.end.line - me.start.line - nTxtLines.length
            }
          }

          if(nTxtLines.length) {
            range.start = range.end = nTxtLines[0].length
            range.line += nTxtLines.length
          } else if(position == 'left' || fTxtLine.length){
            range.start = range.end = me.start.offset + fTxtLine.length
            range.line  = me.start.line
          } else if(position == 'right'){
            range.start = range.end = me.end.offset + fTxtLine.length
            range.line  = me.end.line
          }

          me.start.ele  = this.line_get(me.start.line)
          let txtBef = me.start.ele.textContent.slice(0,me.start.offset)
          let txtAft = this.line_get(me.end.line).textContent.slice(me.end.offset)
          me.start.ele.textContent = `${txtBef}${fTxtLine}`

          for(let i = me.start.line + 1; i <= me.end.line; ++i)
            this.line_delete(me.start.line + 1)

          for(let txt of nTxtLines)
            this.line_create({
              nr   : me.start.line + 1
             ,text : txt
            })

          this.line_get(range.line).textContent += txtAft
        }

     // Recreate ranges
        this.ranges = []
        this.range_last = []
        for(let range of allRanges) {
          if(range.id == 0)
               this.range_last.push(range)
          else this.ranges.push(range)
        }

     // Show ranges
        this.range_show()
    }

   /** Text coloring
     * @param {Number} line Line to coloring
     */
    textColoring(line=null) {
      //
    }
 /** */

 /** Lines */
   /** Create
     * @param {{ nr:Number  ,text:String }} [data={}] Optional line data
     */
    line_create(data) {
     // variables
        let lines    =  this.line_get('count')
        let nr       =  data.nr    ||  lines + 1
        let text     =  data.text  ||  ''
        let classes  =  typeof data.classes === 'array' ? data.classes.join(' ') : ''

        if(nr > lines)
          nr = lines + 1

     // Insert line
        let line = document.createElement('pre')
            line.className = `line ${classes}`
            line.textContent = text

        if(nr <= 1) {
          this.lines.insertAdjacentElement('afterbegin',line)
        } else {
          this.line_get()[nr-2].insertAdjacentElement('afterend',line)
        }
        
     // Insert number of line
        let linenum = document.createElement('span')
            linenum.className = 'num'
            linenum.textContent = lines + 1

        this.linesnums.appendChild(linenum)
    }

   /** Delete
     * @param {Number} num Number of line to remove
     */
    line_delete(num) {
      this.line_get(num).remove()
      this.linesnums.lastChild.remove()
    }

   /** Get data
     * @param {Number | "count"} [num=Null] What have to be returned
     * @return {HTMLElement | HTMLElement[] | Number} Specific line, all lines or number of lines
     */
    line_get(num) {
     // if num=null return lines array
        if(num==null) return this.lines.children
          
     // if num=='count' return number of lines
        if(num == 'count') return this.lines.children.length
          
     // if num==Number return lines[num]
        if(typeof num == 'number') {
          let lines = this.lines.children

          if(num < 1 || num > this.lines.children.length) return null

          return lines[num - 1]
        }
    }
 /** */

 /** Range */
   /** Caret gleaming
     */
    caretGleaming() {
      if(!this.cache.caretTime) {
        if(this.carets.style.visibility == 'visible')
             this.carets.style.visibility = 'hidden'
        else this.carets.style.visibility = 'visible'

        this.cache.caretTime = this.config.caretTime
      }
      --this.cache.caretTime
    }

   /** Create and return
     * @param {{ first:Number  ,last:Number }} lines First and last line
     * @param {{ start:Number  ,end:Number }} offsets Start and end offset
     */  
    range_create(id=Math.random() ,lines={} ,offsets={}) {
     // Variables
        let sel      = window.getSelection()
          , docRange = document.createRange()

          , startline = sel.anchorNode
          , endline   = sel.focusNode
          , helpline

          , Fnr
          , Lnr
          , Foffset
          , Loffset

          , range = []

     // Start/end elements
        if(typeof lines.first == 'number') {
         // general
            let linesCount  = this.line_get('count')
            let lines_first = lines.first
            let lines_last  = lines.last || lines.first

            if(lines_first > linesCount) lines_first = linesCount
            else if(lines_first < 1) lines_first = 1

            if(lines_last > linesCount) lines_last = linesCount
            else if(lines_last < 1) lines_last = 1

         // startline and start offset
            startline = this.line_get(lines_first)

            switch(offsets.start) {
              case 'start': offsets.start = 0
              break
              case 'end':   offsets.start = startline.textContent.length
              break
              default:
                if(offsets.start < 0) {
                  let prevLine = this.line_get(lines.first - 1)
                  if(prevLine) {
                    startline = prevLine
                    offsets.start = prevLine.textContent.length
                  } else {
                    offsets.start = 0
                  }
                }

                if(offsets.start > startline.textContent.length) {
                  let nextLine = this.line_get(lines_first + 1)
                  if(nextLine && offsets.start == Number.MAX_VALUE) {
                    startline = nextLine
                    offsets.start = 0
                  } else {
                    offsets.start = startline.textContent.length
                  }
                }
            }

            Foffset = offsets.start

         // endline and end offset
            endline = this.line_get(lines_last)

            switch(offsets.end) {
              case 'start': offsets.end = 0
              break
              case 'end':   offsets.end = endline.textContent.length
              break
              default:
                if(offsets.end < 0) {
                  let prevLine = this.line_get(lines_last - 1)
                  if(prevLine) {
                    endline  = prevLine
                    offsets.end = prevLine.textContent.length
                  } else {
                    offsets.end = 0
                  }
                }

                if(offsets.end > endline.textContent.length) {
                  let nextLine = this.line_get(lines_last)
                  if(nextLine && offsets.end == Number.MAX_VALUE) {
                    endline = nextLine
                    offsets.end = 0
                  } else {
                    offsets.end = endline.textContent.length
                  }
                }
            }

            Loffset = offsets.end

        } else try {

            while(startline.nodeName !== 'PRE' || !R.Element.inClass(startline,'line')){
              startline = startline.parentElement
            }
            while(endline.nodeName !== 'PRE' || !R.Element.inClass(endline,'line')){
              endline = endline.parentElement
            }
            
            docRange.selectNodeContents(startline)
            docRange.setEnd(sel.anchorNode, sel.anchorOffset)
            Foffset = docRange.toString().length

            docRange.selectNodeContents(endline)
            docRange.setEnd(sel.focusNode, sel.focusOffset)
            Loffset = docRange.toString().length

        } catch(err) {
          //console.log(err)
          return []
        }
     // Line numbers
        Fnr = Array.prototype.indexOf.call(this.line_get(), startline) + 1
        Lnr = Array.prototype.indexOf.call(this.line_get(), endline) + 1

     // Range creator
        if(Fnr < Lnr) {

          range.push({id   ,line:Fnr ,start:Foffset  ,end:Number.MAX_VALUE})
          for(let nr=Fnr+1; nr < Lnr; nr++)
            range.push({id ,line:nr  ,start:-1       ,end:Number.MAX_VALUE})
          range.push({id   ,line:Lnr ,start:-1       ,end:Loffset})

        } else if(Fnr > Lnr) {

          range.push({id   ,line:Fnr ,start:Foffset            ,end : -1})
          for(let nr=Fnr-1; nr > Lnr; nr--)
            range.push({id ,line:nr  ,start: Number.MAX_VALUE  ,end : -1})
          range.push({id   ,line:Lnr ,start:Number.MAX_VALUE   ,end : Loffset})

        } else
          range.push({id ,line:Fnr ,start:Foffset ,end:Loffset})

     return range
    }

   /** Modify
     */  
    range_modify(what ,action ,data={}) {
      switch(what) {
        case 'all':
        case 'ranges':
          {
            let id = this.range_get('count')
            while(--id) {
              let newRange = this.range_modify( this.range_get('range',id) ,action,data)
              if(newRange) this.range_modify(newRange,'replace')
            }
          }
        if(what != 'all') return
        case 'current':
          {
            let newCurrent = this.range_modify( this.range_last ,action,data)
            if(newCurrent) this.range_last = newCurrent
          }
        return
      }

      switch(action) {
        case 'add':
          {
            let id         = this.range_get('count')
            let ranges     = this.ranges
            let additional = data=='additional' ? '' : 'delete'

            this.range_modify(what ,'test', additional)

            for(let nRange of what) {
              let toPush = Object.assign(nRange)
              toPush.id = id
              ranges.push(toPush)
            }
          }
        break
        case 'delete':
          {
            let ranges = this.ranges
            let ranges_copy = ranges.slice()
            for(let range of ranges_copy)
              if(range.id == what) ranges.splice(ranges.indexOf(range),1)
          }
        break
        case 'replace':
          {
            let ranges = this.ranges
            let ranges_copy = ranges.slice()
            let id = what[0].id
            for(let range of ranges_copy)
              if(range.id == id) ranges.splice(ranges.indexOf(range),1)
            
            for(let range of what)
              ranges.push(range)
          }
        break
        case 'changePos':
          {
            let line   = data.line   || 0
            let offset = data.offset || 0
            let first  = what[0]
            let last   = what[what.length - 1]
            let isFat  = what[0].start != what[0].end
            let extend = data.extend
            let specialOffset

            switch(offset) {
              case 'start line': specialOffset = 'start'
              break
              case 'end line':   specialOffset = 'end'
              break
            }

            if(extend) {
              let finalOffset = specialOffset || last.end + offset
              what = this.range_create(what[0].id
               ,{first:first.line ,last:last.line - line}
               ,{start:first.start ,end:finalOffset}
              )
            } else if(isFat) {
              let finalOffset = specialOffset || first.start
              what = this.range_create(what[0].id
               ,{first:first.line - line}
               ,{start:finalOffset ,end:finalOffset}
              )
            } else {
              let finalOffset = specialOffset || first.start + offset
              what = this.range_create(what[0].id
               ,{first:first.line - line}
               ,{start:finalOffset ,end:finalOffset}
              )
            }

            return what
          }
        break
        case 'test':
          {
            //console.error(what,action,data)
            let ranges = this.ranges
            let state  = false
            for(let range of ranges)
              for(let tRange of what) { // tested range
                if(tRange.line != range.line) continue
                let a = 'start'
                  , b = 'end'

                if(tRange.start > tRange.end) {
                  b = 'start'
                  a = 'end'
                }

                // newRange : {}
                // oldRange : []
                if(tRange[a] > range.start) { // e[ ]s[ ]e a{ ]e }b ]e
                  if(tRange[a] > range.end) { // e[ ]s[ ]e a{ }b
                    state = true
                  } else { // s[ a{ ]e }b ]e
                    if(tRange[a] > range.end) { // s[ a{ ]e }b

                        if(data == 'update') {
                          range.end = range.start
                          range.start = tRange[a]
                        } else if(data == 'delete') {
                          this.range_modify(range.id,'delete')
                        }

                    } else { // s[ a{ }b ]e

                        if(data == 'update') {
                          // Nuff said...
                        } else if(data == 'delete') {
                          this.range_modify(range.id,'delete')
                        }

                    }
                  }
                } else { // e[ a{ e[ ]s[ ]e[ }b ]e[ ]s[ ]e
                  if(tRange[b] > range.start) { // e[ a{ e[ ]s[ ]e }b ]e
                    if(tRange[a] > range.end) { // e[ a{ e[ ]s[ ]e }b
                      if(tRange[b] > range.end) { // e[ a{ ]s }b

                          if(data == 'update') {
                            range.start = range.end
                            range.end = tRange[a]
                          } else if(data == 'delete') {
                            this.range_modify(range.id,'delete')
                          }

                      } else { // a{ e[ ]s[ ]e }b

                          if(data == 'update') {
                            range.start = tRange[b]
                            range.end = tRange[a]
                          } else if(data == 'delete') {
                            this.range_modify(range.id,'delete')
                          }

                      }
                    } else { // a{ s[ }b ]e

                        if(data == 'update') {
                          range.start = tRange[b]
                        } else if(data == 'delete') {
                          this.range_modify(range.id,'delete')
                        }

                    }
                  } else { // e[ a{ e[ }b e[ ]s[ ]e
                    if(tRange[b] < range.end) { // a{ }b e[ ]s[ ]e
                      state = true
                    } else { // e[ a{ e[ }b ]s
                      if(tRange[b] > range.end) { // e[ a{ }b ]s
                      
                          if(data == 'update') {
                            // Nuff said...
                          } else if(data == 'delete') {
                            this.range_modify(range.id,'delete')
                          }

                      } else { // a{ e[ }s ]s

                          if(data == 'update') {
                            range.start = tRange[b]
                            range.end = tRange[a]
                          } else if(data == 'delete') {
                            this.range_modify(range.id,'delete')
                          }

                      }
                    }
                  }
                }
              }
            return state
          }

        break
      }
    }
    
   /** Get
    * @param {String} what What u want
    * @param {Number} id Id of range
    */  
    range_get(what,id) {
      let toReturn

      switch(what) {
        case 'count':
          {
            let ranges   = this.range_get()
            toReturn = 0

            for(let range of ranges)
              if(range.id > toReturn) toReturn = range.id

            ++toReturn
          }
        break
        case 'range':
          {
            let ranges   = this.ranges
            toReturn = []
            if(id == 0) toReturn = this.range_last
            else for(let range of ranges)
              if(range.id == id) toReturn.push(range)
          }
        break
        case 'selected':
          {
            toReturn = ''
            let selected = {}
            let ranges = this.ranges.concat(this.range_last)

            for(let range of ranges) {
              let firstOff = range.start
              let lastOff  = range.end
              if(firstOff > lastOff) {
                firstOff = range.end
                lastOff  = range.start
              }
              if(firstOff < 0) firstOff = 0
              if(lastOff == Number.MAX_VALUE) lastOff = undefined

              if(!selected[range.line]) selected[range.line] = []
              selected[range.line].push(`${this.line_get(range.line).textContent.slice(firstOff,lastOff)}${lastOff == undefined ? "\n" : ''}`)
            }

            for(let line in selected)
              for(let text of selected[line])
                toReturn += text
          }
        break
        default:
          {
            let cache = this.range_last
            this.range_modify(cache,'test','delete')
            toReturn = this.ranges.slice()

            for(let cRange of cache) {
              toReturn.push(cRange)
            }
          }
      }

      return toReturn
    }

   /** Show
     */  
    range_show() {
     // Variables & cleaning
        let ranges        = this.range_get()
          , docRange      = document.createRange()
          , helpline      = this.helpline
          , rangeEntities = this.editor.querySelectorAll('i.rangeEntity')
          , rangeEntity   = document.createElement('i')
            rangeEntity.className = 'rangeEntity'

        for(let i of rangeEntities) i.remove()

     // Ranges iterator
        for(let range of ranges) {
         // Variables
            let width = 0
            let line  = this.line_get(range.line)
            let lineHTML = line.innerHTML

            let firstOff = range.start
            let lastOff  = range.end
            if(firstOff > lastOff) {
              firstOff = range.end
              lastOff  = range.start
            }

            let start = firstOff
            let end   = lastOff
            if(firstOff < 0) { start = 0 } else if(firstOff == Number.MAX_VALUE) { start = line.textContent.length }
            if(lastOff  < 0) { end   = 0 } else if(lastOff  == Number.MAX_VALUE) { end   = line.textContent.length }

            rangeEntity.style.top = `${line.offsetTop}px`
            helpline.textContent = line.textContent
            docRange.selectNodeContents(helpline)

         // Caret
            if(range.end >= 0 && range.end < Number.MAX_VALUE) {
              if(helpline.firstChild) {
                docRange.setEnd(helpline.firstChild, range.end)
                width = docRange.getClientRects()[0].width
              }

              rangeEntity.style.borderLeftWidth = `2px`
              rangeEntity.style.left = `${line.offsetLeft + width}px`
              this.carets.appendChild(rangeEntity.cloneNode())
            }

         // fatRange
            if(start < lastOff) {
              if(helpline.firstChild) {
                docRange.setEnd(helpline.firstChild, start)
                width = docRange.getClientRects()[0].width
                rangeEntity.style.left = `${line.offsetLeft + width}px`

                docRange.setStart(helpline.firstChild, start)
                docRange.setEnd(helpline.firstChild, end)
                width = docRange.getClientRects()[0].width
                rangeEntity.style.borderLeftWidth = `${width}px`

                this.fatRanges.appendChild(rangeEntity.cloneNode())
              } else {
                rangeEntity.style.borderLeftWidth = `8px`
                rangeEntity.style.left = `${line.offsetLeft}px`
                this.fatRanges.appendChild(rangeEntity.cloneNode())
              }
            }

          }

     // this.cache.caretTime reset
        this.cache.caretTime = this.config.caretTime
        this.carets.style.visibility = 'visible'
    }
 /** */
}
