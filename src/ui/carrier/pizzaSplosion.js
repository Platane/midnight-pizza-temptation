import pizzaPool    from 'ui/pizza/pool'
import point        from 'math/point'

const hop = ( t, n=3 ) =>
    ( 1-t*0.6 )*Math.abs( Math.sin( t*Math.PI*n ) )

module.exports = ( ctx, o ) => {

    const particules = Array.from({ length: 20 })
        .map( () => ({
                x : 0,
                y : 0,
                r : Math.random()*6 -3,
                l : (0.5+Math.random())*40,
                c : pizzaPool[ Math.floor( Math.random() * pizzaPool.length ) ],
                v : point.normalize({ x:Math.random()-0.5, y:Math.random()-0.5 }),
                // v : point.normalize({ x:1, y:0 }),
                s : (1+Math.random())* 0.06,
                n : 2+Math.ceil( Math.random() * 1.5 ),
            })
        )

    const max = 100
    let k = max

    return () => {

        k --

        const t = 1-k/max
        const sqrt_t = Math.sqrt( t )

        if ( t < 0.25 ){
            ctx.save()
            ctx.beginPath()
            ctx.globalAlpha = Math.max( 0, 1 - (t-0.15)*10 )
            ctx.fillStyle = 'rgba(255,255,255,0.2)'
            ctx.beginPath()
            ctx.arc( o.x, o.y, 10+t*120, 0, Math.PI*2 )
            ctx.fill()
            ctx.restore()
        }

        particules.forEach( x => {

            x.r += x.r < 0 ? 0.02 : -0.02

            const h = hop( t, x.n )
            const s = x.s * ( 0.6+h )

            ctx.save()
            ctx.globalAlpha = 1 - (t-0.8)*5
            ctx.translate(
                o.x +   x.v.x * x.l * sqrt_t,
                o.y +   x.v.y * x.l * sqrt_t - h * 10
            )
            ctx.scale( s,s )
            ctx.rotate( x.r )
            ctx.translate( -75, -75 )
            ctx.drawImage( x.c, 0, 0 )
            ctx.restore()

        })

        if ( k <= 0 ){
            particules.length=0
            return true
        }
    }
}
