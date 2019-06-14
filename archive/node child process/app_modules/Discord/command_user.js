module.exports = {
  stats() {
    //@desc Sprawdź swoje statystyki (dostępne na kanale spamu)

    if( message.channel.id != 364471561803268097
     && message.channel.id != 386885116116598793
     && message.channel.id != 315215466215899146
    ) return

    message.channel.send({embed:{
      title:`Dane użytkownika: ${author.username}`,
      color: 0x00A000,
      fields: [
        { name: 'Punkty spamu',
          value: `${Math.floor((dbUser.diminishingPoints.spam || 0)*100)/100}`,
          inline: true },
      ]
    }})
  },

  hej(nick=/.{1,}/) {
    //@desc Zawołaj kolegę franka, pankeka, lub bobka
  
    message.delete()
  
    let response
    switch(nick) {
      case 'franek':  response='<@!264419108332896256>';  break
      case 'pankek':  response='<@!264095666479955971>';  break
      case 'bobek':   response='<@!205745502266851329>';  break
      default: response = 'Nie znam takiego człowieka <:makak:381090432685309962>'
    }
  
    message.channel.send(response)
  },

  an(seconds='/[0-9]{0,3}s/', responses='/\[[\S ]+\]/',...question) {
    //@desc Stwórz ankietę!
  
    if( cc.an_active ) {
      message.channel.send('👹 O Ty robaczq! Poczekaj aż skończy się już utworzona ankieta!')
      return
    }

    if( !seconds )
      seconds = 10

    if( !responses )
      responses = '[Tak|Nie]'


    seconds = Number(seconds.slice(0,-1))
    responses = responses.slice(1,-1).split(';')

    let nums = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣']
    let responsesString = ( () => {
      let _return = ''

      for(let res of responses)
        _return += `\n${nums[responses.indexOf(res)]} ${res}`

      return _return
    } )()

    message.channel.send(`❔ ${question.join(' ')} ${responsesString}`)
      .then( msg => {
        cc.an_active = true
        for(let i=0; i<responses.length; i++)
          (i => setTimeout( () => msg.react(nums[i]), i*300 ) )(i)

        setTimeout( () => {
          let response = ''
          let theBestOptionNr
          let reactions = msg.reactions
          for(let reaction of reactions) {
            theBestOptionNr = reaction[0]
            response += `${reaction[0]} ${reaction[1].count-1} \n`
          }

          cc.an_active = false
          message.channel.send( response )
        }, seconds*1000 )
      })
  }
}