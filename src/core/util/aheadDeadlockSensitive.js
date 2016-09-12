import ahead from 'core/util/ahead'


const _cache = []

const _getCarrierAheadCarrier = ( carriers, carrier ) =>
    carrier.index in _cache
        ? _cache[ carrier.index ]
        : _cache[ carrier.index ] || ahead.getCarrierAheadCarrier( carriers, carrier )

const getCarrierAheadCarrier = ( carriers, me ) => {

    if ( me.index == 0 )
        _cache.length = 0

    const res = _getCarrierAheadCarrier( carriers, me )

    if ( !res )
        return null

    const cluster = []
    let next = res.carrier

    while( !cluster.some( c => c == next ) ){

        const x = _getCarrierAheadCarrier( carriers, next )

        if ( !x )
            // no dead lock
            return res

        cluster.push( next )
        next = x.carrier
    }

    // deadlock
    // free one element in the cluster
    if ( cluster.every( c => c.index >= me.index ) )
        return null

    return res
}


module.exports = { getCarrierAheadCarrier }
