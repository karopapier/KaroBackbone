/**
 * Created by pdietrich on 20.05.14.
 */


var KaropapierApp = Marionette.Application.extend({
    //global layout with regions for nav, sidebar, header and user info...
    initialize: function (options) {
        console.log('APP INIT!!!!!!!!!!!');
        this.User = new User({});
        //make this user refer to "check" for loging in
        this.User.url = function () {
            return "http://www.karopapier.de/api/user/check.json?callback=?";
        }
        this.User.fetch();

        //init Karo Event Interface KEvIn
        this.KEvIn = new KEvIn({
            user: this.User
        });

        this.notifier = new KaroNotifier();
        this.notifierView = new NotifierView({model: this.notifier});

        var me = this;
        this.addInitializer(function() {
            me.notifierView.render();
        })
    }
});

