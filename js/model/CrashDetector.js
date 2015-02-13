var CrashDetector = Backbone.Model.extend(/** @lends CrashDetector.prototype*/{
    /**
     * @constructor CrashDetector
     * @class CrashDetector
     * Klasse, die Crash vektoren findet
     *
     * @author ulli, toJS by Didi
     *
     */
    /**
     // Diese Vektoren f�hren auf jeden Fall zum Crash
     //private final Set Vector knownCrashs;

     // Diese Vektoren f�hren innerhalb der angegebenen Anzahl Z�ge NICHT zum Crash
     //private final Map Vector, Integer> goodVectors;

     //private final int depth;
     //private final KaroMap map;
     //private final ProgressMonitor monitor;
     //private final Collection Vector  vectors;
     //private int count;

     *
     * @param map Die Map um die es geht
     * @param depth Die Anzahl der Z�ge die voraus geschaut werden soll
     * @param vectors Die vektoren, die �berpr�ft werden sollen
     * @param progressMonitor Der progressMonitor, der �ber den Fortschritt informiert wird
     */
    initialize: function (options) {
        _.bindAll(this, "willCrash");
        if (!options.hasOwnProperty("map") || (typeof options.map === "undefined")) {
            console.error("No map provided to KRACHZ");
            return false;
        }
        //this.depth = options.depth;
        this.depth = 16;
        this.knownCrashs = {};
        this.goodVectors = {};
        this.map = options.map;
    },

    /** Liefrert true, wenn auf Vektor v noch mindestens d - 1 Vektoren folgen k�nnen ohne zu crashen
     *
     * @param v Der vektor
     * @param d Anzahl der vectoren inkl. v
     * @return false: ja es k�nnen noch mindestens d - 1 Vektoren folgen, true: nein => sicherer Crash
     * @throws InterruptedException Abbruch
     */

    willCrash: function (v, d) {

        var vString = v.toString();
        if (vString in this.knownCrashs) {
            return true;
        }

        var dist = this.goodVectors[vString];
        if ((typeof dist !== undefined) && (dist >= d)) {
            return false;
        } else if (d == 1) {
            this.goodVectors[vString] = d;
            return false;
        } else {
            var isCrash = true;

            var possibles = v.getPossibles();
            var plen = possibles.length;
            for (var p = 0; p < plen; p++) {
                var n = possibles[p];
                if (d == this.depth) {
                    count++;
                }

                if (this.map.isPossible(n) && !this.willCrash(n, d - 1)) {
                    isCrash = false;
                    break;
                }
            }

            if (isCrash) {
                this.knownCrashs[vString] = true;
            } else {
                this.goodVectors[v] = d;
            }
            return isCrash;
        }
    }
});
