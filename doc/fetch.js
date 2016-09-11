const urlUtil = require('url')


const appId         = '57b0268dc5f75b010080b91a'
const pipelineId    = '57b0268ea1739a0100c2ac72'
const endPoint      = 'localhost:9003'
const pathname      = '/api/v3/'

const getBuildSize = runId =>
    fetch(
        urlUtil.format({
            protocol    : 'http:',
            host        : endPoint,
            pathname    : pathname+'runs/'+runId+'/steps',
        })
    )
    .then( res => res.json() )
    .then( steps =>
        fetch(
            urlUtil.format({
                protocol    : 'http:',
                host        : endPoint,
                pathname    : pathname+'runsteps/'+steps.find( step => step.displayName == 'build' ).id+'/log',
            })
        )
            .then( res => res.text() )
            .then( text => +text.match(/([.\d]+) Ko/)[1] )
    )

const getLastBuilds = index =>

    fetch(
        urlUtil.format({
            protocol    : 'http:',
            host        : endPoint,
            pathname    : pathname+'runs',
            query       : { pipelineId, limit:20, skip:index||0 }
        })
    )
        .then( res => res.json() )
        .then( builds => Promise.all(

            builds
                .filter( build => build.result == 'passed' )
                .map( build =>

                    getBuildSize( build.id )
                        .then( size =>
                            ({
                                size,
                                date     : new Date( build.createdAt ),
                                message : build.message,
                                id      : build.id,
                            })
                        )

                )

        ))
        .then( builds => builds.sort( (a,b) => a.date > b.date ? 1 : -1 ) )





module.exports = { getLastBuilds }
