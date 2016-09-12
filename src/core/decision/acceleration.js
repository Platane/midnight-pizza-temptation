import {getCarrierAheadCarrier} from 'core/util/aheadDeadlockSensitive'


const computeAcceleration = ( carriers, me ) => {

    const { distance } = getCarrierAheadCarrier( carriers, me ) || { distance: Infinity }

    if ( distance > 26 )
        return me.info.maxAcc

    else if ( distance < 19 )
        return -me.info.maxBrake

    else
        return 0

}

module.exports = { computeAcceleration }
