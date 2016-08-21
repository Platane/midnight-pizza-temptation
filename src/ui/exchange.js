const ctx = typeof document != 'undefined' && document.getElementById('ex').getContext('2d')

import point    from 'math/point'

const p = ( O, A, leaving ) => {
    const a = Math.atan2( A.y - O.y, A.x - O.x ) + ( leaving ? 0.03 : -0.03 )
    return {
        x : Math.cos( a ),
        y : Math.sin( a ),
    }
}


const drawRoad = exchange => {
    const {arc_a, arc_b} = exchange
    const A = p( arc_a.node_b, arc_a.node_a, false )
    const B = p( arc_a.node_b, arc_b.node_b, true )


    ctx.beginPath()
    ctx.moveTo( 75 + A.x*75 , 75 + A.y*75 )
    ctx.quadraticCurveTo( 75 , 75, 75 + B.x*75 , 75 + B.y*75 )
    ctx.lineTo( 75 + B.x*90 , 75 + B.y*90 )
    ctx.stroke()
}


const drawExchange = ( exchanges, exchange ) => {

    ctx.save()

    ctx.beginPath()
    ctx.arc(75,75,75,0,Math.PI*2)
    ctx.strokeStyle= "#333"
    ctx.stroke()


    ctx.globalAlpha=0.5

    ctx.lineWidth=1
    ctx.strokeStyle= "#aaa"
    exchanges.forEach( drawRoad )

    ctx.lineWidth=8
    ctx.strokeStyle= "#43c524"
    drawRoad( exchange )

    ctx.lineWidth=3
    ctx.strokeStyle= "#962222"
    exchange.block.forEach( drawRoad )

    ctx.strokeStyle= "#03a9f4"
    exchange.pass.forEach( drawRoad )








    ctx.restore()
}

const drawExchanges = exchanges =>
    ctx && exchanges.forEach( (exchange, i) => {

        ctx.save()
        ctx.translate(180 * i, 10)
        drawExchange( exchanges, exchange )
        ctx.restore()
    })

module.exports = {
    drawExchanges,
    clear: () => ctx && ctx.clearRect(0,0,9999,9999),
}
