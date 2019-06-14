'use strict'

class Command {
  constructor( prefix, config={} ) {

    this.prefix       =  prefix
    this.loosePrefix  =  config.loosePrefix  ||  false  // executed message need to have before prefix?

    this.commands     =  {}

    this.messenger    =  config.messenger
    this.errors       =  {
         badRole      :  config.badRole,
         badParams    :  config.badParams,
         badParams    :  config.badParams
    }

  }

  addStruct( structure ) {

  }

  execute( executor={ name:null, role:null }, message ) {

  }

  getFuncData( func ) {

  }
}



class Command {
  constructor(prefix,config={}) {
    this.prefix      = prefix
    this.loosePrefix = config.loosePrefix  // executed message need to have before prefix?
    this.badRole     = config.badRole
    this.badParams   = config.badParams
    this.badCommand  = config.badCommand
    this.messenger   = config.messenger
    this.commands    = {}
  }
  
  addStruct(structure) {
    Object.assign(this.commands,this.builder(structure) )
  }

  execute(message, executor={}) {
    let prefix = this.loosePrefix  ?  `${this.prefix} `  :  this.prefix

    //Command prefix test
    if( `${message} `.slice(0,this.prefix.length) != this.prefix ) return

    let commandSyntax = message.slice(prefix.length).split(/ +/)
    let command = this.commands
    let wrongValue, deepLadder = []

    //: Command data tester and constructor
      if( commandSyntax[0] )
        for(let commandPart of commandSyntax) {
          command = command[commandPart]

          //: Conditions
          if( !command || commandPart.charAt(0) == '@' )
            return this.send({ message , error:this.badCommand , suggestions:[] })

          deepLadder.push(commandPart)

          if( command['@role'] != 'Anyone' && !executor.roles(command['@role']) )
            return this.send({ message:`${prefix}${deepLadder.join(' ')}` , error:this.badRole , suggestions:[] })

          if( !('code' in command) )
            continue
          
          let masks   = command['@masks']
          let params  = commandSyntax.slice(commandSyntax.indexOf(commandPart)+1)
          let _params = []

          //Params test by masks
          for(let mask of masks) {console.log(mask,params[0])

            //@mask = value
            if( mask.substr(0,2) == 're' ) {
              if( params[0] && (new RegExp( mask.slice(2) )).test(params[0]) )
                _params.push(params.shift())
              else {
                wrongValue = true
                break
              }

            //@mask = optional value
            } else if( mask.substr(0,3) == '?re' ) {
              if( params[0] && (new RegExp( mask.slice(3) )).test(params[0]) )
                  _params.push(params.shift())
              else _params.push('null')

            //@mask = rest
            } else if( /!!!|\.\.\./.test(mask) ) {
              if( !params.length && mask == '!!!' )
                  wrongValue = true
              else _params = _params.concat(params)
              break

            // wrong value ;/
            } else {
              wrongValue = true
              break
            }

          }

          //Bad params
          if( wrongValue )
            return this.send({ message:`${prefix}${deepLadder.join(' ')}` , error:this.badParams , suggestions:command['@suggestedParams'] })

          //All is good
          for(let value of _params)
            if( /\D/.test(value) && value != 'null' ) {
              // console.log(`log: \`${value.replace(/\\|`/g, m => `\\${m}`)}\` `)
              _params[_params.indexOf(value)] = `\`${value.replace(/\\|`/g, m => `\\${m}`)}\``
            }

          return `(function(${command['@params']}){${command.code}})(${_params})`
    
        }

    //: Get a next floor of the command
      let suggestions = []
      let nextFloor = Object.keys(command)

      for(let suggestion of nextFloor) {
        let data = command[suggestion]

        if( suggestion.charAt(0) == '@' || data['@role'] != 'Anyone' && !executor.roles(data['@role']) )
          continue

        suggestions.push( {
          name: suggestion,
          desc: data['@desc']  ||  (data.code  ?  '>__'  :  '...'),
          role: data['@role'],
          params: data['@suggestedParams']  ||  [],
          function: !!data.code
        } )
      }

      return this.send({ message , error:null , suggestions })

    //:
  }

  builder(structure) {
    let command = {}

    for(let syntaxPart in structure) {
      if( syntaxPart.charAt(0) == '@' ) continue

      command[syntaxPart] = {}

      if(typeof structure[syntaxPart] == 'function') {
        let {args,code,dataset} = this.funcData(structure[syntaxPart])
        let func = command[syntaxPart] = {
          '@role': dataset.role  ||  'Anyone',
          '@desc': dataset.desc  ||  '',
          '@suggestedParams': [],
          '@params': [],
          '@masks': [],
          code
        }

        for(let arg of args) {
          //@param = value
          if( /^\/.+\/$/.test(arg.mask) ) {
            func['@masks'].push(`re${arg.mask.slice(1,-1)}`)
            func['@params'].push(arg.name)
            func['@suggestedParams'].push(`${arg.name}`)

          //@param = optional value
          } else if( /^('|"|`)\/.+\/('|"|`)$/.test(arg.mask) ) {
            func['@masks'].push(`?re${arg.mask.slice(2,-2)}`)
            func['@params'].push(arg.name)
            func['@suggestedParams'].push(`?${arg.name}`)
  
          //@param = obligatory rest
          } else if( /^\.\.\..+$/.test(arg.name) ) {
            func['@masks'].push('!!!')
            func['@params'].push(arg.name)
            func['@suggestedParams'].push(arg.name)
            break
  
          //@param = optional rest
          } else if( /^'\.\.\..+'$/.test(arg.mask) ) {
            func['@masks'].push('...')
            func['@params'].push(arg.name)
            func['@suggestedParams'].push(arg.name)
            break
  
          //@param = any value
          } else if( arg.name && !arg.mask) {
            func['@masks'].push(`re.*`)
            func['@params'].push(arg.mask)
            func['@suggestedParams'].push(arg.mask)
  
          //@param is wrong ;/
          } else break
        }
  
      } else if(typeof structure[syntaxPart] == 'object') {
        command[syntaxPart]['@role'] = structure[syntaxPart]['@role']  ||  'Anyone'
        Object.assign( command[syntaxPart], this.builder(structure[syntaxPart]) )
      }
    }
  
    return command
  }

  funcData(func='') {
    let parted = /^(\w+)[ ]{0,}\((.*)\)[ \n]{0,}\{([\s\S]+)\}$/.exec(func.toString())
    let lines = parted[3].split(/\r?\n/)

    let dataset = {}
    for(let line of lines) {
      if( !line ) continue

      line = /^\/\/@(\w+) ([^\n]+)/.exec(line.trim())

      if( !line ) break

      dataset[line[1]] = line[2]
    }

    let args = parted[2]  ?  parted[2].match(/(?:\.\.\.)?\w+(?:=['"`]?\/.*?[^\\]\/['"`]?|\.\.\.\w+)?/g)  :  []
    let dividedArgs = []
    for(let arg of args) {
      let keyValue = arg.split('=')
      dividedArgs.push({
        name:  keyValue.shift(),
        mask: keyValue.shift()
      })
    }

    return {
      name: parted[1],
      args: dividedArgs,
      code: parted[3],
      dataset
    }
  }

  send(data) {
    if( typeof this.messenger == 'function') {
      this.messenger = `f=${this.funcData(this.messenger).code}`
      return this.send(data)
    }

    let code = this.messenger
    data = JSON.stringify(data)

    if( this.messenger.substr(0,2) == 'f=' )
      code = this.messenger.slice(2)

    return `( data => {${code}})(${data})`
  }

  /**
   * @return
     * "message": "Sended message"
     * "error": "Error message"
     * "suggestions": "Array of syntax parts or function parameters"
   */
}


/*! - !*/


function load(modulePath, ...regexps) {
  if( modulePath.substr(-1) == '/' ) {
    let files = fs.readdirSync(modulePath)
    let required = []

    for(let regexp of regexps) {
      let arr = []
      for(let file of files)
        if( regexp.test(file) )
          arr.push( load(`${modulePath}${file}`) )
      
      required.push(arr)
    }

    return required
    
  } else {
    try { require.resolve(modulePath) }
    catch(err) { return require(modulePath) }

    delete require.cache[require.resolve(modulePath)]
    return require(modulePath)

  }
}


/*! - !*/


module.exports = {Command,load,fs}