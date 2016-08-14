
import { computeAcceleration }  from 'core/decision/acceleration'
import { choseNewRoute }        from 'core/decision/route'

const step = ( network, carriers ) =>

    // let say the state at N+1 is not quite distinguable from the state at N
    carriers
        .forEach( carrier => {

            // change arc at the end of the arc
            if ( carrier.position.k >=1 ) {

                // get new route if this one is over
                if ( carrier.decision.path.length == 0 )
                    choseNewRoute( network, carrier )

                // next arc
                const nextArc = carrier.decision.path.shift()
                carrier.position.arc    = network.nodes[ network.arcs[ carrier.position.arc ].b ].leaving
                    .find( arc => arc.b == nextArc )
                    .index

                carrier.position.k      = 0
            }

            // compute the acceleration
            carrier.position.velocity = Math.max(0,
                Math.min( carrier.info.maxVelocity,
                    carrier.position.velocity + computeAcceleration( network, carriers, carrier )
                )
            )

            // move the carrier
            carrier.position.k += carrier.position.velocity / network.arcs[ carrier.position.arc ].length
        })



module.exports = { step }
