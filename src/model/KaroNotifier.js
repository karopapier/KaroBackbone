var _ = require('underscore');
var Backbone = require('backbone');
var BrowserNotification = require('./BrowserNotification');
var KaroNotification = require('./KaroNotification');
module.exports = Backbone.Model.extend(/** @lends KaroNotifier.prototype*/{
    defaults: {},
    /**
     * @constructor KaroNotifier
     * @class KaroNotifier
     * KaroNotifier manages all notifications to be shown on the screen
     * Provides custom methods as shortcuts for common notifications
     *
     */
    initialize: function(options) {
        _.bindAll(this, "add", "addGameMoveNotification", "addUserDranNotification");
        var me = this;
        this.notifications = new Backbone.Collection();

        this.eventEmitter = options.eventEmitter;
        this.user = options.user;
        this.settings = options.settings;

        this.eventEmitter.on('CHAT:MESSAGE', function(data) {
            //console.warn(data.chatmsg);
            var b = new BrowserNotification({
                title: data.user + " spricht",
                body: data.text,
                level: "info",
                group: "global",
                tag: "chat",
                icon: "/favicon.ico",
                timeout: 2000,
                notifyClick: function() {
                    alert("Geklickt");
                }
            });

        });

        this.eventEmitter.on('GAME:MOVE', function(data) {
            //skip unrelated
            if (!data.related) {
                if (me.user.get("id") == 1) {
                    //console.warn(data.movedLogin, "zog bei", data.gid, data.name);
                    //me.addGameMoveNotification(data);
                }
                return false;
            }

            if (me.user.get("id") == data.nextId) {
                me.addUserDranNotification(data);
            } else {
                me.addGameMoveNotification(data);
            }
        });
    },
    add: function(n) {
        this.notifications.add(n);

        var t = n.get("timeout");
        if (t !== 0) {
            var me = this;
            setTimeout(function() {
                me.remove(n);
            }, t);
        }
    },
    remove: function(n) {
        this.notifications.remove(n);
    },
    addGameMoveNotification: function(data) {
        if (data.name.length > 30) data.name = data.name.substring(0, 27) + "...";
        var text = 'Bei <a href="/game.html?GID=<%= gid %>"><%- name %></a> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran';
        var t = _.template(text);
        var n = new KaroNotification({
            text: t(data),
            level: "info",
            group: "global",
            imgUrl: "/pre/" + data.gid + ".png"
        });
        this.add(n);
    },
    addUserDranNotification: function(data) {
        var text = 'Du bist dran! Bei <a href="/game.html?GID=<%= gid %>"><%- name %></a> hat <%= movedLogin %> gerade gezogen.';
        var t = _.template(text);
        var n = new KaroNotification({
            text: t(data),
            level: "ok",
            group: "dran",
            imgUrl: "/pre/" + data.gid + ".png"
        });
        this.add(n);
    }
});
