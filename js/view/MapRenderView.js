/**
 * Created with JetBrains PhpStorm.
 * User: pdietrich
 * Date: 10.08.12
 * Time: 12:07
 * To change this template use File | Settings | File Templates.
 */

var MapRenderView = MapBaseView.extend({
    id: "mapRenderView",
    className: "mapRenderView",
    tagName: "canvas",
    initialize: function (options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "render", "drawBorder", "drawField", "drawFlagField", "drawStandardField", "drawStartField");
        this.model.bind("change:mapcode", this.render);
        this.mapViewSettings.bind("change", this.render);
        this.palette = new MapRenderPalette();
    },
    render: function () {
        var map = this.model;
        this.size = this.mapViewSettings.get("size");
        this.border = this.mapViewSettings.get("border");
        this.el.width = map.get("cols") * (this.fieldSize);
        this.el.height = map.get("rows") * (this.fieldSize);

        this.ctx = this.el.getContext("2d");

        this.ctx.fillStyle = this.palette.getRGB("offroad");
        this.ctx.lineWidth = this.mapViewSettings.get("size");

        this.ctx.fillRect(0, 0, this.el.width, this.el.height);
        for (var r = 0; r < map.get("rows"); r++) {
            for (var c = 0; c < map.get("cols"); c++) {
                this.drawField(r, c, map.getFieldAtRowCol(r, c));
            }
        }
    },

    drawField: function (r, c, field) {
        x = c * (this.fieldSize);
        y = r * (this.fieldSize);

        //faster than 1x1 rect
        //this.specle=this.ctx.getImageData(0,0,1,1);

        if ((field == "X") || (field == "Y") || (field == "Z") || (field == "O") || (field == "V") || (field == "W") || (field == ".")) {
            fillColor = this.palette.getRGB(field);
            specleColor = this.palette.getRGB(field + "specle");
            this.drawStandardField(x, y, fillColor, specleColor);
        }

        //finish
        if (field == "F") {
            this.drawFlagField(x, y, this.palette.getRGB('finish1'), this.palette.getRGB('finish2'));
        }

        //checkpoint
        if ((parseInt(field) == field)) {
            //if (this.cpEnabled)
            if (1 == 1) {
                var fg = this.palette.getRGB('checkpoint' + field);

                if (field % 2) {
                    var bg = this.palette.getRGB('checkpointBgOdd');
                } else {
                    var bg = this.palette.getRGB('checkpointBgEven');
                }
                this.drawFlagField(x, y, fg, bg);
            } else {
                this.drawField(r, c, "O");
            }
        }

        //Start
        if (field == "S") {
            this.drawStartField(x, y, this.palette.getRGB('start1'), this.palette.getRGB('start2'));
        }

        //Parc ferme
        if (field == "P") {
            this.drawStandardField(x, y, this.palette.getRGB('parc'), this.palette.getRGB('roadspecle'), false); //no specles
        }
    },

    drawStandardField: function (x, y, fg, specle) {
        this.ctx.fillStyle = fg;
        this.ctx.beginPath();
        this.ctx.rect(x, y, this.size, this.size);
        this.ctx.fill();

        //check optional param to force "no specles"
        var drawSpecles = this.specles;
        if (arguments[4] === false) {
            drawSpecles = false;
        }

        this.drawBorder(x, y, specle);
        if (drawSpecles) {
            this.ctx.fillStyle = specle;
            for (var i = 0; i < this.size; i++) {
                this.ctx.beginPath();
                var xr = Math.round(Math.random() * (this.size - 1));
                var yr = Math.round(Math.random() * (this.size - 1));
                this.ctx.rect(x + xr, y + yr, 1, 1);
                this.ctx.fill();
            }
        }
    },

    drawBorder: function (x, y, specle) {
            this.ctx.lineWidth = this.border;
            this.ctx.strokeStyle = specle;
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.size + .5, y);
            this.ctx.lineTo(x + this.size + .5, y + this.size + .5);
            this.ctx.lineTo(x, y + this.size + .5);
            this.ctx.stroke();
            this.ctx.closePath();
    },

    drawFlagField: function (x, y, c1, c2) {
        this.ctx.fillStyle = c2;
        this.ctx.beginPath();
        this.ctx.rect(x, y, this.size, this.size);
        this.ctx.fill();

        var factor = Math.round(this.size / 4);
        var sende = this.size / factor;

        for (var m = 0; m < sende; m++) {
            for (var n = 0; n < sende; n++) {
                if ((m + n) % 2 == 1) {
                    this.ctx.fillStyle = c1;
                    this.ctx.beginPath();
                    var xm = Math.round(x + m * factor);
                    var yn = Math.round(y + n * factor);
                    this.ctx.rect(xm, yn, factor, factor);
                    this.ctx.fill();
                }
            }
        }
        this.drawBorder(x, y, this.palette.getRGB('roadspecle'));
    },

    drawStartField: function (x, y) {
        this.ctx.fillStyle = this.palette.getRGB('start2');
        this.ctx.beginPath();
        //this.ctx.rect(x,y,this.size,this.size); //instead of border make larger
        var newSize = this.size + this.border;
        this.ctx.rect(x, y, newSize, newSize);
        this.ctx.fill();

        //fg square
        this.ctx.strokeStyle = this.palette.getRGB('start1');
        this.ctx.beginPath();
        this.ctx.rect(x + 0.3 * newSize, y + 0.3 * newSize, 0.4 * newSize, 0.4 * newSize);
        this.ctx.stroke();

        //imagerectangle($this->image, $x+0.3*$this->this.size, $y+0.3*$this->this.size, $x+0.7*($this->this.size+border), $y+0.7*($this->this.size+border), $c1);

        //add border
        //$this->drawBorder($x,$y,$this->MapPalette['roadspecle']);
    }
});
