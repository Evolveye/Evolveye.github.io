module.exports = message => { 'use strict'
  let msg = message.content

  //

  if( /.*>{5,}.*/g.test(msg) ) {
    message.delete()
    message.channel.send(`${msg}\nAle jak kto woli`)
  }

  //

  if( /#przegranko/g.test(msg) )
    message.channel.send('#jakdzban')

  if( /#cozadzban|#bardzobrzydko|#niezna(m|sz)się/g.test(msg) )
    message.channel.send('#jeszczejak')

  //

  if( /#zaniepokojeniemocnobardzo/g.test(msg) )
    message.channel.send('#zaniepokojenie <:hue:380420995103850496>')

  else if( /#zaniepokojenie/g.test(msg) )
    message.channel.send('#zaniepokojeniemocnobardzo')

  //

  if( /#nieładnie|#nieznamcię/g.test(msg) )
    message.channel.send('#bardzobrzydko')

  if( /#można/g.test(msg) )
    message.channel.send('#nawettrzeba')

  if( /#nawettrzeba/g.test(msg) )
    message.channel.send('#nawetbardzo')

}


// przegranko cozadzban bardzobrzydko niezna(m/sz)się 