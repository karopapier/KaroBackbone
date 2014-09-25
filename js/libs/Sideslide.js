var Sideslide = function (el, options) {
        var me = this;
        options = options || {};
        me.el = el;
        me.$el = $(el);
        me.borderPercent = .2;
        me.isActive = false;
        me.isVisible = false;
        me.side = options.side || "right";
        me.rightSide = (me.side == "right");
        me.x = 0;

        me.recalc = function () {
            me.dw = $(document).width();
            me.sw = me.$el.width();
        }

        me.rotate = function () {
            console.log("Rotating, " + me.el.id + " isVisible " + me.isVisible);
            me.recalc();
            if (me.isVisible) {
                console.log("OPEN", me.el.id);
                me.slideTo(me.openX());
            } else {
                console.log("CLOSE", me.el.id);
                me.slideOut();
            }
        }

        me.recalc();

        me.openX = function () {
            console.log(me.el.id + "is right: " + me.rightSide);
            if (me.rightSide) {
                return me.dw - me.sw
            } else {
                return me.sw;
            }
        }

        me.closeX = function () {
            if (me.rightSide) {
                return me.dw
            } else {
                return 0;
            }
        }

        me.slideIn = function () {
            me.slideTo(me.openX(),true);
            console.log("DA " + me.el.id);
            me.isVisible = true;
        };

        me.slideOut = function () {
            me.slideTo(me.closeX(), true);
            console.log("WEG " + me.el.id);
            me.isVisible = false;
            me.$el.hide();
        };

        me.slideTo = function (x, animate) {
            animate = animate || false;
            if (!me.rightSide) {
                x = x - me.sw;
            }
            if (animate) {
                me.$el.animate({
                    left: x
                })
            } else {
                me.$el.css({
                    left: x
                });
            }
            console.log("Slide to " + x);
        };

        me.isPulledOut = function () {
            if (me.rightSide) {
                return (me.x < me.dw - (me.sw / 2));
            } else {
                return (me.x > (me.sw / 2));
            }

        }

        me.handleStart = function (e) {
            var x = e.center.x;
            var b = me.dw * (1 - me.borderPercent);

            console.log(e.type + " " + e.center.x);
            console.log(x + " > " + b);

            if (me.rightSide) {
                me.isActive = (x > me.dw * (1 - me.borderPercent));
            } else {
                me.isActive = (x < me.dw * me.borderPercent);
            }
            if (me.isActive || me.isVisible) {
                me.$el.show();
                me.slideTo(x);
                me.isVisible = true;
            }
        };

        me.handleDrag = function (e) {
            if (me.isVisible || me.isActive) {
                var x = e.center.x;
                //only pull out max width
                if (me.rightSide) {
                    if (x < me.dw - me.sw) {
                        x = me.dw - me.sw;
                    }
                } else {
                    if (x > me.sw) {
                        x = me.sw
                    }
                }
                me.x = x;
                me.slideTo(x);
                e.preventDefault();
            }
        };

        me.handleEnd = function (e) {
            if (!(me.isActive || me.isVisible)) {
                return true;
            }

            //only if active
            console.log(e.type + " " + e.center.x);
            me.isActive = false;
            var x = e.center.x;

            //default closed
            var endOpen = false;

            //now fully open or close?
            //was it moved out more then half way?
            if (me.isPulledOut()) {
                //open it
                endOpen = true;
            }

            //now high velocity overrules
            var v = e.velocityX;
            //positive x velo is right to left
            if (Math.abs(v) > .5) {
                if (me.rightSide) {
                    endOpen = (v > 0);
                } else {
                    endOpen = (v < 0);
                }
            }
            if (endOpen) {
                me.slideIn();
            } else {
                me.slideOut();
            }
            console.log("Now " + me.el.id + " act, vis", me.isActive, me.isVisible);
        }

//init
        var hammerOptions = {};
        var hammertime = new Hammer(document.body, hammerOptions);
        hammertime.get('pan').set({direction: Hammer.DIRECTION_HORIZONTAL});
        hammertime.on("press", me.handleStart);
        hammertime.on("panstart", me.handleStart);
        hammertime.on('pan', me.handleDrag);
        hammertime.on("panend", me.handleEnd);

        var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        window.addEventListener(orientationEvent, me.rotate);
    }
    ;
