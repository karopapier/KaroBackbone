var PlayerTable = Backbone.View.extend({
	className: "playerCollection",
	template: _.template([
		"<table class='playerList thin'>",
		'<tr><th>Spieler</th><th>Farbe</th><th>Züge</th><th>letzter Zug</th><th>Runde</th></tr>',
		"<% items.each(function(player) { %>",
		"<%= playerTemplate(player.attributes) %>",
		"<% }); %>",
		"</table>"
	].join('')),

	playerTemplate: function(player) {
		var html="";
		html+= '<tr>';
		html+='<td>'+player.name+'</td>';
		html+='<td style="background-color: #'+player.color+'; border-radius: 4px; box-shadow: 1px 2px rgba(0,0,0,.4)">&nbsp; &nbsp;</td>';
		html+='<td><img src="images/car.png" />'+player.moveCount;
		html+= player.crashCount > 0 ? ' <img src="images/crash.png" /> ' + player.crashCount : "";
		html+='</td>';
		var lm=moment(player.lastmove.get("t"),"YYYY-MM-DD HH:mm:ss").toDate();
		html+='<td><span title="' + moment(lm).format("DD.MM.YY H:mm") + '">';
		if (moment(lm).diff(new Date(),"days")<-1) {
			html+="vor "+Math.abs(moment(lm).diff(new Date(),"days"))+" Tagen";
		} else {
			//only for short timeframes <24h
			html+=moment(lm).fromNow();
		}
		html+='</span></td>';
		html+='<td>';
		if (player.status =="kicked") {
			html+="rausgeworfen";
		}
		if (player.status == "left") {
			html+="ausgestiegen";
		}
		if (player.status == "invited") {
			html+="eingeladen";
		}
		if (player.status=="ok") {
			if (player.dran) {
				html+="dran";
			} else {
				if (player.position != 0) {
					html+="wurde "+player.position+".";
				} else {
					html+=player.moved ? "war schon" : "kommt noch";
				}
			}

		}
		html+="</td>";
		html+='</tr>';
		return html;
	},

	render: function() {
		console.log("Ich rednere", this.collection);
		var html = this.template({
			items: this.collection /* a collection */,
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
