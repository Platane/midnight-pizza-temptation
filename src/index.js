require('file?name=index.html!./index.html')

import { drawNetwork, drawCarriers, clear }         from './ui'
import { network }                                  from 'sample/star'
import { step }                                     from 'core/runner'
import { prepare as prepareNetwork }                from 'math/graph'

prepareNetwork( network )


const info = {
    maxAcc      : 0.05,         // px . frame^-2
    maxBrake    : 0.14,         // px . frame^-2
    maxVelocity : 3,            // px . frame^-1
}

const carriers = Array.from({ length: 10 })
    .map((_,i) =>
        ({
            position : {
                arc         : i % network.arcs.length,
                k           : Math.random(),
                velocity    : 0,
            },
            decision : {
                path : [],
                wait : 0,
            },
            info : {
                ...info,
                maxVelocity : Math.random() + 1,
            },
        })
    )


const loop = () => {

    step( network, carriers )

    clear()
    drawNetwork( network )
    drawCarriers( network, carriers )

    requestAnimationFrame( loop )
}
loop()
