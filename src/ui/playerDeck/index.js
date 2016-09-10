import style        from './style.mcss'
import color        from 'ui/color'
import pizza        from 'ui/pizza/paint'
import {create}     from 'ui/dom'

const createPlayer = ( player ) => {

    const dom = create( style.player )

    const ball = create( style.ball )
    ball.style.backgroundColor = color( player )
    dom.appendChild( ball )

    const touch = create( style.touch )
    const letter = create( style.letter )
    letter.innerHTML = player.control.key

    touch.appendChild( letter )
    dom.appendChild( touch )

    const scoreCanvas = create( style.score, 'canvas' )
    scoreCanvas.width = 560
    scoreCanvas.height = 50
    dom.appendChild( scoreCanvas )

    const ctx = scoreCanvas.getContext('2d')
    ctx.scale(0.5,0.5)
    ctx.translate(-25,0)

    let score = 0
    const update = () => {

        touch.setAttribute('class', player.control.acceleration<0 ? style.touch : style.touchDown )

        while ( score < player.game.score ){
            score ++

            ctx.translate(40,0)
            pizza( ctx )
        }
    }

    return { dom, update }
}

module.exports = ( carriers ) => {

    const grid = []
    const dom_root = create('playerDeck')

    const update = () => {

        const players= carriers.filter( x => x.control )

        while ( grid.length < players.length ) {

            const i = document.getElementById('instruction')
            i && i.parentNode.removeChild( i )

            const { dom, update } = createPlayer( players[ grid.length ] )

            dom_root.appendChild( dom )

            grid.push( update )
        }

        grid.forEach( fn => fn() )
    }

    return { dom:dom_root, update }
}
