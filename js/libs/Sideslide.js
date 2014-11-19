var Sideslide = function (el, options) {
        var me = this;
        options = options || {};
        me.el = el;
        me.$el = $(el);
        me.borderPercent = .1;
        me.isActive = false;
        me.isVisible = false;
		me.ignore = false;
		me.notSure = true;
        me.side = options.side || "right";
        me.rightSide = (me.side == "right");
		me.sw = me.$el.width();
        me.x = 0;

        me.recalc = function () {
			var ori = window.orientation || 0;
			//console.log("Orient " + window.orientation);
			//console.log("wW wH " + $(window).width() + " " + $(window).height());
			//console.log("dW dH " + $(document).width() + " " + $(document).height());
			//console.log("iW iH " + window.innerWidth + " " + window.innerHeight);
			var $dot = $("<div>");
			$("body").append($dot);
			$dot.css({
				right: 0,
				left:'',
				position: "absolute",
				width: 1,
				height: 1,
				backgroundColor: "yellow"
			});
			//console.log($dot);
			//console.log($dot.offset());
			var dotpos =$dot.offset().left + 1;
			$dot.remove();
			//console.log("dot: " + dotpos);
			me.dw = dotpos;
			//console.log("New width: " + me.dw);

        }

        me.rotate = function () {
            //console.log("Rotating, " + me.el.id + " isVisible " + me.isVisible);
            me.recalc();
			me.hide();
			return true;

            if (me.isVisible) {
                //console.log("OPEN", me.el.id);
                me.slideTo(me.openX());
            } else {
                //console.log("CLOSE", me.el.id);
                me.slideOut();
            }
        }


        me.openX = function () {
            //console.log(me.el.id + "is right: " + me.rightSide);
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
            //console.log("DA " + me.el.id);
            me.isVisible = true;
        };

        me.slideOut = function () {
            me.slideTo(me.closeX(), true, me.hide);
            //console.log("WEG " + me.el.id);
            ////me.hide();
        };

		me.hide = function() {
            me.isVisible = false;
			me.$el.hide();
		};

        me.slideTo = function (x, animate, cb) {
            animate = animate || false;
            if (!me.rightSide) {
                x = x - me.sw;
            }
			me.$el.show();
			me.$el.css({"position":"fixed", top: 10});
            if (animate) {
                me.$el.animate({
                    left: x
                }, {complete: cb});
            } else {
                me.$el.css({
                    left: x
                });
            }
            //console.log("Slide to " + x);
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
            console.log(e.type + " " + x);
			//console.log(me.dw);
			me.ignore = false;
			me.notSure = true;

            if (me.rightSide) {
                me.isActive = (x > me.dw * (1 - me.borderPercent));
            } else {
                me.isActive = (x < me.dw * me.borderPercent);
            }

			if (me.isActive && e.type=="press") {
                me.slideTo(x);
			}
            //if (me.isActive || me.isVisible) {
                //me.$el.show();
                //me.isVisible = true;
            //}
        };

        me.handleDrag = function (e) {
			console.log("Drag");
			if (me.ignore) {
				//console.log("ign");
				return true;
			}
			//console.log(e.deltaX + " " + e.deltaY);
			if (me.notSure) {
				me.notSure = false;
				//console.log("Checking ONCE");
				if (Math.abs(e.deltaY)>Math.abs(e.deltaX)) {
					me.ignore=true;
					//console.log("wrong direction");
					return false;
				}
			}
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
            } else {
				//console.log("IGNORE");
			}
        };

        me.handleEnd = function (e) {
			if (me.ignore) {
				//console.log("ign");
				return true;
			}
            if (!(me.isActive || me.isVisible)) {
                return true;
            }

            //only if active
            //console.log(e.type + " " + e.center.x);
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
            //console.log("Now " + me.el.id + " act, vis", me.isActive, me.isVisible);
        }

//init
        var hammerOptions = {};
        var hammertime = new Hammer(document.body, hammerOptions);
        hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL});
        hammertime.on("press", me.handleStart);
        hammertime.on("panstart", me.handleStart);
        hammertime.on('pan', me.handleDrag);
        hammertime.on("panend", me.handleEnd);

        me.recalc();
		me.hide();

        var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        window.addEventListener(orientationEvent, function() {
			me.hide();
			setTimeout(function() {
				me.rotate();
			},700);
		});
    } ;
