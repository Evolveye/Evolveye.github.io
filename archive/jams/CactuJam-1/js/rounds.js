;( async () => {
  let w = game.container.clientWidth
  let h = game.container.clientHeight
  let i0, i1

  if (DEBUG) {
    player.sterable = true
    player.magnetismable = true
    player.magnetPower = 20
    game.earthMagnetism = 40
  }

  // Hi
  game.round = 0
  sendMessage( ``
    + `Aby skrócić czas między wiadomościami przytrzymaj klawisz x `
    + `(klawisz musi być wciśnięty podczas wyświetlania wiadomości)`
    , `system`
  )
  await asyncPause( 5 )
  sendMessage( `Witaj kapitanie!` )
  await asyncPause( 3 )
  sendMessage( `Wiesz dlaczego tu jesteś prawda?`)
  await asyncPause( 3 )
  sendMessage( `Twój poprzednik się rozbił i...` )
  await asyncPause( 2 )
  sendMessage( `...` )
  await asyncPause( 1 )
  sendMessage( `no sam rozumiesz.` )
  await asyncPause( 6 )

  sendMessage( `Zacznijmy więc:` )
  await asyncPause( 3 )
  sendMessage( ``
    + `Przeleć  się trochę po kosmosie. `
    + `Pamiętaj, że mozesz się rozbić bądź spalić. `
    + `Nie grożą Ci promienie słoneczne ani pole magnetyczne planety ale mimo to musisz uważać gdzie i jak leciesz.`
  )
  sendMessage( `Użyj strzałek bądź klawiszy W, S, A, lub D aby się poruszać`, `system` )
  player.sterable = true
  await asyncPause( 20 )

  // First meteorite
  spawnMeteorite( -30, 20, 2, 0, 20 )
  sendMessage( `Widzisz nadlatujący meteoryt?` )
  await asyncPause( 3 )
  sendMessage( ``
    + `Skała żelaza, Twoim zadaniem jest ściągnąć tę skałę do pola amgnetycznego planety. `
    + `TYLKO UWAŻAJ! Jeśli ten kosmiczny śmieć uderzy w planetę to zginiemy!`
    + `No ewentualnie sam w nią wlecisz...`
  )
  sendMessage( `Użyj spacji aby włączyć/wyłączyć magnes`, `system` )
  player.magnetismable = true
  await asyncPause( 20 )
  sendMessage( `Ciesz się, że ten meteor leci tak wolno. Dobry okaz na naukę.` )
  await asyncPause( () => {
    if (meteorites[0])
      return
   
    if (game.earthLife != 100) {
      sendMessage( ``
        + `IDIOTA! W taki właśnie sposób możesz doprowadzić do naszego wyginięcia!\n`
        + `Te meteory służą do powiększania pola bezpieczeństwa a nie do przeprowadzania hekatomby! `
      )
    }
    else if (game.earthMagnetism != 25)
      sendMessage( ``
        + `Cudownie! W taki właśnie sposób musisz powiększac nasze pole magnetyczne.\n`
        + `Z większym polem będzie łatwiej przechwytywać meteory oraz będziemy mieć lepsza ochronę przed słońcem`
      )
    else
      sendMessage( ``
        + `Na prawdę przepuściłeś taką okazję na powiększenie pola? `
        + `Skandal, skandal a ponadto wstyd!\n`
        + `Pamiętaj, że promienie słoneczne będa coraz groźniejsze, a wolne meteory się kończą. Nikt tu nie chce zginać.`
      )

    return true
  } )
  await asyncPause( 10 )

  // Round 1
  game.round = 1
  sendMessage( `Popatrz, w oddali widać kolejne meteory. Ściągaj je` )
  spawnMeteorite( -30, 30, 2, 0, 20 )
  await asyncPause( 2 )
  spawnMeteorite( -30, h - 30, 2, -10, 20 )
  await asyncPause( 5 )
  spawnMeteorite( w + 30, h / 2 + 50, 2, 190, 20 )
  await asyncPause( () => !(meteorites.filter( m => !!m )).length )

  // Round 2
  game.round = 2
  sendMessage( `Mhmm, kolejne meteory w drodze.` )
  await asyncPause( 3 )
  sendMessage( ``
    + `Jeśli nasze pole osiagnie wielkość 40 jednostek `
    + `to będziemy mogli przekierować następne pokłady zelaza do Ciebie`
  )

  i0 = setInterval( () => {
    if (player.magnetPower < 20 && game.earthMagnetism > 40) {
      player.magnetPower += game.earthMagnetism - 40
      game.earthMagnetism = 40
    }
    else if (player.magnetPower >= 20)
      clearInterval( i0 )
  } )

  spawnMeteorite( w / 3, h - 30, 4, 190, 30 )
  spawnMeteorite( w / 2, -25, 3, 45, 25 )
  await asyncPause( () => !(meteorites.filter( m => !!m )).length )

  // Round 3
  game.round = 3
  await asyncPause( 5 )
  sendMessage( `Zaczyna robić się groźnie. Pilnuj planetę - nasze zdrowie jest ważniejsze niż żelazna zdobycz` )
  i1 = setInterval( () => {
    if (Date.now() - game.timeStart < 1000 * 60 * 5) {
      let [ x, y, speed, rotation, size ] = Meteorite.randomSet
      speed = random( 2, 4 )
      
      if (size > 22)
        size /= 2

      spawnMeteorite( x, y, speed, rotation, size )
    }
  }, 1000 * 3 )
  await asyncPause( 60 * 3 )
  clearInterval( i1 )

  // Round 4
  game.round = 4
  sendMessage( `Nasze teleskopy nie widza w oddali meteorów, robi się spokojnie` )
  i1 = setInterval( () => {
    if (Date.now() - game.timeStart < 1000 * 60 * 5) {
      let [ x, y, speed, rotation, size ] = Meteorite.randomSet
      
      if (size > 22)
        size /= 2

      spawnMeteorite( x, y, speed, rotation, size )
    }
  }, 1000 * 10 )

  // Round 5
  game.round = 5
  await asyncPause( () => !(meteorites.filter( m => !!m )).length )
  sendMessage( `Mamy chwilę przerwy` )
  await asyncPause( 7 )
  sendMessage( `W zasadzie mamy możliwość trochę usprawnić Twój statek kosztem planety.` )
  await asyncPause( 4 )
  sendMessage( ``
    + `Jeśli będziesz uważać, że jesteś gotów na ulepszenia podleć pod nasza stację kosmiczną. `
    + `Zanieczyścimy środowisko ale będziemy w stanie sobie z tym poradzić`
  )
  sendMessage( ``
    + `Podleć rakietą pod pole w sekcji "Stacja kosmiczna". Gdy się podświetli wybierz swoje ulepszenie. `
    + `Pamiętaj, że każde ulepszenie osłabia planetę`,
    `system`
  )
  let spaceStation_pos = game.spaceStation.element.getBoundingClientRect()
  game.spaceStation.x = spaceStation_pos.x
  game.spaceStation.y = spaceStation_pos.y
  game.upgrades = true


  await asyncPause( 200 )

  // Round 6
  game.round = 5
  sendMessage( ``
    + `Gratulacje, właśnie ukończyłeś wersję demonstracyjną gry! `
    + `Pełna wersja zawiera więcej treść, np. kosmitów i misje specjalne!`
    + `Znajdzie się również miejsce na grę wieloosobową!`
  )
  await asyncPause( 3 )
  sendMessage( `Znajdzie się również miejsce na grę wieloosobową!` )
  await asyncPause( 5 )
  sendMessage( `Dodatkowo pełna wersja oferuje poziomy trudności, ładniejszy interfejs, i lepiej wykonany kod oraz grafiki` )
  await asyncPause( 10 )
  sendMessage( `W tym momencie pozostaje Ci cieszyć się grą poza wątkiem fabularnym - gra ta nie ma końca!` )
  await asyncPause( 15 )
  sendMessage( `(tak na prawdę to ma, ponieważ w pewnym momencie robi się zbyt niebezpiecznie)` )
  await asyncPause( 15 )
  sendMessage( `Jeśli jesteś hackermanem zalecamy zajrzeć do konsoli ^^`)

  console.log( `Te skrypty mogą Ci się przydać:` )
  console.log( `  spawnMeteorite( ...(Meteorite.randomSet) )` )
  console.log( `  game.earthLife = 200` )
  console.log( `  game.earthMagnetism = 100` )
  console.log( `  player.magnetPower += 10` )
  console.log( `  player.magnetPower += 10` )
  console.log( `  player.speedMultiplier /= 2` )
} )()