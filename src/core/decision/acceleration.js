import {getCarrierAheadCarrier} from 'core/util/ahead'


const computeAcceleration = ( carriers, me ) => {

    const {distance} = getCarrierAheadCarrier( carriers, me ) || { distance: Infinity }

    if ( distance > 36 )
        return me.info.maxAcc

    else if ( distance < 25 )
        return -me.info.maxBrake

    else
        return 0

}

module.exports = { computeAcceleration }
