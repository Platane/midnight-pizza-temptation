
import color                    from 'ui/color'
import {getCarrierPosition}     from 'ui/projection'
import createSplosion           from './pizzaSplosion'
import point                    from 'math/point'


const marge = 0

module.exports = ( width, height, carriers ) => {


    //// instanciate canvas

    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    const pizzas = []
    const particules = []

    const createParticule = ( p, carrier ) => {

        const n = point.sub( carrier.position.arc.node_b, carrier.position.arc.node_a )
        const l = 5 * ( Math.random() > 0.5 ? 1 : -1 ) * ( Math.random() + 1 ) / point.length( n )


        return {
            ...p,
            c : color( carrier ),
            l : Math.floor( Math.random() + 1 )*50,
            t : 0,
            v : {
                x: -n.y * l + Math.random() * 2,
                y:  n.x * l,
            },
            s : ( Math.random() + 1 )*0.5,
            o : Math.random()*0.3 + 0.3
        }
    }

    const update = () => {
        ctx.clearRect(0,0,width,height)

        // draw gps path
        carriers
            .filter( carrier => carrier.control && carrier.game.waitAfterScore == 0 )
            .forEach( carrier => {

                const path = [ getCarrierPosition( carrier, marge, 0 ), carrier.position.arc.node_b, ...carrier.decision.path ]

                ctx.save()
                ctx.lineCap     = 'round'
                ctx.lineJoin    = 'round'
                ctx.strokeStyle = color( carrier )
                ctx.globalAlpha = 0.2
                ctx.lineWidth   = 7
                // ctx.globalCompositeOperation = 'lighten'
                ctx.beginPath()
                ctx.moveTo( path[0].x, path[0].y )
                path.forEach( p => ctx.lineTo( p.x, p.y ) )

                ctx.stroke()
                ctx.globalAlpha = 0.5
                ctx.lineWidth   = 2
                ctx.beginPath()
                ctx.moveTo( path[0].x, path[0].y )
                path.forEach( p => ctx.lineTo( p.x, p.y ) )
                ctx.stroke()
                ctx.restore()

            })

        // draw carrier
        carriers.forEach( carrier => {

            const p = getCarrierPosition( carrier, marge, 2 )

            if ( carrier.position.velocity > 0.5 && Math.random() > 0.9 )
                particules.push(createParticule( p, carrier ))

            ctx.beginPath()
            ctx.fillStyle = color( carrier )
            ctx.arc( p.x, p.y, 2.5, 0, Math.PI*2 )
            ctx.fill()

            if ( carrier.game.dead && carrier.control ) {

                ctx.strokeStyle = color( carrier )
                ctx.lineWidth = 5
                ctx.beginPath()
                ctx.moveTo( p.x -10, p.y -10 )
                ctx.lineTo( p.x +10, p.y +10 )
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo( p.x -10, p.y +10 )
                ctx.lineTo( p.x +10, p.y -10 )
                ctx.stroke()

            }
        })

        // draw particules
        for( let i=particules.length; i--; )
        {
            particules[i].t ++

            const {x,y,v,t,l,s,c,o} = particules[i]

            if ( t > l )
                particules.splice(i,1)

            const k = t/l

            ctx.save()
            ctx.beginPath()
            ctx.arc( x + v.x * k, y + v.y * k, ( 1+ Math.abs( 0.2 - k ) ) * s , 0, Math.PI*2 )
            ctx.fillStyle = c

            ctx.globalAlpha = Math.max( 0, 1 - ( k - 0.5 ) * 2 ) * o
            ctx.fill()
            ctx.restore()
        }

        // draw pizza explosion
        carriers
            .filter( carrier => carrier.game.waitAfterScore == 100 )
            .forEach( carrier =>
                pizzas.push( createSplosion( ctx, carrier.position.arc.node_a, color( carrier )  ) )
            )

        for(let i=pizzas.length;i--;)
            if( pizzas[i]() )
                pizzas.splice(i,1)

        // draw flag
        carriers
            .filter( carrier => carrier.control )
            .forEach( carrier => {

                const last = carrier.decision.path.length==0
                    ? carrier.position.arc.node_b
                    : carrier.decision.path[ carrier.decision.path.length-1 ]


                ctx.save()

                ctx.beginPath()
                ctx.strokeStyle='#fff'
                ctx.lineWidth   = 3
                ctx.moveTo( last.x, last.y )
                ctx.lineTo( last.x, last.y-15 )
                ctx.stroke()

                ctx.beginPath()
                ctx.fillStyle   = color( carrier )
                ctx.arc( last.x, last.y-15, 6, 0, Math.PI*2 )
                ctx.stroke()
                ctx.fill()

                ctx.restore()

            })


    }

    return {
        canvas,
        update
    }
}
