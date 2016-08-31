const ctx = typeof document != 'undefined' && document.getElementById('ex').getContext('2d')

import point    from 'math/point'


const create = ( type, attributs={} ) => {
    const el = document.createElementNS( 'http://www.w3.org/2000/svg', type )
    Object.keys( attributs )
        .forEach( key => el.setAttributeNS( 'http://www.w3.org/2000/svg', key, attributs[ key ] ) )

    return el
}

const margin    = 5
const radius    = 60
const arc = ( A, B ) => {

    const l = point.length( A )

    const a = {
        x: A.x/l*radius + A.y/l*margin,
        y: A.y/l*radius - A.x/l*margin,
    }

    const b = {
        x: B.x/l*radius + B.y/l*margin,
        y: B.y/l*radius - B.x/l*margin,
    }

    return [
        'M', a.x, x.y,
        'C', 0, 0, b.x, b.y,
    ].join(' ')
}

const buildExchange = exchanges => {

    const svg = create( 'svg' )

    const arcs = exchanges
        .map( ({ arc_a, arc_b }) => {

            const path = create(
                'path',
                {
                    d : arc(
                        point.sub( arc_a.node_a, arc_a.node_b ),
                        point.sub( arc_b.node_b, arc_b.node_a )
                    )
                }
            )


        })

}
