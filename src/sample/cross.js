const n= 5
export const network = {
    nodes    : [
        {
            x: 50, y: 20,
            exchange : [
                {a:2, b:4, before:[], after:[]},
            ],
        },
        {
            x: 950, y: 20,
            exchange : [
                {a:4, b:3, before:[], after:[]},
            ],
        },
        {
            x: 50, y: 480,
            exchange : [
                {a:4, b:0, before:[], after:[]},
            ],
        },
        {
            x: 950, y: 480,
            exchange : [
                {a:1, b:4, before:[], after:[]},
            ],
        },

        {
            x: 500, y: 250,
            exchange : [
                {a:0, b:2, before:[], after:[]},
                {a:0, b:1, before:[], after:[]},
                {a:3, b:2, before:[], after:[]},
                {a:3, b:1, before:[], after:[]},
            ],
        },
    ],
    arcs     : [
        { a: 0, b: 4, maxSpeed:5 },
        { a: 3, b: 4, maxSpeed:5 },
        { a: 4, b: 1, maxSpeed:5 },
        { a: 4, b: 2, maxSpeed:5 },

        { a: 1, b: 3, maxSpeed:5 },
        { a: 2, b: 0, maxSpeed:5 },
    ],
}
