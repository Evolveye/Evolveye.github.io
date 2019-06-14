module.exports = { "god" : {
  '@role':'Weteran',

  delete(number=/\d/) {
    //@role God
    //@desc Usuń określoną ilość ostatnich wiadomości

    let count = ++number<2  ?  2  :  number>100  ?  100  :  number
    message.channel.bulkDelete(count).then(deleted => {
      message.channel.send(`✅  Usunięto **${deleted.array().length - 1}** ostatnich wiadomości`)
    })

  },
  test(...command){
    //@role God

    let x = {

      func(mask={ seconds:'/\d{1,2}s/', question:/[^?]+\?/, responses:'/[.+?[^\\]\]/' }, desc='Stwórz ankietę!'){}

    }
    command = command.join(' ').split(/^(.{0}\[.+?[^\\]\]) (.+)/)
    console.log(command)
    message.channel.send( command[1] +' || '+ command[2] )
  },
  reload() {
    //@role God
    //@desc Przeładuj polecenia i funkcje pośrednie

    [middlewares,commands] = load(`${__dirname}/`, /^middleware_.*\.js$/, /^command_.*\.js$/)

    for(let structure of commands)
      cc.addStruct(structure)

    message.channel.send(`✅  Polecenia i funkcje pośredniczące zostały przeładowane`)

  },
  tell(channelHash='/^<#\d{18}>(?:embeded)?$/', ...text) {
    //@role Weteran
    //@desc Wyślij wiadomość

    let msg = text.join(' ')
    if( /embeded$/.test(channelHash) ) {
      Cactus.channels.find('id', channelHash.substring(2,20) ).send( {embed: eval(`(${msg})`)} )

    } else if( channelHash ) {
      Cactus.channels.find('id', channelHash.substring(2,20) ).send(msg)

    }
    else {
      message.channel.send(msg)

    }
    message.delete()

  },
  exec(...command) {
    //@role God
    //@desc Wykonaj wpisane polecenie

    eval(command.join(' '))

  }
} }


/*

!###

cc! god tell #controlpanel ``` ```

_**Podstawowe informacje na temat kaktusowego serwera**_

!###

cc! god tell #controlpanelembeded {
  color: 40960,
  fields: [
    {
      name: "Netykieta",
      value: "Netykieta jest tutejszym zamiennikiem regulaminu. Typowe “śmieszki” są jak najbardziej dozwolone, ale pisząc takowe należy zachować zdrowy rozsądek. Nie ściga się za nieprzestrzeganie netykiety, bo i nie każdy zna jej wszystkie zaostrzenia, lecz jej dosadne złamanie z pewnością zostanie ukarane.\n`---`"
    },
    {
      name: "Uprawnienia — system nagród i kar",
      value: "Początkowe uprawnienia, które nabywa nowy użytkownik pozwalają na korzystanie z kanałów dostępnych publicznie. Dostęp do nowych, cichszych i spokojniejszych kanałów można uzyskać wykazując się dobrą postawą. Analogicznie za złe zachowanie przywileje można tracić — banowanie nie jest najmilsze.\n`---`"
    },
    {
      name: "Kaktusowy bot",
      value: "Bot został zintegrowany z serwerem w taki sposób aby zautomatyzować pracę administracji. Można go zatem określić mianem wirtualnego administratora. \nJeżeli masz pomysł na nową funkcję bota możesz samodzielnie ją napisać, stosując się do wzory poniżej"
    }
  ]

}

!###

cc! god tell #controlpanel ``` ```
Jeżeli serwer będzie się stopniowo rozrastać, zostanie on odpowiednio rozbudowany o funkcjonalność i przejrzystość

!###

cc! god tell #controlpanel ``` ```

_**Budowanie modułów do bota (wersja slim)**_
```ini
  module.exports = {
    nazwa_polecenia( parametry ) {
      //@role <rola>
      //@desc <opis>
  
      /* kod * /
  
    }
  }
```
**nazwa_przestrzeni** i **nazwa_polecenia** — nazwy jednowyrazowe
**rola** — nazwa roli, której posiadanie uprawnia do wykonania polecenia (nieobowiązkowe)
**opis** — Opis polecenia, który wyświetla się podczas wpisania cc! (nieobowiązkowe)

``` ```

https://discord.gg/AEMcZR9

!###
*/