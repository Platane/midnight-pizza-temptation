require('file?name=index.html!./index.html')

import { drawNetwork, drawCarriers, clear }      from './ui'

const n= 5
const network = {
    nodes    : [
        ...Array.from({ length: n }, (_,i) => ({ x: Math.cos( i/n * 6.28 ) * 200 + 250, y: Math.sin( i/n * 6.28 ) * 200 + 250 })),
        { x: 250, y: 250 },
    ],
    arcs     : [
        ...Array.from({ length: n }, (_,i) => ({ a: n, b:i }) ),
        ...Array.from({ length: n }, (_,i) => ({ b: n, a:i }) ),
    ],
}


const carriers = [
    {
        position : {
            arc : 1,
            k   : 0.4
        },
    }
]


const loop = () => {

    carriers[ 0 ].position.k += 0.01

    if ( carriers[ 0 ].position.k >=1 ) {
        carriers[ 0 ].position.k= 0
        carriers[ 0 ].position.arc = carriers[ 0 ].position.arc == 1
            ? n+1
            : 1
    }

    clear()
    drawNetwork( network )
    drawCarriers( network, carriers )

    requestAnimationFrame( loop )
}
loop()
