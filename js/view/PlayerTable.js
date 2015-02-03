var PlayerTable = Backbone.View.extend({
	className: "playerCollection",
	template: _.template([
		"<table class='playerList thin'>",
		'<tr><th>Spieler</th><th>Farbe</th><th>Züge</th><th>Runde</th><th>Checkpoints</th><th>letzter Zug</th><th>Bedenkzeit</th></tr>',
		"<% items.each(function(player) { %>",
		"<%= playerTemplate(player.attributes) %>",
		"<% }); %>",
		"</table>"
	].join('')),

	playerTemplate: function(player) {
		console.info(player);
		var html="";
		html+= '<tr>';
		html+='<td>'+player.name+'</td>';
		html+='<td style="background-color: #'+player.color+'; border-radius: 4px; box-shadow: 1px 2px rgba(0,0,0,.4)">&nbsp; &nbsp;</td>';
		html+='<td><img src="images/car.png" />'+player.moves.length;
		html+= player.crashCount > 0 ? ' <img src="images/crash.png" /> ' + player.crashCount : "";
		html+='</td>';
		html+='<td>';
		if (player.status =="kicked") {
			html+="<span class='kicked'>rausgeworfen</span>";
		}
		if (player.status == "left") {
			html+="ausgestiegen";
		}
		if (player.status == "invited") {
			html+="eingeladen";
		}
		if (player.status=="ok") {
			if (player.dran) {
				html+='<span class="dran">dran</span>';
			} else {
				if (player.position != 0) {
					html+="wurde "+player.position+".";
				} else {
					html+=player.moved ? '<span class="moved">war schon</span>' : '<span class="tomove">kommt noch</span>';
				}
			}

		}
		html+="</td>";
		html+="<td>fehlt: " + player.missingCps + "</td>";
		var lastmovetime = player.lastmove.get("t");
		if (!lastmovetime) {
			lastmovetime="-";
		}
		html+='<td>' + lastmovetime +  '</td>';
		html+='<td> kommt später </td>';
		html+='</tr>';
		return html;
	},

	render: function() {
		var html = this.template({
			items: this.collection,
			playerTemplate: this.playerTemplate
		});

		$(this.el).html(html);
	},
	initialize: function() {
		_.bindAll(this,"render");
		this.listenTo(this.collection, "change", this.render);
		this.listenTo(this.collection, "reset", this.render);
	}
});
