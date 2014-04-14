/**
 * Created with JetBrains PhpStorm.
 * User: pdietrich
 * Date: 10.08.12
 * Time: 09:38
 * To change this template use File | Settings | File Templates.
 */


window.JST = {};

window.JST['editor/tools'] = function () {
    var html = '\
	Mouse Left: <span id="button1"> Button </span> <span id="drag1"> Drag </span><br />\
	Mouse Middle: <span id="button2"> Button </span> <span id="drag2"> Drag </span><br />\
	Mouse Right: <span id="button3"> Button </span> <span id="drag3"> Drag </span>\
    <br />\
	Size: <span id="drawSize">0</span><br />\
    <div id="size-slider" style="margin: 5px"></div>\
    Players: <span id="starties">0</span><br />\
    CPs used: <span id="cpsUsed">-</span><br />\
	';
    var fields = ["O", "X", "Y", "Z", 1, 2, 3, 4, 5, 6, 7, 8, 9, "P", "S", "F"]
    var offset = 42;
    for (var i = 0; i < fields.length; i++) {
        html += '<div class="fieldSelector" rel="' + fields[i] + '" style="background-position: -' + (i * offset) + 'px 0"></div>';
    }
    html += '<div class="clearer"></div><p>Mit allen drei Mausknöpfen kann mal auf der Karte herummalen. Standardeinstellung ist</p>\
	<ul><li>Links Straße</li><li>Mitte Start</li><li>Rechts Grass</li></ul>\
	<p>Lässt sich rechts in der Auswahl ändern</p>\
	<p>Und nein, das ist noch lange nicht fertig</p>'
    return _.template(html);
}
