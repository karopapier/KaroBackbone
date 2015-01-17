
var game = new Game();
game.load(GameId);


var mmv = new MoveMessageView({
    el: '#moveMessages',
    collection: game.moveMessages
});

var giv = new GameInfoView({
    model: game,
    el: "#gameInfo"
});
giv.render();


mmv.render();