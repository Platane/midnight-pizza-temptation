const n= 5
export const network = {
    nodes    : [
        {
            x: 50, y: 20,
            exchanges : [
                {arc_a:4, arc_b:0, pass:[], block:[]},
            ],
            entering : [],
            leaving  : [],
        },
        {
            x: 950, y: 20,
            exchanges : [
                {arc_a:3, arc_b:1, pass:[], block:[]},
            ],
        },
        {
            x: 500, y: 480,
            exchanges : [
                {arc_a:2, arc_b:3, pass:[], block:[]},
                {arc_a:2, arc_b:4, pass:[], block:[]},
            ],
        },

        {
            x: 500, y: 100,
            exchanges : [
                {arc_a:0, arc_b:2, pass:[1], block:[]},
                {arc_a:1, arc_b:2, pass:[], block:[0]},
            ],
        },
    ],
    arcs     : [
        { a: 0, b: 3, maxSpeed:5 },
        { a: 1, b: 3, maxSpeed:5 },
        { a: 3, b: 2, maxSpeed:5 },

        { a: 2, b: 1, maxSpeed:5 },
        { a: 2, b: 0, maxSpeed:5 },
    ],
}
