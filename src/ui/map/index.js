
import paintPerlin              from 'ui/perlin'


const color_flat_background = '#101657'
const color_unused_graph    = '#4b4e63'
// const color_road            = '#94df7d'
const color_road            = '#4bc2bb'

document.body.style.backgroundColor = color_flat_background

const drawGlowing = ( ctx, a, b, power ) => {

    ctx.strokeStyle = color_road
    ctx.lineCap     = 'round'
    ctx.globalCompositeOperation = 'lighten'

    for ( let i=(0|power*3)+1 ; i -- ; ){

        ctx.globalAlpha = ( 10 - i )/ 20
        ctx.lineWidth = ( i*i*0.8 + i ) * 0.3 + 1.2
        ctx.beginPath()
        ctx.moveTo( a.x, a.y )
        ctx.lineTo( b.x, b.y )
        ctx.stroke()
    }
}

module.exports = ( width, height, resolution, network, faces, vertices, perlin, max_weight ) => {


    //// instanciate canvas

    const static_canvas  = document.createElement('canvas')
    static_canvas.width  = width  * resolution
    static_canvas.height = height * resolution

    const static_ctx = static_canvas.getContext('2d')
    static_ctx.save()
    static_ctx.scale( resolution, resolution )


    const dynamic_canvas = document.createElement('canvas')
    dynamic_canvas.width  = width  * resolution
    dynamic_canvas.height = height * resolution

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

    // draw graph
    static_ctx.save()
    network.arcs
        // .filter( ({ node_a, node_b }) => node_a.index < node_b.index )
        .forEach( ({ node_a, node_b, weight }) => drawGlowing( static_ctx, node_a, node_b, weight/max_weight ) )
    static_ctx.restore()


    // draw endPoints
    static_ctx.save()
    static_ctx.fillStyle    = color_road
    static_ctx.globalAlpha  = 0.2
    network.endPoints.forEach( ({ node }) => {
        static_ctx.beginPath()
        static_ctx.arc( node.x, node.y, 9, 0 , Math.PI*2 )
        static_ctx.fill()
        static_ctx.beginPath()
        static_ctx.arc( node.x, node.y, 7, 0 , Math.PI*2 )
        static_ctx.fill()
    })
    static_ctx.globalAlpha  = 1
    static_ctx.fillStyle    = '#fff'
    static_ctx.strokeStyle  = '#555'
    static_ctx.lineWidth    = 2
    network.endPoints.forEach( ({ node }) => {
        static_ctx.beginPath()
        static_ctx.arc( node.x, node.y, 4, 0 , Math.PI*2 )
        static_ctx.fill()
        static_ctx.stroke()
    })
    static_ctx.restore()





    static_ctx.restore()
    dynamic_ctx.restore()

    const update = () => 0

    return {
        static_canvas,
        dynamic_canvas,
        update
    }
}
