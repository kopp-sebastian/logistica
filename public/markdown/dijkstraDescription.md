## Algorithmus von Dijkstra

**Allgemeines**

Der Algorithmus von Dijkstra ist ein Baumalgorithmus und dient der Bestimmung kürzester Wege von einem Startknoten ("Wurzel") zu allen anderen Knoten.

**Ein- und Ausgabedaten**

Grundlage des Verfahrens ist ein (Di)Graph, der auf der Zeichenfläche (links) erstellt werden muss.

Bei jeder Änderung des Graphen wird sofort der Algorithmus von Dijkstra neu durchgeführt.

Im Ausgabebereich (rechts) werden dargestellt: der Startknoten, die Zielknoten, die Entfernung und der jeweilige Vorgänger des Zielknotens.

Mit den beiden Pfeiltasten (rechts oben) kann der Startknoten ausgewählt werden.

**Verfahren**

1. Erstelle eine Menge `M`, die nur die Wurzel `q` enthält. Setze alle Entfernungen `d(q.j)` auf unendlich.
2. Wähle den Knoten `i` aus `M`, der die geringste Entfernung `d(q.i)` zur Wurzel hat. Eliminiere den Knoten `i` aus `M`.
3. Fallunterscheidung für alle Nachfolger `j` von `i`:

    a) `j` ist nicht Element von `M` und `d(q.j)` ist unendlich (j noch nicht von q aus erreicht) --> `d(q.j) = d(q,i) + c(i,j)`, Füge `j` zu `M` hinzu.
    b) `j` ist nicht Element von `M` aber `d(qj)` ist nicht unendlich (j war bereits markiert) --> Wähle nächstes `j` oder gehe zur nächsten Iteration.
    c) `j` ist Element von `M` und der Weg über `i` ist kürzer als der bisherige (`d(q,i) + c(i,j) < d(q.j)`) --> `d(q.j) = d(q,i) + c(i,j)`. Außerdem wird `i` zum Vorgänger von `j`.
4. `M` ist keine leere Menge --> gehe zu 2), ansonsten endet das Verfahren.

**Zusätzliche Hinweise**

* Die Länge des kürzesten Weges von `q` nach `j` wird mit `d(q.j)` bezeichnet.
* Der Vorgänger von `j` auf dem kürzesten Weg von `q` nach `j` wird mit `v(j)` bezeichnet.
* Der Algorithmus von Dijkstra kann auch für gewichtete Graphen verwendet werden.

**Beispiel**

Gegeben sei der folgende Graph:

Graph: [ungültige URL entfernt]

Der Startknoten sei `q`.

**Schritt 1**

`M = {q}`
`d(q.a) = ∞`
`d(q.b) = ∞`
`d(q.c) = ∞`

**Schritt 2**

`i = q`
`d(q.q) = 0`

**Schritt 3**

a) `j = a`
`d(q.a) = 0 + 1 = 1`
`M = {q, a}`

b) `j = b`
`d(q.b) = 0 + 4 = 4`
`M = {q, a, b}`

c) `j = c`
`d(q.c) = 0 + 5 = 5`
`M = {q, a, b, c}`

**Schritt 4**

`M` ist leer. Das Verfahren endet.

**Ergebnis**

Die kürzesten Wege von `q` nach allen anderen Knoten sind:

* `q` nach `a`: 1
* `q` nach `b`: 4
* `q` nach `c`: 5

**Vorgänger**

Die Vorgänger auf den kürzesten Wegen sind:

* `v(a) = q`
* `v(b) = q`
* `v(c) = b`
