
import { computeAcceleration }          from 'core/decision/acceleration'
import { choseNewRoute }                from 'core/decision/route'
import { getCarrierAheadCarrier }       from 'core/util/aheadDeadlockSensitive'
const shake = require('ui/screenShake').shake

const step = ( network, carriers, players ) =>

    // let say the state at N+1 is not quite distinguable from the state at N
    carriers
        .forEach( carrier => {



            if ( carrier.game.waitAfterScore > 0 ){

                carrier.game.waitAfterScore --

                return
            }

            if ( carrier.game.dead > 0 )
                return

            // change arc at the end of the arc
            if ( carrier.position.k >=1 ) {

                // get new route if this one is over
                if ( carrier.decision.path.length == 0 ) {

                    if ( carrier.control ) {
                        carrier.game.score ++
                        carrier.game.waitAfterScore = 100
                        shake()
                    }

                    carrier.decision.path = choseNewRoute( network, carrier )
                }

                // next arc
                const next_node = carrier.decision.path.shift()
                carrier.position.arc    = carrier.position.arc.node_b.arcs_leaving
                    .find( arc => arc.node_b == next_node )

                carrier.position.k      = 0
            }

            // if the carrier have a control field, take the acceleration from there, otherwise compute it
            const acc = carrier.control
                ? Math.min(carrier.info.maxAcc, Math.max(-carrier.info.maxBrake, carrier.control.acceleration))
                : computeAcceleration( carriers, carrier )

            // compute the acceleration
            carrier.position.velocity = Math.max(0,Math.min( carrier.info.maxVelocity, carrier.position.velocity + acc ))

            // move the carrier
            carrier.position.k += carrier.position.velocity / carrier.position.arc.length

            // check for collision
            if ( carrier.control ){
                const ahead = getCarrierAheadCarrier( carriers, carrier )
                if ( ahead && ahead.distance < 2 ) {
                    // collision
                    // ahead.carrier.game.dead = carrier.game.dead = true
                }
            }

        })



module.exports = { step }
