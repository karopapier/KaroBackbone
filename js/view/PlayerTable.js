var PlayerTable = Backbone.View.extend({
    className: "playerCollection",
    template: _.template([
        "<table class='playerList thin'>",
        '<tr><th>Spieler</th><th>Farbe</th><th>Züge</th><th>Runde</th><th>Checkpoints</th><th>letzter Zug</th><th>Bedenkzeit</th></tr>',
        "<% items.each(function(player) { %>",
        "<%= playerTemplate(player) %>",
        "<% }); %>",
        "</table>"
    ].join('')),

    playerTemplate: function (player) {
        var html = "";
        html += '<tr>';
        html += '<td>' + player.get("name") + '</td>';
        html += '<td style="background-color: #' + player.get("color") + '; border-radius: 4px; box-shadow: 1px 2px rgba(0,0,0,.4)">&nbsp; &nbsp;</td>';
        html += '<td><img src="images/car.png" />' + player.moves.length;
        html += player.get("crashCount") > 0 ? ' <img src="images/crash.png" /> ' + player.get("crashCount") : "";
        html += '</td>';
        html += '<td>';
        if (player.get("status") == "kicked") {
            html += "<span class='kicked'>rausgeworfen</span>";
        }
        if (player.get("status") == "left") {
            html += "ausgestiegen";
        }
        if (player.get("status") == "invited") {
            html += "eingeladen";
        }
        if (player.get("status") == "ok") {
            if (player.get("dran")) {
                html += '<span class="dran">dran</span>';
            } else {
                if (player.get("position") != 0) {
                    html += "wurde " + player.get("position") + ".";
                } else {
                    html += player.get("moved") ? '<span class="moved">war schon</span>' : '<span class="tomove">kommt noch</span>';
                }
            }

        }
        html += "</td>";
        html += "<td>fehlt: " + player.get("missingCps") + "</td>";
        var lastmovetime = player.getLastMove() ? player.getLastMove().get("t") : "-";
        if (!lastmovetime) {
            lastmovetime = "-";
        }
        html += '<td>' + lastmovetime + '</td>';
        html += '<td> kommt später </td>';
        html += '</tr>';
        return html;
    },

    render: function () {
        var html = this.template({
            items: this.collection,
            playerTemplate: this.playerTemplate
        });

        $(this.el).html(html);
    },
    initialize: function () {
        _.bindAll(this, "render");
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "reset", this.render);
    }
});
