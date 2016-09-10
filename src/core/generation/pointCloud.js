import {step as sstep}          from 'math/pointCloud'


const pointPerlinRepartition = ( perlin, width, height, n  ) => {

    const points = []
    while( points.length < n ){

        const p = {x:Math.random()*width,y:Math.random()*height}

        if ( Math.random() > perlin( p.x, p.y ) * 2 + 0.5 )
            points.push( p )
    }

    return points
}

module.exports = ( perlin, width, height, n ) => {
    // generate N point with perlin noise repartition
    const points = pointPerlinRepartition( perlin, width, height, n )

    // physic step, to seprate the points
    for( let k=2; k--;)
        sstep( points, [], width, height )

    return points
}
