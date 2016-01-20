var Backbone = require('backbone');
module.exports = Vector = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0
    },
    initialize: function (x, y) {
        //check if first arg is an object with x and y or if we have two numeric args
        if (typeof x === "object") {
            //we have an object, so we assume default map with x and y
        } else {
            //console.info("Hope for two numbers", x, y, " Is it?");
            //console.info(typeof x, typeof y);
            if ((typeof x === "number") && (typeof y === "number")) {
                this.set("x", x);
                this.set("y", y);
                //console.log(this.toString());
            } else {
                console.error("Vector init messed up: ", x, y);
            }
        }

        //console.log(options," bei construct", a, b);
        //console.log("X", this.get("x"));
        //console.log("Y", this.get("y"));
    },
    clone: function() {
        return new Vector(this.attributes);
    },
    toString: function () {
        return '(' + this.get("x") + '|' + this.get("y") + ")";
    },
    getDirection: function (xy) {
        var d = this.get(xy);
        if (d == 0) return 0;
        return d / Math.abs(d);
    },
    getXDirection: function () {
        return this.getDirection("x");
    },
    getYDirection: function () {
        return this.getDirection("y");
    },
    getLength: function () {
        return Math.sqrt(Math.pow(this.get("x"), 2) + Math.pow(this.get("y"), 2));
    },
    decelerate: function (xy) {
        if (xy) {
            var v = this.get(xy);
            if (v == 0) return true;
            var v = (Math.abs(this.get(xy)) - 1) * this.getDirection(xy);
            this.set(xy, v);
        } else {
            this.decelerate("x");
            this.decelerate("y");
        }
    },
    /**
     * returns all Vectors that are passed
     *
     */
    /*--------------------------------------------------------------
     * von quabla modifizierter Bresenham-Algorithmus in php
     * nach der auf wikipedia gefundenen C-Implementierung
     *
     * und dann von Didi in Javascript verwandel
     *---------------------------------------------------------------
     */
    getPassedVectors: function () {
        var dx = this.get("x");
        var dy = this.get("y");

        // Vorzeichen des Inkrements bestimmen
        var incx = (dx > 0) ? 1 : ( (dx < 0) ? -1 : 0);
        var incy = (dy > 0) ? 1 : ((dy < 0) ? -1 : 0);

        //console.log("Starte mit", dx, dy, incx, incy);

        // negative positiv machen
        dx = Math.abs(dx);
        dy = Math.abs(dy);
        //console.log("Bin bei", dx, dy, incx, incy);

        // feststellen, welche Entfernung größer ist
        if (dx > dy) {
            // x ist schnelle Richtung
            var pdx = incx;
            var pdy = 0;     // pd. ist Parallelschritt
            var qdx = 0;
            var qdy = incy; // qd. ist Querschritt
            var ddx = incx;
            var ddy = incy; // dd. ist Diagonalschritt
            var es = dy;
            var el = dx;   // Fehlerschritte schnell, langsam
        } else {
            // y ist schnelle Richtung
            var pdx = 0;
            var pdy = incy; // pd. ist Parallelschritt
            var qdx = incx;
            var qdy = 0;     // qd. ist Querschritt
            var ddx = incx;
            var ddy = incy; // dd. ist Diagonalschritt
            var es = dx;
            var el = dy;   // Fehlerschritte schnell, langsam
        }

        //console.log("Zwisch", pdx, pdy, qdx, qdy, ddx, ddy, es, el);
        // Initialisierungen vor Schleifenbeginn
        var x = 0;
        var y = 0;

        var vecs = {};
        //console.log("Init with ", x, y);
        var v = new Vector({x: 0, y: 0});
        vecs[v.toString()] = v;
        //console.log(v);

        // Pixel berechnen
        var err = (el - es) / 2;

        /* das Vorzeichen von err gibt an, auf welcher Seite des Vektors sich
         * der Mittelpunkt des zuletzt betrachteten Kaestchens befindet.
         * Bei Abweichung in "langsamer" Richtung ist err positiv,
         * und wir machen einen Schritt in "schneller" Richtung.
         * bei Abweichung in "schneller" Richtung ist err negativ,
         * und wir machen einen Schritt in "langsamer" Richtung.
         */

        //console.log("putting ", x, " ", y, " at err");
        do {
            if (err < 0) {
                // Fehlerterm wieder positiv (>=0) machen
                //Schritt in langsame Richtung, Querschritt
                err += el;
                x += qdx;
                y += qdy;
            } else if (err > 0) {
                // Schritt in schnelle Richtung, Parallelschritt
                err -= es;
                x += pdx;
                y += pdy;
            } else {
                // Schrit Diagonal
                err += el;
                err -= es;
                x += ddx;
                y += ddy;
            }
            //console.log("putting ", x, " ", y, "at $err");
            v = new Vector({x: x, y: y});
            vecs[v.toString()] = v;
        } while (((Math.abs(x) != dx) || (Math.abs(y) != dy)));
        //console.log("Return ", vecs);
        return vecs;
    }
});
