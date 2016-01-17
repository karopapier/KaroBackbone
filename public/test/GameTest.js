module("Game");
test("Deep data setting", function () {
    expect(17);

    var game = new Game({
        id: 1000,
        name: "A game"
    });

    var boundToMap = game.map;
    var boundToPlayers = game.get("players");

    var expect_mapcode = "XXXXXXX\nXOSOFX1\nXXXXXXX";
    var expect_cps = [1, 2, 3, 4];

    game.map.setMapcode(expect_mapcode);
    game.map.set({"cpsActive": expect_cps}, {silent: true});

    //game.get("players").reset(data.players, {parse: true});
    game.set("completed", false);

    equal(game.get("name"), "A game", "verify initial data");
    equal(game.get("id"), 1000, "verify initial data");
    equal(game.get("completed"), false, "verify initial data");
    equal(game.map.get("mapcode"), expect_mapcode, "verify initial data");


    var expected_moves = [{x: 12, y: 13, xv: 0, yv: 4}, {x: 10, y: 11, xv: -1, yv: 5}];
    var p = new Player({
        name: "Player 1"
    })
    p.moves.reset(expected_moves);
    game.get("players").add(p);

    //check players
    equal(game.get("players").at(0).get("name"), "Player 1", "Initial Player ok")
    equal(game.get("players").at(0).moves.at(1).getMotion().toString(), "[10|11] (-1|5)", "Initial moves ok")


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
    othergame.get("players").add(other_p);

    //take ALL date from othergame to original game
    game.setFrom(othergame);

    //basic properties
    equal(game.get("name"), "another game", "name ok");
    equal(game.get("id"), 1234, "id set");
    equal(game.get("completed"), true, "status set");

    //check map
    equal(game.map.get("mapcode"), other_mapcode, "New mapcode ok")
    equal(game.map.get("cpsActive"), other_cps, "CPs ok")

    //check players
    equal(game.get("players").at(0).get("name"), "Other 1", "New Player ok")
    //check moves
    equal(game.get("players").at(0).moves.length, 3, "Move count matches")
    equal(game.get("players").at(0).moves.at(1).getMotion().toString(), "[7|3] (-5|3)", "New moves ok")

    //check movemessages
    //check possibles

    //check if everything is still bound correctly
    equal(boundToMap.get("mapcode"), other_mapcode, "Bound Mapcode ok")
    equal(boundToMap.get("cpsActive"), other_cps, "CPs ok")
    equal(boundToPlayers.at(0).moves.at(2).getMotion().toString(), "[1|1] (1|1)", "Binding to player collection intact");
});
