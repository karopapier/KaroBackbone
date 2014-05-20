                    var EditorMapView=Backbone.View.extend({
                        id: "editorMapView",
                        initialize: function() {
                            _.bindAll(this,"render", "draw", "mousedown", "mouseup", "mousemove", "mouseleave");
							$this=this;
                            this.settings=this.options.settings;
                            this.tools=this.options.tools;
                            this.map =new Map({
                                mapcode: "XOSOFOX"
                            });
                            this.mapRenderView=new MapRenderView({"settings": this.settings, model: this.map});
                            this.$el.bind("contextmenu",function() { return false; });
                            this.$el.append(this.mapRenderView.el);

                            this.$el.css({"display": "inline-block"});
							/**
							this.$el.resizable({
								resize: function(e,ui) {
									var r=(ui.size.height/($this.settings.get("size")+$this.settings.get("border")));
									//console.log(r,$this.map.get("rows"));
								}
							});
							*/
                        },
                        render: function () {
                            this.mapRenderView.render();
                        },
                        events: {
                            'mousedown': 'mousedown',
                            'mouseup': 'mouseup',
                            'mouseleave': 'mouseleave',
                            "contextmenu": function() {
                                return false;
                            }
                        },

                        draw: function(e) {
                            for (var i=1;i<=3;i++) {
                                if (buttonDown[i]) {
                                    var x=e.pageX-this.$el.offset().left;
                                    var y=e.pageY-this.$el.offset().top;
                                    $('#drag'+i).text("("+x+"|"+y+")");
                                    this.mapRenderView.setFieldAtXY(x,y,this.tools.buttonColor[i]);
                                }
                            }
                        },

                        mousedown: function(e) {
                            buttonDown[e.which]=true;
                            e.preventDefault();
                            this.render();
                            this.draw(e);
                            this.$el.bind("mousemove",this.mousemove);
                            return false;
                        },

                        mouseup:function(e) {
                            buttonDown[e.which]=false;
                            this.render();
                            this.$el.unbind("mousemove");
                        },

                        mousemove: function(e) {
                            this.draw(e);
                        },

                        mouseleave:function(e) {
                            for (var i=1;i<=3;i++) {
                                buttonDown[e.which]=false;
                            }
                            this.render();
                        }
                    });
