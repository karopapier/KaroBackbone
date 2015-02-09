Karopapier.User = new User({});
//make this user refer to "check" for loging in
Karopapier.User.url = function () {
    return "http://www.karopapier.de/api/user/check.json?callback=?";
};
Karopapier.User.fetch();

var game = new Game();
//game.load(GameId);

var mmv = new MoveMessageView({
    el: '#moveMessages',
    collection: game.get("moveMessages")
});

var giv = new GameInfoView({
    model: game,
    el: "#gameInfo"
});

var gtv = new GameTitleView({
    el: "#gameTitle",
    model: game
});

var svgView = new MapSvgView({
    el: "#mapSvgView",
    model: game.map,
    size: 11,
    border: 1
});

var GameRouter = Backbone.Router.extend({
    routes: {
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute"
    },
    showGame: function (gameId) {
        if (gameId) {
            game.load(gameId);
        }
    },
    defaultRoute: function () {
        this.navigate("game.html?GID=81111", {trigger: true});
    }
});

var pt = new PlayerTable({
    collection: game.get("players"),
    el: "#playerTable"
});

var mpm = new MapPlayerMoves({
    model: game,
    collection: game.get("players"),
    el: '#mapPlayerMoves'
});

/*
 var mpl = new MapPlayerLayer({
 el: '#fgImg',
 model: game
 });
 mpl.render();
 */

var possView = new PossiblesView({
    el: "#mapImage",
    game: game,
    mapView: svgView
});

//testmode reset: game.get("players").get(Karopapier.User).get("moves").reset(game.get("players").get(Karopapier.User).get("moves").where({"test": undefined}));
Karopapier.listenTo(possView, "game:player:move", function (playerId, mo) {
    var testmode = $('#testmode').is(":checked");
    if (testmode) {
        var player = game.get("players").get(playerId);
        var move = new Move(mo.toMove());
        move.set("t", new Date());
		move.set("test", true);
        //console.log("Add move");
        player.moves.add(move);
        //console.log("Added move");
        //console.log(player.moves.length);
        //console.warn(player);
        mpm.render();
        possView.render();
    } else {
        //build move url
        var moveUrl = "http://www.karopapier.de/move.php?GID=" + game.get("id");
        var m = mo.toMove();
        if (mo.get("vector").getLength()==0) {
            //http://www.karopapier.de/move.php?GID=84078&startx=8&starty=29
            alert ("Start");
            moveUrl+="&startx=" + m.x + "&starty=" + m.y;
        } else {
            //http://www.karopapier.de/move.php?GID=83790&xpos=76&ypos=28&xvec=-2&yvec=2
            moveUrl+= "&xpos=" + m.x + "&ypos=" + m.y + "&xvec=" + m.xv + "&yvec=" + m.yv;
        }

        myTextGet(moveUrl, function (text) {
            parseMoveResponse(text);
        });

        //send
        //check response
        //load next
    }
});

function parseMoveResponse(text) {
    //indexOf Danke ==ok
    if (text.indexOf("Danke.") >= 0) {
        //console.log("GUT");
        //<B>Didi</B> kommt als n&auml;chstes dran
        var hits = text.match(/<B>(.*?)<\/B> kommt als n/);
        var nextPlayer = "Unknown";
        if (hits.length > 1) {
            nextPlayer = hits[1];
        }
        //console.log("Next",nextPlayer);
        //Didi == me => nochmal
        //console.log("ME",Karopapier.User.get("login"));
        if (nextPlayer == Karopapier.User.get("login")) {
            //console.info("NOMMAL DRAN");
            game.load(game.get("id"));
            return true;
        }

        //<A HREF=showmap.php?GID=82749> -> folge id
        var gids = text.match(/showmap.php\?GID=(\d*?)>Du bist/);
        //console.log(gids);
		if (gids) {
			if (gids.length > 1) {
				//console.log(gids[1]);
				var pathname = window.location.pathname.substr(1);
				gr.navigate(pathname + "?GID=" + gids[1], {trigger: true});
			}
		} else {
			window.location.href = "http://www.karopapier.de/dran";
		}
    } else {
        alert("KEIN DANKE!!!");
        console.log(text);
    }
}

function myTextGet(url, cb, errcb) {
    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            //console.log(request.responseText);
            cb(request.responseText);
            //console.log("Success: ",request.responseText.indexOf("Danke.") >=0);
        } else {
            // We reached our target server, but it returned an error
            cb(request.responseText);
            //console.log("doof",request);
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.send();
};

var dranQueue = new GameCollection();
dranQueue.url =  function()   {
    return "http://www.karopapier.de/api/user/1/dran.json?callback=?"
};
dranQueue.parse = function(data) { return data.games };
dranQueue.fetch();

var dran= function() {
    game.load(dranQueue.first().get("id"));
}

gr = new GameRouter();

Backbone.history.start({
    pushState: true
});

var checkTestmode = function() {
	console.log("Checking");
	if ($('#testmode').is(":checked")) {
		$('#mapImage').addClass("testmode");
	} else {
		$('#mapImage').removeClass("testmode");
	}
}

$('#testmode').click(checkTestmode);
checkTestmode();

console.info("Stepup done");

