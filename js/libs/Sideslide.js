var Sideslide = function (el, options) {
        options = options || {};
        this.el = el;
        this.$el = $(el);
        this.borderPercent = .2;
        this.dw = $(document).width();
        this.sw = this.$el.width();
        this.isActive = false;
        this.isVisible = false;
        this.side = options.side || "right";
        this.rightSide = this.side == "right";
        this.x = 0;

        this.slideIn = function () {
            if (this.rightSide) {
                this.$el.animate({
                    left: this.dw - this.sw
                });
            } else {
                this.$el.animate({
                    left: 0
                });
            }
            //this.$el.hide();
            console.log("DA");
        };

        this.slideOut = function () {
            if (this.rightSide) {
                this.$el.animate({
                    left: -this.sw
                })
            } else {
                this.$el.animate({
                    left: this.dw
                })
            }
            console.log("WEG");
        };

        this.slideTo = function (x) {
            if (!this.rightSide) {
                x = x - this.sw;
            }
            this.$el.css({
                left: x
            });
        };

        this.isPulledOut = function () {
            return (this.x < this.dw - (this.sw / 2));
        }

        this.handleStart = function (e) {
            var x = e.center.x;
            var b = this.dw * (1 - this.borderPercent);

            console.log(e.type + " " + e.center.x);
            console.log(x + " > " + b);

            if (this.rightSide) {
                this.isActive = (x > this.dw * (1 - this.borderPercent));
            } else {
                this.isActive = (x < this.dw * this.borderPercent);
            }
            if (this.isActive || this.isVisible) {
                this.$el.show();
                this.slideTo.call(this, x);
                this.isVisible = true;
            }
        };

        this.handleDrag = function (e) {
            if (this.isVisible || this.isActive) {
                var x = e.center.x;
                //only pull out max width
                if (this.rightSide) {
                    if (x < this.dw-this.sw) {
                        x = this.dw-this.sw;
                    }
                } else {
                    if (x > this.sw) {
                        x = this.sw
                    }
                }
                this.x = x;
                this.slideTo.call(this, x);
                console.log(e.type + " " + x);
                e.preventDefault();
            }
        };

        this.handleEnd = function (e) {
            if (!(this.isActive || this.isVisible)) {
                return true;
            }

            //only if active
            console.log(e.type + " " + e.center.x);
            this.isActive = false;
            var x = e.center.x;

            //default closed
            var endOpen = false;

            //now fully open or close?
            //was it moved out more then half way?
            if (this.isPulledOut()) {
                //open it
                endOpen = true;
            }

            //now high velocity overrules
            var v = e.velocityX;
            //positive x velo is right to left
            if (Math.abs(v) > .5) {
                endOpen = (v > 0);
            }
            if (endOpen) {
                this.slideOut();
            } else {
                this.slideIn();
            }
            console.log("Now act, vis", this.isActive, this.isVisible);
        }

//init
        var hammerOptions = {};
        var hammertime = new Hammer(document.body, hammerOptions);
        hammertime.get('pan').set({direction: Hammer.DIRECTION_HORIZONTAL});
        hammertime.on("press", this.handleStart.bind(this));
        hammertime.on("panstart", this.handleStart.bind(this));
        hammertime.on('pan', this.handleDrag.bind(this));
        hammertime.on("panend", this.handleEnd.bind(this));

    }
    ;