
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

    const update = () => 0

    return {
        width,
        height,
        r:resolution,
        s: static_canvas,
        d: dynamic_canvas,
        u: update,
    }
}
