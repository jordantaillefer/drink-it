'use strict'

const LEFTARROW = 37
const RIGHTARROW = 39
const SPACE = 32

class DrinkIt {
  constructor() {
    const btnPlay = document.querySelector('#btn-play')
    btnPlay.addEventListener('click', (event) => {
      event.preventDefault()
      this.start()
    })

    this.onKeyPress = this.onKeyPress.bind(this)
    this.reload = this.reload.bind(this)

    this.content = document.querySelector('.wrapper')
    this.currentPlayers = []
    this.gages = {}
    this.gages.drinkup = [
      {
        pos: 'Donne un cul-sec à %player%.',
        neg: 'Bois un cul-sec.'
      }, {
        pos: 'Tu as de la chance ! Passe ton tour...',
        neg: 'Pas de chance ! Cul-sec !'
      }
    ]
    this.gages.gulp = [
      {
        pos: 'Demande à %player% de boire 3 gorgées de ton verre.',
        neg: 'Bois 3 gorgées du verre de %player%.',
        gulp: 2
      }, {
        pos: 'Rajoute dans le verre de %player%, l\'alcool de ton choix.',
        neg: '%player% rajoute l\'alcool de son choix dans ton verre.',
        gulp: 2
      }
    ]
    this.gages.activity = [
      {
        pos : '%player% te fait un bisou.',
        neg : '%player%, tu fais un bisou à ton adversaire.'
      }
    ]
    this.gages.longActivity = [
      {
        pos : 'Dès que %player% parle, il lève son petit doigt.',
        neg : 'Dès que tu parles, lèves le petit doigt...',
        end : '%player%, tu n\'es plus obligé de lever le petit doigt.',
        sip : 2
      }, {
        pos : '%player% imite la conduite d\'une moto',
        neg : 'Imite la conduite d\'une moto',
        end : '%player%, tu peux arrêter de faire la moto',
        sip : 2
      }
    ]
    this.gages.state = []
  }

  getPlayers() {
    const players = [...document.querySelectorAll('.form-players__input')]
      .map(player => player.value)
      .filter(value => value)

    const allUnique = (players.filter((x, i) => players.indexOf(x) === i)).length === players.length
    if (!allUnique) return;

    // TODO: enlever les espaces et caractères dans les noms
    const areValidNames = players.every(name => name.length >= 2)
    if (!areValidNames) return;

    return (players.length >= 2) ? players : false
  }

  createPlayers() {
    return this.players.map(player => ({
      name: player,
      noSips: 0,
      noCulSec: 0
    }))
  }

  displayPlayers() {
    const players = [...this.players]
    this.currentPlayers = players.splice(Math.floor(Math.random() * players.length), 1)
      .concat(players.splice(Math.floor(Math.random() * players.length), 1))

    return this.currentPlayers.map(player => (
      `<div id="player-${player.name}" class="col-player">
        <h2>${player.name}</h2>
      </div>`
    ))
  }

  displayGage(player) {
    const probability = Math.random()

    let probaDrinkUp
    let probaGulp
    let probaActivity
    let probaLongActivity

    const statePlayer = this.gages.state
      .map(state => state.player)
      .map(player => player.name)
      .filter(name => player.name)
    const currentPlayersName = this.currentPlayers.map(player => player.name)

    if (this.gages.state && [...new Set(currentPlayersName.filter(name => new Set(statePlayer).has(name)))].length) {
      // 7% cul sec 53% gorgee 15% activite 15% activite temp 10% annulation
      probaDrinkUp = 0.07
      probaGulp = 0.6
      probaActivity = 0.75
      probaLongActivity = 0.9
    } else {
       // 10% cul-sec 65% gorgee 12.5% activite 12.5% actTMP
       probaDrinkUp = 0.1
       probaGulp = 0.75
       probaActivity = 0.875
       probaLongActivity = 1
    }

    //TODO Boire du vin
    const gages = probability < probaDrinkUp
      ? this.gages.drinkup
      : probability < probaGulp
        ? this.gages.gulp
        : probability < probaActivity
          ? this.gages.activity
          : probability < probaLongActivity
            ? this.gages.longActivity
            : this.gages.state

    let gage
    let description
    let playerToReplace

    // TODO: checker si le gage est déjà attribué

    if (gages === this.gages.state) {
      const state = this.gages.state.pop()
      gage = state.gage
      description = gage.end
      playerToReplace = state.player.name
    } else {
      playerToReplace = this.currentPlayers
        .map(player => player.name)
        .filter(name => name !== player.name)[0]

      gage = gages[Math.floor(Math.random() * gages.length)]
      description = Math.floor(Math.random() * 2) ? gage.pos : gage.neg

      if (gages === this.gages.longActivity) {
        this.gages.state.push({ player, gage })
      }
    }


    console.log('player',player)
    console.log('state',this.gages.state)

    const $gage = document.createElement('p')
    $gage.innerText = description.replace('%player%', playerToReplace)

    document.querySelector(`#player-${player.name}`).appendChild($gage)

    const $overlay = document.createElement('div')
    $overlay.classList.add('overlay')
    const $checkmark = document.createElement('img')
    $checkmark.src = 'img/checkmark.png'
    $checkmark.width = '128' //TODO Remove

    $overlay.appendChild($checkmark)
    document.body.appendChild($overlay)


    $overlay.addEventListener('click',this.reload)
    document.addEventListener('keyup',this.reload,false)
  }

  reload() {
    const $overlay = document.querySelector('.overlay')
    document.body.removeChild($overlay)
    this.run()
  }

  start() {
    this.players = this.getPlayers()

    if (!this.players) return;

    this.players = this.createPlayers()
    this.run()
  }

  run() {
    document.removeEventListener('keyup',this.reload,false)
    this.content.innerHTML = this.displayPlayers()

    document.addEventListener('keyup', this.onKeyPress, false)

    this.currentPlayers.forEach(player => {
      const colPlayer = document.querySelector(`#player-${player.name}`)
      colPlayer.addEventListener('click', () => {
        this.displayGage(player)
      })
    })

  }

  onKeyPress(event) {
    event.preventDefault()

    const keyCode = event.keyCode || event.which

    if (![LEFTARROW, RIGHTARROW].includes(keyCode)) {
      return;
    }

    document.removeEventListener('keyup' , this.onKeyPress , false)
    console.log(this.currentPlayers)

    const target = {
      [LEFTARROW] : this.currentPlayers[0],
      [RIGHTARROW] : this.currentPlayers[1]
    }

    console.log(target[keyCode])

    this.displayGage(target[keyCode])
  }
}

window.addEventListener('load', () => new DrinkIt())
