require('file?name=doc.html!./index.html')


import {getLastBuilds} from './fetch'
import createGraph     from './ui'

Promise.all(
    Array.from({ length: 5 })
        .map((_,i) => getLastBuilds( i*20 ) )
)
    .then( buildss =>
        [].concat( ...buildss )
            .filter( (build,i,arr) => arr.findIndex( b => build.id == b.id ) == i )
            .sort( (a,b) => a.date > b.date ? 1 : -1 )
    )

    .then( createGraph )
    .then( dom => document.body.appendChild( dom ) )
    .catch( err => console.log( err ) )
