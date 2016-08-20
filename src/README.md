


# structure

```yaml
network :
    arcs :
        -   index   : <int>             # index of the arc in the network.arcs array
        -   a       : <int>             # index of the starting node in the network.nodes array
        -   b       : <int>             # index of the ending node in the network.nodes array
        -   length  : <number>          # distance between the starting and ending node

    nodes :
        -   index   : <int>             # index of the arc in the network.nodes array
        -   x       : <number>
        -   y       : <number>
        -   entering:
            - <int>                     # index of arc which enters the node

        -   leaving:
            - <int>                     # index of arc which leaves the node

        -   exchanges:
            - arc_a     : <int>         # index of arc which comes in
            - arc_b     : <int>         # index of arc which comes out
            - pass      :
                - <int>                 # index of exchanges that carrier in this exchange must let pass

            - block     :
                - <int>                 # index of exchanges that carrier in this exchange can block pass

```
