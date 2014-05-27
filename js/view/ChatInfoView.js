var ChatInfoView = Backbone.Marionette.ItemView.extend({
    tagName: "div",
    template: window["JST"]["chat/chatInfo"],
    initialize: function () {
        _.bindAll(this, "updateTopBlocker", "updateHabdich", "updateDranInfo", "render");
        this.$el.html(this.template);

        this.chatUserCollection = new ChatUserCollection();
        this.chatUsersView = new ChatUsersView({
            collection: this.chatUserCollection,
            el: this.$('#chatUsers')
        });
        this.chatUserCollection.on("add remove reset change", this.updateHabdich);

        this.blockerInterval = setInterval(this.updateDranInfo, 60000);

        this.updateDranInfo();
        this.updateTopBlocker();
    },
    onClose: function() {
        clearInterval(this.blockerInterval);
    },
    updateDranInfo: function () {
        if (this.model.get("id")==0) return;
        var html;
        $.getJSON('http://reloaded.karopapier.de/api/user/blockerlist.json?callback=?', function (bl) {
            blockerlist = bl;
            $.getJSON('http://reloaded.karopapier.de/api/user/' + this.model.get("id") + '/info.json?callback=?', function (data) {
                var dran = data.dran;
                if (dran == 0) {
                    html = 'Du bist ein <a href="http://www.karopapier.de/karowiki/index.php/Nixblocker">Nixblocker</a>';
                } else if (dran == 1) {
                    html = '<a target="ibndran" href="http://www.karopapier.de/showgames.php?dranbin=' + this.model.get("id") + '">Bei einem Spiel dran</a>';
                } else {
                    html = '<a href="/dran" target="ibndran">Bei <strong>' + dran + '</strong> Spielen dran</a>';
                }
                $('#chatInfoDran').html(html)

                var pos = 0;
                if (blockerlist.length > 0) {
                    var l = blockerlist.length;
                    for (var i = 0; i < l; i++) {
                        if (blockerlist[i].id == 1) {
                            pos = i + 1;
                            i = l + 100;
                        }
                    }
                }

                html = "";
                if (pos > 0) {
                    if (pos == 1) {
                        html += "DU BIST DER <b>VOLLBLOCKER</b>";
                    } else if (pos == 2) {
                        html += "DU BIST DER <b>VIZE-VOLLBLOCKER</b>";
                    } else {
                        html += 'Platz ' + pos + ' der <a href="/blocker">Blockerliste</a>';
                    }
                }

                //Check blocker list rank
                $('#chatInfoBlockerRank').html(html);
            });
        });
    },
    updateHabdich: function () {
        console.log(this.chatUserCollection.pluck("dran"));
        var habdich = _.reduce(this.chatUserCollection.pluck("dran"), function (sum, el) {
            return sum + el;
        }, 0);
        this.$('#chatHabdich').text(habdich);
    },
    updateTopBlocker: function () {
        if (this.model.get("id")==0) return;
        var html;
        $.getJSON('http://reloaded.karopapier.de/api/user/' + this.model.get("id") + '/blocker.json?callback=?', function (data) {
            if (data.length > 0) {
                var blocker = data[0];
                html = 'Dein Top-Blocker: ' + blocker.login + ' (' + blocker.blocked + ')';
            } else {
                html = '';
            }
            $('#chatInfoTopBlocker').html(html);
        });
    },
    render: function () {
        console.log("Chat info render");
        return this;
    }
})