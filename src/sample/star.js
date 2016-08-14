const n= 5
export const network = {
    nodes    : [
        ...Array.from({ length: n })
            .map((_,i) =>
                ({ x: Math.cos( i/n * 6.28 ) * 200 + 250, y: Math.sin( i/n * 6.28 ) * 200 + 250 })
            )
        ,
        { x: 180, y: 210 },
        { x: 485, y: 320 },
    ],
    arcs     : [
        ...Array.from({ length: n })
            .map((_,i) =>
                ({ a: n, b:i, maxSpeed:50 })
            )
            .filter( x => x.b != 2 && x.b != 1 )
        ,
        ...Array.from({ length: n })
            .map((_,i) =>
                ({ b: n, a:i, maxSpeed:50 })
            )
            .filter( x => x.a != 2 && x.a != 4 )
        ,
        { a: 1, b: n+1, maxSpeed:30 },
        { a: n+1, b: 0, maxSpeed:30 },
        ...Array.from({ length: n })
            .map((_,i) =>
                ({ b: i, a:(i+1)%n, maxSpeed:130 })
            )
        ,
    ],
}
