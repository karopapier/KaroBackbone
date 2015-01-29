var Motion = Backbone.Model.extend(/** @lends Motion.prototype*/{
    defaults: {
        position: {x:0,y:0},
        vector: {x:0,y:0}
    },
    /**
     * @constructor Motion
     * @class Motion
     * A Motion consists of a Position and a Vector. The Vector represents the current momentum, being the vector that "brought the Player here"
     * This means, the Position of a Motion represents the "target" or end point of the motion - NOT THE SOURCE (can be obtained with getSourcePosition() )
     *
     */
    initialize: function () {

    },
    setXY1toXY2: function (x1, y1, x2, y2) {
        var pos = new Position({x: x2, y: y2});
        var vec = new Vector({x: x2 - x1, y: y2 - y1});
        this.set("position", pos);
        this.set("vector", vec);
        return this;
    },
    clone: function () {
        return new Motion({
            position: this.get("position").clone(),
            vector: this.get("vector").clone()
        });
    },
    toString: function () {
        return this.get("position").toString() + " " + this.get("vector").toString();
    },
    toKeyString: function () {
        return this.get("position").toString();
    },
    toMove: function() {
        return {
            x: this.get("position").get("x"),
            y: this.get("position").get("y"),
            xv: this.get("vector").get("x"),
            yv: this.get("vector").get("y")
        }
    },
    /**
     * @return Position
     */
    getStopPosition: function () {
        var pos = new Position(this.get("position").toJSON());
        var vec = new Vector(this.get("vector").toJSON());

        while (vec.getLength() > 0) {
            pos.move(vec);
            vec.decelerate();
        }
        return pos;
    },

    /**
     * @return Position
     */

    getSourcePosition: function () {
        var p = new Position(this.get("position").toJSON());
        p.set("x", p.get("x") - this.get("vector").get("x"));
        p.set("y", p.get("y") - this.get("vector").get("y"));
        return p;
    },

    //public function getStopMovesCount() {
    //return max(abs($this->getVector()->getX()),abs($this->getVector()->getY()));
    //}

    /**
     * returns an array of the 9 theoretically possible motions, indexed by position
     * @return array(Motion)
     */
    /*
     getPossibles: function() {
     }NextMotionsPositionIndex()
     {
     $nm=Array();
     #walk the 9 possibilities to have them arranged like
     # 1 2 3
     # 4 5 6
     # 7 8 9
     for ($tY=-1;$tY<=1;$tY++)
     {
     for ($tX=-1;$tX<=1;$tX++)
     {
     $v=clone $this->getVector();
     $v->setX($v->getX()+$tX);
     $v->setY($v->getY()+$tY);
     $m=clone $this;
     $m->move($v);
     $nm[$m->__toKeyString()]=$m;
     }
     }
     return $nm;
     }
     */

    getPossibles: function () {
        var possibles = [];
        //#walk the 9 possibilities to have them arranged like
        //# 0 1 2
        //# 3 4 5
        //# 6 7 8
        for (var iY = -1; iY <= 1; iY++) {
            for (var iX = -1; iX <= 1; iX++) {
                var x = this.get("vector").get("x") + iX;
                var y = this.get("vector").get("y") + iY;
                if ((x!==0) || (y!==0)) {
                    var v = new Vector({
                        x: this.get("vector").get("x") + iX,
                        y: this.get("vector").get("y") + iY
                    });
                    possibles.push(this.clone().move(v));
                }
            }
        }
        return possibles;
    },

    getPassedPositions: function () {
        return this.getSourcePosition().getPassedPositionsTo(this.get("position"));
    },
    /*
     public function getNextMotionsSortedByLength() {
     $nm=$this->getNextMotions();
     $nml=Array();
     while (list($key,$m)=each($nm)) {
     $nml[$key]=$m->getVector()->getLength();
     }
     asort($nml);

     $nmbl=Array();
     while (list($key,$l)=each($nml)) {
     $nmbl[$key]=$nm[$key];
     }
     return $nmbl;
     }
     */

    /**
     * applies a vector on the current Motion, modifing the position
     * @param Vector
     */
    move: function (v) {
        this.get("position").move(v);
        this.set("vector", v);
        return this;
    }

    /*
     public function getIlluminatedPositions($lightRange=5)
     {
     $xpos=$this->getSourcePosition()->getX();
     $ypos=$this->getSourcePosition()->getY();
     $xvec=$this->getVector()->getX();
     $yvec=$this->getVector()->getY();

     $illuminated=new PositionCollection();
     if (($xvec==0) && ($yvec==0)) {
     for ($j=-2;$j<=2;$j++) {
     for ($k=-2;$k<=2;$k++) {
     $illuX=$xpos+$j;
     $illuY=$ypos+$k;
     $illuminated->addXY($illuX,$illuY);
     }
     }
     } else {
     $factor=$lightRange/sqrt(($xvec*$xvec)+($yvec*$yvec));
     //echo "L�ngenfactor: $factor<BR>";
     $xfactor=round($xvec*$factor);
     $yfactor=round($yvec*$factor);

     for ($i=0;$i<=$lightRange;$i++)
     {
     $illuX=round($xpos + $xfactor * $i/$lightRange);
     $illuY=round($ypos + $yfactor * $i/$lightRange);
     $illuminated->addXY($illuX,$illuY);

     for ($j=-1;$j<=1;$j++) {
     for ($k=-1;$k<=1;$k++)
     {
     $illuX2=$illuX+$j;
     $illuY2=$illuY+$k;
     $illuminated->addXY($illuX2,$illuY2);
     }
     }
     }
     }
     $illuminated->sort();
     return $illuminated;
     }
     */
});
