
const create = ( type, attributs={} ) => {
    const el = document.createElementNS( 'http://www.w3.org/2000/svg', type )
    Object.keys( attributs )
        .forEach( key => el.setAttribute( key, attributs[ key ] ) )

    return el
}

const toPath = ( points ) =>
    points
        .map( (p,i) => `${ i==0 ? 'M' : 'L' } ${ p.x } ${ p.y }` )
        .join(' ')

const width     = 1000
const height    = 300
module.exports = ( builds ) => {

    const svg     = create('svg', {width: width+50, height: height+50})


    const x_resolution = width / ( builds[ builds.length-1 ].date - builds[ 0 ].date )
    const y_resolution = height / ( builds.reduce( (max, build) => Math.max( max, build.size ), 13 ) + 0.5 )

    const points  = builds
        .map( build =>
            ({
                x: ( build.date - builds[ 0 ].date ) * x_resolution,
                y: height - build.size * y_resolution,
                build,
            })
        )


    const path    = create('path',{ d:toPath( points ), fill:'none', stroke:'#ccc' })

    const limit13 = create('path',{ d:toPath( [{x:0, y:height - 13*y_resolution}, {x:width, y:height - 13*y_resolution}] ), fill:'none', stroke:'red' })

    const graph   = create('g', {transform:'translate(25,25)'})

    const axes    = create('g')
    const axe_x   = create('path',{ d:toPath( [{x:0, y:height}, {x:width, y:height}] ), fill:'none', stroke:'#822222' })
    const axe_y   = create('path',{ d:toPath( [{x:0, y:0}, {x:0, y:height}] ), fill:'none', stroke:'#822222' })


    const dots   = create('g')
    points.forEach( p => {
        const dot = create('circle', { cx:p.x, cy:p.y, r:1.5, fill:'#ccc' })
        dots.appendChild( dot )
    })

    axes.appendChild( axe_x )
    axes.appendChild( axe_y )

    graph.appendChild( axes )
    graph.appendChild( limit13 )
    graph.appendChild( path )
    graph.appendChild( dots )
    svg.appendChild( graph )

    return svg
}
