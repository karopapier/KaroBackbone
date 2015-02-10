module("Game");
test("Deep data setting", function () {
    expect(3);

    var game = new Game({
        id: 1000,
        name: "A game"
    });
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");
    game.map.set(map);
    game.map.set({"cpsActive": [1,2,3,4]}, {silent: true});
    //game.get("players").reset(data.players, {parse: true});
    game.set("completed", true);

    othergame = new Game({
        id: 1234,
        name: "another game"
    });


    equal(game.get("name"),"A game", "verify initial data");
    equal(game.get("id"),1000, "verify initial data");


});
