module.exports = (message,userData) => { 'use strict'
  if( message.channel.id == 364471561803268097) return

  let points = userData.diminishingPoints
  let author = message.author
  let msg = message.content

  if( !points.spam ) {
    userData.spamWarn = false
    points.spam = 0
  }

  if( msg.length > 100 )
    points.spam += 1

  else if( msg.length > 250 )
    points.spam += 3

  if( /🇦|🇪|🇵|spam|buu|kurw|pierdol|jprd|huj|pojeb/.test(msg) || msg.length > 250 )
    points.spam += 2

  points.spam += Math.pow(1/1.28, (message.createdTimestamp - userData.lastMessageTime)/1000 -1)

  if( !userData.spamWarn && points.spam >= 8.5) {
    author.send('Hej! Ogarnij się trochę bo będę musiał Cię uciszyć ;/')
    userData.spamWarn = true
  } else if( points.spam >= 17) {
    points.spam = 0
    userData.spamWarn = false
    message.member.addRole(message.guild.roles.find('name','Spamer'),'Musisz ochłonąć')
    message.channel.send(`I tak oto spamerem zostaje: ${author.username}! \nOstrzegałem.`)
  }
}