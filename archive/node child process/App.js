'use strict'

//# The most important variables
const UTIL           =  require('util')
const HTTP           =  require('http')
const CHILD_PROCESS  =  require('child_process')

//# Functions
function log(welcomeMessage) {
    log = function(data, message) {
      let type, prefix

      //: Setter of prefix & type
        if( !Array.isArray(data) ) {
          message = data
          data = []
        }
        
        if( data.length > 0 )
          [type,prefix] = data

        else type = 'log'

      //: Log constructor
        switch(type) {
          case 'module':
            prefix = `[90m==[39m [35m${prefix || 'Modules'}[39m [90m==[39m`
            while( prefix.length < 36 + 15 ) prefix = ` ${prefix}`
            break

          case 'app':
            prefix = `[90m==[39m [36m${prefix || 'App'}[39m [90m==[39m`
            while( prefix.length < 36 + 15 ) prefix = ` ${prefix}`
            break

          case 'print':
            process.stdout.write(`\n`+UTIL.format(message))
            return

          case 'init':
            process.stdout.write(message)
            return

          case 'err':
            let splitedMsg = message.split(/\n/)
            if( splitedMsg.length < 5 ) return

            let splitedPath = splitedMsg[0].split(/\/|\\/)
            let fileAndLine = splitedPath[splitedPath.length - 1]
            let badLineCode = ''
              + `[90m${splitedMsg[1].slice(0,splitedMsg[2].match(/ +/)[0].length)}[39m`
              + `[4m[1m${splitedMsg[1].slice(splitedMsg[2].match(/ +/)[0].length)}[22m[24m`
            process.stdout.write('\r\x1b[K')
            process.stdout.write('        '
              + `[41m ${prefix.toUpperCase()} ERROR [49m  │  ${fileAndLine}\n`
              + `   .   .  .  . . . ...  │ >[1m${badLineCode}[22m\n`
              + `   .   .  .  . . . ...  │  ${splitedMsg[4]}\n`
            )
            process.stdout.write('       [90mCommand prompt:[39m  : /')
            return

          default:
            prefix = `[90mlog:[39m`
            while( prefix.length < 16 + 15 ) prefix = ` ${prefix}`
        }

      //:

      if(message.length > process.stdout.columns - 30)
        message = `${message.slice(0,process.stdout.columns - 30)}...`

      process.stdout.write('\r\x1b[K')
      process.stdout.write(` ${prefix}  │  ${message}\n`)
      process.stdout.write('       [90mCommand prompt:[39m  : /')
    }
    log(['init'], `\n${welcomeMessage}\n       [90mCommand prompt:[39m  : /`)
}

//# Variables and them configuration
const {Command,load,fs}  =  require('./app_modules/globals.js')
const {fork}             =  CHILD_PROCESS

const commands = new Command('/', {
    badRole: 'Nie posiadasz uprawnienień do tego polecenia!',
    badParams: 'Podano niewłaściwe parametry!',
    badCommand: 'Polecenie nie istnieje!',
    messenger(data) { console.log(data.message) }
} )
commands.addStruct( {
    reload(modulename=/\w+/) {
      if( !modules[modulename] ) return

      modules[modulename].kill()
      modules[modulename] = fork(`App.js`,[],{cwd:`./app_modules/${modulename}/`, silent:true})
      modules[modulename].on('message', message => log(`Message from ${modulename}: ${message}`) )
      modules[modulename].stderr.on('data', data => log(['err','module'],data.toString()) )
      modules[modulename].stdout.on('data', data =>
        log(['module',modulename], data.toString().replace(/\r|\n/g, m => ''))
      )
    },
    send(modulename=/\w+/, ...data) {
      if( !modules[modulename] ) return

      console(['app'],`Data sending.`)
      
      modules[modulename].send(data)
    }
} )

const modules = (function() {
  let modulesPath = './app_modules/'
  let dirs = fs.readdirSync(modulesPath).filter(f => fs.statSync(`${modulesPath}${f}`).isDirectory())
  let modules = {}

  for(let modulename of dirs) {
    modules[modulename] = fork(`App.js`,[],{cwd:`./app_modules/${modulename}/`, silent:true})
    modules[modulename].on('message', message => log(`Message from ${modulename}: ${message}`) )
    modules[modulename].stderr.on('data', data => log(['err','module'],data.toString()) )
    modules[modulename].stdout.on('data', data =>
      log(['module',modulename], data.toString().replace(/\r|\n/g, m => ''))
    )
  }

  return modules
} )()

//# Run
log('    '
  + '[1m[32mCactus says:[39m[22m Welcome my master'
  + '\n   ─────────────────────┬────────'
)

process.stdin.on('data', data => eval(commands.execute(`/${data.toString().slice(0,-2)}`)) )