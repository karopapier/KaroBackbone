var $ = require('jquery');
var KaropapierApp = require('./app/KaropapierApp');

//GLOBAL LEAKAGE IS INTENDED!!!! Sorry...
window.Karopapier = new KaropapierApp({
    realtimeHost: "turted.karopapier.de"
});

//TODO: need to get rid of that
Karopapier.vent.on("logout", function() {
    console.log("Logging out");
    Karopapier.User.set("id", 0);
    console.log(Karopapier.User);
});

Karopapier.vent.on("login", function() {
    console.log("Logging in");
    //TODO Get rid of this AND jQuery require
    $.post("//www.karopapier.de/api/user/login.json", {
        "login": login,
        "password": pass
    }, function(data) {
        console.log(data);
        Karopapier.User.set(data);
    });
});

$(document).ready(function() {
    //console.log("Doc ready, start Karopapier app");
    Karopapier.start();
    console.log("App started");
});
