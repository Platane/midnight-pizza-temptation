module.exports = ( carriers ) => {

    const carrier_by_which = {}

    document.addEventListener('keydown', event => {

        let key
        let which = event.which

        if( which >= 65 && which <= 90 )
            key = event.key

        if ( !key )
            return

        if( !carrier_by_which[ which ] ){
            const carrier = carriers.find( carrier => !carrier.control )

            if ( !carrier )
                return

            carrier.game.score = 0
            carrier.game.waitAfterScore = 0

            carrier.control = {
                key,
                color       : which,
                acceleration: 0,
            }

            carrier_by_which[ which ] = carrier
        }

        const { control, info } = carrier_by_which[ which ]

        control.acceleration = info.maxAcc
    })

    document.addEventListener('keyup', event => {

        if( !carrier_by_which[ event.which ] )
            return

        const { control, info } = carrier_by_which[ event.which ]

        control.acceleration = -info.maxBrake

    })
}
