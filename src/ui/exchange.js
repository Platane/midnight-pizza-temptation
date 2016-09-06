
import point            from 'math/point'
import {intersection}   from 'math/line'

const create = ( type, attributs={} ) => {
    const el = document.createElementNS( 'http://www.w3.org/2000/svg', type )
    Object.keys( attributs )
        .forEach( key => el.setAttribute( key, attributs[ key ] ) )

    return el
}

const margin    = 8


const s = ( A, positive, radius=0 ) => {
    const l = point.length( A )

    return {
        x: A.x/l*radius + A.y/l*margin*(positive?1:-1),
        y: A.y/l*radius - A.x/l*margin*(positive?1:-1),
    }
}

const arc = ( A, B ) => {

    const a = s( A, true, 60 )
    const b = s( B, false,60 )

    const n = point.normalize( B )

    const c = intersection( a, A, b, B )

    return [
        'M', a.x, a.y,
        'Q', c.x, c.y, ',', b.x, b.y,
        'M', b.x, b.y,
        'L', b.x -n.x*10  +  n.y*8,  b.y -n.y*10  -  n.x*8,
        'M', b.x, b.y,
        'L', b.x -n.x*10  -  n.y*8,  b.y -n.y*10  +  n.x*8,
    ].join(' ')
}

const roads = ( A ) => {

    const a     = s( A, true, 60 )
    const a_    = s( A, true, 70 )

    const b     = s( A, false, 60 )
    const b_    = s( A, false, 70 )

    return [
        'M', a.x    , a.y,
        'L', a_.x   , a_.y,
        'M', b.x    , b.y,
        'L', b_.x   , b_.y,
    ].join(' ')
}

const createExchange = exchanges => {

    const svg = create( 'svg', {width:380,height:380, viewBox:'-90 -90 180 180'} )

    svg.appendChild( create( 'circle', {cx:0, cy:0, r:62, fill:'none', stroke:'#eee'} ) )

    const c = exchanges[0].arc_a.node_b

    let nodes = []
    exchanges.forEach( ({ arc_a, arc_b }) => {

        nodes.push({ node: arc_a.node_a })
        nodes.push({ node: arc_b.node_b })

    })
    nodes = nodes.filter( (x,i,arr) => !arr.slice(i+1).some( y => x.node == y.node ) )

    nodes.forEach( (x,i) => {

        const p     = point.normalize( point.sub( x.node, c ) )
        const color = `hsl(${ (i*137+56)%360 }, 70%, 80%)`

        x.circle = create('circle', { cx: p.x*80, cy: p.y*80, r:6, fill:color })
        x.color  = color

        const g = create('g')

        svg.appendChild( g )

        g.appendChild( x.circle )

        g.appendChild( create('path', { d:roads( p ), 'fill': 'none', 'stroke': '#aaa', 'stroke-width': 1 }) )

        const text = create('text', { x:p.x*80+6,  y:p.y*80+5,  fill:color, 'font-family': 'consolas', 'font-size':'8' })
        text.innerHTML = x.node.index
        g.appendChild( text )

    })


    const paths = exchanges
        .map( x => {

            const { arc_a, arc_b } = x

            const path = create(
                'path',
                {
                    d : arc(
                        point.sub( arc_a.node_a, c ),
                        point.sub( arc_b.node_b, c )
                    ),
                    fill            : 'none',
                    'stroke-linecap': 'round',
                }
            )

            svg.appendChild( path )

            return { path, ex:x }
        })

    const setStyle = ( style, path ) => {
        switch( style ){

            case 'main' :
            path.style.strokeWidth = 2
                path.style.stroke = '#b349ad'
                path.style.strokeDasharray = null
                svg.appendChild( svg.removeChild( path ) )
                break

            case 'pass' :
                path.style.strokeWidth = 4
                path.style.stroke = '#29b331'
                path.style.strokeDasharray = null
                svg.appendChild( svg.removeChild( path ) )
                break

            case 'block' :
                path.style.strokeWidth = 5
                path.style.stroke = '#aaaaaa'
                path.style.strokeDasharray = '0,6'
                svg.appendChild( svg.removeChild( path ) )
                break

            default:
                path.style.strokeWidth = 5
                path.style.stroke = '#aaaaaa'
                path.style.strokeDasharray = null
                break
        }
    }


    const getPath = ex => paths.find( x => x.ex == ex ).path
    const selectExchange = ex => {

        paths.forEach( ({ path }) => setStyle( null, path ) )

        ex.block.forEach( ex => setStyle( 'block', getPath( ex ) ) )

        ex.pass.forEach( ex => setStyle( 'pass', getPath( ex ) ) )

        setStyle( 'main', getPath( ex ) )


    }

    paths.forEach( x => x.path.addEventListener('click', () => selectExchange( x.ex ) ) )

    selectExchange( exchanges[0] )

    return svg
}

module.exports = { createExchange }
