
import drawGlowing              from 'ui/base/glow_line'
import {create}                 from 'ui/dom'

const color_road            = '#4bc2bb'
// const color_road            = '#3a678c'

module.exports = ( width, height, resolution, network, max_weight, marge, margeBezier ) => {

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


    // draw graph
    static_ctx.save()
    network.arcs
        // .filter( ({ node_a, node_b }) => node_a.index < node_b.index )
        .forEach( ({ node_a, node_b, weight }) => drawGlowing( static_ctx, node_a, node_b, color_road, weight/max_weight ) )
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
        width,
        height,
        r:resolution,
        s: static_canvas,
        d: dynamic_canvas,
        u: update,
    }
}
