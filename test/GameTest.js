var _ = require('underscore');
var Game = require('../src/model/Game');
var Player = require('../src/model/Player');
var detaildata = JSON.parse(require('fs').readFileSync(__dirname + '/assets/44773.details.json', 'utf8'))

/*
exports.Deepdatasetting = function(test) {
    test.expect(17);

    var game = new Game({
        id: 1000,
        name: "A game"
    });
    var boundToMap = game.map;
    var boundToPlayers = game.players;

    var expect_mapcode = "XXXXXXX\nXOSOFX1\nXXXXXXX";
    var expect_cps = [1, 2, 3, 4];

    game.map.setMapcode(expect_mapcode);
    game.map.set({"cpsActive": expect_cps}, {silent: true});

    //game.players.reset(data.players, {parse: true});
    game.set("completed", false);

    test.equal(game.get("name"), "A game", "verify initial data");
    test.equal(game.get("id"), 1000, "verify initial data");
    test.equal(game.get("completed"), false, "verify initial data");
    test.equal(game.map.get("mapcode"), expect_mapcode, "verify initial data");


    var expected_moves = [{x: 12, y: 13, xv: 0, yv: 4}, {x: 10, y: 11, xv: -1, yv: 5}];
    var p = new Player({
        name: "Player 1"
    })
    p.moves.reset(expected_moves);
    game.players.add(p);

    //check players
    test.equal(game.players.at(0).get("name"), "Player 1", "Initial Player ok")
    test.equal(game.players.at(0).moves.at(1).getMotion().toString(), "[10|11] (-1|5)", "Initial moves ok")


    //now set up other game
    othergame = new Game({
        id: 1234,
        name: "another game",
        completed: true
    });
    var other_mapcode = "X123456789OOO";
    var other_cps = [];
    othergame.map.setMapcode(other_mapcode);
    othergame.map.set("cpsActive", other_cps);
    var other_moves = [{x: 2, y: 3, xv: 5, yv: 4}, {x: 7, y: 3, xv: -5, yv: 3}, {x: 1, y: 1, xv: 1, yv: 1}];
    var other_p = new Player({
        name: "Other 1"
    });
    other_p.moves.reset(other_moves);
    othergame.players.add(other_p);

    //take ALL date from othergame to original game
    game.setFrom(othergame);

    //basic properties
    test.equal(game.get("name"), "another game", "name ok");
    test.equal(game.get("id"), 1234, "id set");
    test.equal(game.get("completed"), true, "status set");

    //check map
    test.equal(game.map.get("mapcode"), other_mapcode, "New mapcode ok")
    test.equal(game.map.get("cpsActive"), other_cps, "CPs ok")

    //check players
    test.equal(game.players.at(0).get("name"), "Other 1", "New Player ok")
    //check moves
    test.equal(game.players.at(0).moves.length, 3, "Move count matches")
    test.equal(game.players.at(0).moves.at(1).getMotion().toString(), "[7|3] (-5|3)", "New moves ok")

    //check movemessages
    //check possibles

    //check if everything is still bound correctly
    test.equal(boundToMap.get("mapcode"), other_mapcode, "Bound Mapcode ok")
    test.equal(boundToMap.get("cpsActive"), other_cps, "CPs ok")
    test.equal(boundToPlayers.at(0).moves.at(2).getMotion().toString(), "[1|1] (1|1)", "Binding to player collection intact");
    test.done();
};
*/

exports.parsetest = function(test) {
    test.expect(3);
    test.equals(detaildata.game.id, 44773);

    var game = new Game();
    var parsed = game.parse.call(game,detaildata);

    test.equals(game.players.length, 6, "all players have been captured");
    test.equals(game.moveMessages.length, 20, "all move messages have been captured");
    test.done();
};
