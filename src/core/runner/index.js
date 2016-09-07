
import { computeAcceleration }  from 'core/decision/acceleration'
import { choseNewRoute }        from 'core/decision/route'
import { getAcceleration }      from 'controller'

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
                const next_node = carrier.decision.path.shift()
                carrier.position.arc    = carrier.position.arc.node_b.arcs_leaving
                    .find( arc => arc.node_b == next_node )

                carrier.position.k      = 0
            }

            const acc = carrier.index == 0 && false
                ? getAcceleration() ? carrier.info.maxAcc : -carrier.info.maxBrake
                : computeAcceleration( carriers, carrier )

            // compute the acceleration
            carrier.position.velocity = Math.max(0,Math.min( carrier.info.maxVelocity, carrier.position.velocity + acc ))

            // move the carrier
            carrier.position.k += carrier.position.velocity / carrier.position.arc.length
        })



module.exports = { step }
