import point                    from 'math/point'
import paintPerlin              from 'ui/perlin'
import {create}                 from 'ui/dom'

const color_flat_background = '#2e3042'

document.body.style.backgroundColor = color_flat_background


module.exports = ( width, height, resolution, faces, vertices, perlin ) => {


    //// instanciate canvas

    const static_canvas   = create( null, 'canvas' )
    const dynamic_canvas  = create( null, 'canvas' )
    dynamic_canvas.width  = static_canvas.width  = width  * resolution
    dynamic_canvas.height = static_canvas.height = height * resolution

    const static_ctx = static_canvas.getContext('2d')
    static_ctx.save()
    static_ctx.scale( resolution, resolution )

    const dynamic_ctx = dynamic_canvas.getContext('2d')
    dynamic_ctx.save()
    dynamic_ctx.scale( resolution, resolution )

    //// static

    // paint flat background
    static_ctx.save()
    static_ctx.fillStyle=color_flat_background
    static_ctx.rect(0,0,width,height)
    static_ctx.fill()
    static_ctx.restore()

    // blend perlin noise
    const perlin_canvas  = document.createElement('canvas')
    perlin_canvas.width  = width
    perlin_canvas.height = height
    const perlin_ctx = perlin_canvas.getContext('2d')
    paintPerlin( perlin_ctx, width, height, perlin, 0.24, 68 )

    static_ctx.save()
    static_ctx.globalCompositeOperation = 'overlay'

    static_ctx.drawImage( perlin_canvas, 0, 0 )
    static_ctx.restore()

    // draw unused graph
    static_ctx.save()
    static_ctx.globalAlpha = 0.035
    static_ctx.globalCompositeOperation = 'lighten'
    static_ctx.strokeStyle = '#fff'
    static_ctx.lineWidth   = 1
    faces.forEach( face => {

        static_ctx.beginPath()
        static_ctx.moveTo( vertices[face[0]].x, vertices[face[0]].y )
        for( let i=face.length; i--; )
            static_ctx.lineTo( vertices[face[i]].x, vertices[face[i]].y )
        static_ctx.stroke()
    })
    static_ctx.restore()

    static_ctx.restore()
    dynamic_ctx.restore()



    const particules = []

    const createParticule = () => {
        const f = faces[ Math.floor( Math.random() * faces.length ) ]
        const i = Math.floor( Math.random() * f.length )

        const a = vertices[f[i]]
        const b = vertices[f[(i+1)%f.length]]

        const n = point.sub( b, a )
        const l = 5 * ( Math.random() > 0.5 ? 1 : -1 ) * ( Math.random() + 2 ) / point.length( n )

        return {
            ...point.lerp( vertices[f[i]], vertices[f[(i+1)%f.length]], Math.random() ),
            v : {
                x: -n.y * l + Math.random() * 3,
                y:  n.x * l,
            },
            l : Math.floor( Math.random() + 1 )*40,
            t : 0,
            s : ( Math.random() + 1 )*0.9,
        }
    }
    const update = () => {

        dynamic_ctx.clearRect(0, 0, width*resolution, height*resolution )
        dynamic_ctx.save()
        dynamic_ctx.scale( resolution, resolution )
        static_ctx.globalCompositeOperation = 'lighten'
        dynamic_ctx.fillStyle = '#4bc2bb'

        for( let k=6;k--;)
            particules.push(createParticule())

        for( let i=particules.length; i--; )
        {
            particules[i].t ++

            const {x,y,v,t,l,s} = particules[i]

            if ( t > l )
                particules.splice(i,1)

            const k = t/l

            dynamic_ctx.beginPath()
            dynamic_ctx.arc( x + v.x * k, y + v.y * k, ( 1+ Math.abs( 0.2 - k ) ) * s , 0, Math.PI*2 )

            dynamic_ctx.globalAlpha =  Math.abs( 0.5 - k * 0.4 ) * 0.4
            dynamic_ctx.fill()
        }


        dynamic_ctx.restore()
    }

    return {
        width,
        height,
        r:resolution,
        s: static_canvas,
        d: dynamic_canvas,
        u: update,
    }
}
