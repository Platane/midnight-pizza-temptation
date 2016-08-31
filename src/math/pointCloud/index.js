import point from 'math/point'


const k_neighbor    = 50
const k_wells       = 1000
const k_center      = 0.0005
const step = ( points, wells, width, height ) => {

    const velocities = points.map( p => {

        const v = {x:0, y:0}

        // pushed by other points
        points.forEach( u => {

            if ( u == p )
                return

            const vx = u.x - p.x
            const vy = u.y - p.y

            const sq_d = Math.max( 9, vx*vx + vy*vy )

            if ( sq_d > 2000000 )
                return

            const g = - k_neighbor / ( sq_d * Math.sqrt( sq_d ) )

            v.x += vx * g
            v.y += vy * g
        })

        // attracted by wells
        wells.forEach( u => {


            const vx = u.x - p.x
            const vy = u.y - p.y

            const sq_d = Math.max( 400, vx*vx + vy*vy )

            if ( sq_d > 2000000 )
                return

            const g = k_wells / ( sq_d * Math.sqrt( sq_d ) )

            v.x += vx * g
            v.y += vy * g
        })

        // attracked by central point
        const u = { x:width/2, y:height/2 }
        const vx = u.x - p.x
        const vy = u.y - p.y

        const g = k_center

        v.x += vx * g
        v.y += vy * g


        return v
    })

    points.forEach( (p,i) => {

        p.x += velocities[i].x
        p.y += velocities[i].y

    })

    return Math.sqrt(
        velocities.reduce( (max, v) => Math.max( max, point.sqrt_length( v ) ) , 0 )
    )
}


const pickUniformPoints = ( n, width, height ) => {

    const sqrt_r    = width * height * 0.9 / n / Math.PI
    const r         = Math.sqrt( sqrt_r )

    const marge     = r*0.6
    // const l = Math.max( width, height ) / 20
    //
    // const w = Math.ceil( width / l )
    // const h = Math.ceil( height / l )
    //
    // const grid = Array.from({ length: w * h })
    //
    // const p = []
    //
    // while( n ){
    //
    // }

    const ps = []

    while( ps.length < n ){

        let k=30
        let p

        do {

            p = { x: marge + Math.random() * ( width - 2*marge ), y: marge + Math.random() * ( height - 2*marge ) }

        } while( k-- > 0 && ps.some( u => point.sqrt_distance( u, p ) < sqrt_r ) )

        if ( k > 1 )
            ps.push( p )
    }

    return ps
}


/**
 *
 * n_point
 * width
 * height
 * n_well
 *
 */
const generate = ( options = {} ) => {

    const width     = options.width || 100
    const height    = options.height || 100

    const wells = pickUniformPoints( options.n_well || 1, width, height )

    let points = Array.from({ length: options.n_point || 1 })
        .map( () => ({ x: Math.random()*width, y: Math.random()*height, m:Math.random() }))

    let maxV = 1
    let k = 50
    while( maxV > 0 && k -- > 0 )
        maxV = step( points, wells, width, height )

    console.log( maxV )
    points = points.filter( p => p.x > 10 && p.x < width - 10 && p.y > 10 && p.y < height - 10 )

    return { points, wells }
}


module.exports = { generate, step }
