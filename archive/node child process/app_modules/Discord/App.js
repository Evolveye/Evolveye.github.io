'use strict'
//:
//: Define & configure variables

  const {Command,load}  =  require('../globals')
  const Discord         =  require('discord.js')
  const fs              =  require('fs')

  const db     = {users:{}}
  const Cactus = new Discord.Client()
  const cc     = new Command('cc!',{
    loosePrefix: true,
    badRole: 'Nie posiadasz uprawnienień do tego polecenia!',
    badParams: 'Podano niewłaściwe parametry!',
    badCommand: 'Polecenie nie istnieje!',
    messenger(data) {
      //Error test
      if( data.error ) {
        message.channel.send( {embed:{
          color: 0x00A000,
          title:`❌ ${data.error}`,
          description: `👉   \`${data.message} ${data.suggestions.join(' ')}\``
        } } )
        return
      }
  
      let suggestions  = data.suggestions
      let informations = ''
  
      //Embeded message fields constructor
      for(let suggestion of suggestions) {
        informations += `\n\n**${data.message} ${suggestion.name}**`
  
        if( suggestion.function ) 
             informations += ''
              + (suggestion.params.length  ?  ` < ${suggestion.params.join(' / ')} >`  :  '')
              + `\n*${suggestion.desc}*`
              
        else informations += ' ...'
      }
  
      message.channel.send( {embed:{
        color: 0x00A000,
        title: '⚙ Pomoc do konstrukcji podanego polecenia:',
        description: informations
      } } )
  
    }
  } )

  let [middlewares,commands] = load(`${__dirname}/`, /^middleware_.*\.js$/, /^command_.*\.js$/)
  for(let structure of commands) cc.addStruct(structure)


//:
//: Database updater

  setInterval( () => {
    let users = db.users

    for(let id in users) {
      let points = users[id].diminishingPoints

      for(let name in points)
        if( points[name] > 1 ) points[name]--
        else points[name] = 0
    }

  },1000*60)


//:
//: Bot events and login

  Cactus.on('message', message => {
    if( message.author.bot) return
    // if( message.author.id != message.guild.ownerID) return

    let msg    = message.content
    let author = message.author

    // const role = message.guild.roles.find("name", "Spamer")
    // message.member.addRole( role )
    //   .then( () => message.reply('działa') )
    //   .catch( () => message.reply('nie działa') )

    if( !db.users[author.id] )
      db.users[author.id] = { lastMessageTime: 0,   diminishingPoints:{} }

    let dbUser = db.users[author.id]

    if( 'guild' in message ) {
      for(let middleware of middlewares) middleware(message,dbUser)
      
      eval( cc.execute(msg, {roles(neededRole) {
        let role = message.guild.roles.find("name", neededRole)
        let havingARole = role  ?  message.member.roles.has(role.id)  : false
        return author.id == message.guild.ownerID  ||  havingARole
      } } ) )

    }
    dbUser.lastMessageTime = message.createdTimestamp
  })
  Cactus.on('ready', () => console.log('Cactus was run') )
  Cactus.login('Mzc5MjM0NzczNDA4Njc3ODg4.DOnFcA.zuO_qIn_c65P-T5na1Wbmi8rI-E')