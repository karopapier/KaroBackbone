
var game = new Game();
game.load(GameId);


var mmv = new MoveMessageView({
    el: '#moveMessages',
    collection: game.moveMessages
});


mmv.render();