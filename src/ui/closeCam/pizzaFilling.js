import pizzaPool                from 'ui/pizza/pool'


module.exports = ( ctx, width, height, max ) => {

    const rain  = []
    const v     = 700/max
    const u     = 100/max
    let m       = 0

    return t => {

        const k = t/max

        if ( t == max || t == 0 ) {
            rain.length = 0
            m = 0
        }

        if ( k < 0.3 )
            m += u

        else if ( k < 0.4 )
            m += u/2

        else if ( k < 0.5 )
            m += u/4

        while( rain.length < m )
            rain.push({
                x : ( ( rain.length % 3 ) / 3 + Math.random() * 0.3 - 0.3  ) * width * 1.4 ,
                y : - 100,
                i : Math.floor( Math.random() * pizzaPool.length ),
                r : Math.random()*6,
                s : 0.2+Math.random()*0.2,
            })

        ctx.save()
        ctx.beginPath()
        // ctx.globalCompositeOperation  = 'luminosity'
        ctx.fillStyle   = '#333'
        ctx.globalAlpha = Math.min( (1-Math.abs(k-0.5)*2) * 4, 1 ) * 0.6
        ctx.rect(0,0,width,height)
        ctx.fill()
        ctx.restore()


        for ( let i=rain.length; i--; ){

            rain[i].x += v*0.3
            rain[i].y += v
            rain[i].r += 0.02

            ctx.save()
            ctx.translate( rain[i].x, rain[i].y )
            ctx.scale(rain[i].s,rain[i].s)
            ctx.rotate(rain[i].r)
            ctx.drawImage( pizzaPool[ rain[i].i ], 0, 0 )
            ctx.restore()
        }
    }
}
