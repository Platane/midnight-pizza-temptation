import style        from './style.mcss'
import createCam    from 'ui/closeCam/cam'
import {create}     from 'ui/dom'


module.exports = ( carriers, network, backgrounds, marge, margeBezier ) => {

    const updates   = []
    const dom_root  = create( style.list )

    const update = () => {

        const players= carriers.filter( x => x.control )

        while ( updates.length < players.length ) {

            const { dom, update } = createCam( 340, 280, carriers, network, backgrounds, marge, margeBezier, players[ updates.length ] )

            dom_root.appendChild( dom )

            updates.push( update )
        }

        updates.forEach( fn => fn() )
    }

    return { dom:dom_root, update }
}
