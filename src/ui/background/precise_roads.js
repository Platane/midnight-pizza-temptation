
import point                    from 'math/point'
import {exchangeCurve}          from 'ui/exchange-projection'
import {create}                 from 'ui/dom'

const color_road            = '#4bc2bb'



module.exports = ( width, height, resolution, network, max_weight, marge, margeBezier ) => {

    const static_canvas   = create( null, 'canvas' )
    const dynamic_canvas  = create( null, 'canvas' )
    dynamic_canvas.width  = static_canvas.width  = width  * resolution
    dynamic_canvas.height = static_canvas.height = height * resolution

    const static_ctx = static_canvas.getContext('2d')
    static_ctx.save()
    static_ctx.scale( resolution, resolution )

    const dynamic_ctx = dynamic_canvas.getContext('2d')



    // draw graph
    static_ctx.save()
    static_ctx.lineWidth      = 0.4
    static_ctx.strokeStyle    = color_road
    static_ctx.globalAlpha    = 0.8
    network.arcs
        .forEach( ({ node_a, node_b, weight }) => {

            const n = point.sub( node_b, node_a )
            const l = point.length( n )

            if ( l< margeBezier )
                return

            n.x /= l
            n.y /= l

            const a = {
                x : node_a.x + n.x * margeBezier - n.y * marge,
                y : node_a.y + n.y * margeBezier + n.x * marge,
            }
            const b = {
                x : node_b.x - n.x * margeBezier - n.y * marge,
                y : node_b.y - n.y * margeBezier + n.x * marge,
            }

            static_ctx.beginPath()
            static_ctx.moveTo( a.x, a.y )
            static_ctx.lineTo( b.x, b.y )
            static_ctx.stroke()
        })

    // draw exchanges
    ;[].concat( ...network.nodes.map( node => node.exchanges ) )
        .forEach( ex => {

            const { A,C,B } = exchangeCurve( marge, margeBezier, ex.node_a, ex.arc_a.node_b, ex.node_b )

            static_ctx.beginPath()
            static_ctx.moveTo( A.x, A.y )
            static_ctx.quadraticCurveTo( C.x, C.y, B.x, B.y )
            static_ctx.stroke()
        })

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




    const particules = []

    const update = () => {

        // // particule
        // dynamic_ctx.save()
        // dynamic_ctx.scale( resolution, resolution )
        // dynamic_ctx.fillStyle    = color_road
        // dynamic_ctx.globalAlpha  = 0.2
        // network.endPoints.forEach( ({ node }) => {
        //     dynamic_ctx.beginPath()
        //     dynamic_ctx.arc( node.x, node.y, 9, 0 , Math.PI*2 )
        //     dynamic_ctx.fill()
        //     dynamic_ctx.beginPath()
        //     dynamic_ctx.arc( node.x, node.y, 7, 0 , Math.PI*2 )
        //     dynamic_ctx.fill()
        // })
        // dynamic_ctx.globalAlpha  = 1
        // dynamic_ctx.fillStyle    = '#fff'
        // dynamic_ctx.strokeStyle  = '#555'
        // dynamic_ctx.lineWidth    = 2
        // network.endPoints.forEach( ({ node }) => {
        //     dynamic_ctx.beginPath()
        //     dynamic_ctx.arc( node.x, node.y, 4, 0 , Math.PI*2 )
        //     dynamic_ctx.fill()
        //     dynamic_ctx.stroke()
        // })
        // dynamic_ctx.restore    = 2

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
