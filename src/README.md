


# structure

```yaml
network :
    arcs :
        -   node_a       : <node>       # reference to the starting node
        -   node_b       : <node>       # reference to the ending node
        -   length  : <number>          # distance between the starting and ending node

    nodes :
        -   x       : <number>
        -   y       : <number>
        -   entering:
            - <arc>                     # reference to arc that are entering the node

        -   leaving:
            - <arc>                     # reference to arc that are leaving the node

        -   exchanges:                  # describe the possibility of arc change around the node, and the priorities
            - arc_a     : <arc>         # reference to arc from which the carrier arrives
            - arc_b     : <arc>         # reference to arc from which the carrier goes out
            - pass      :
                - <exchange>            # reference to other exchange on this node which are prior to this one

            - block     :
                - <exchange>            # reference to other exchange on this node which are less prior to this one

```
