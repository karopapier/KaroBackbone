/**
 * Created with JetBrains PhpStorm.
 * User: pdietrich
 * Date: 10.08.12
 * Time: 09:38
 * To change this template use File | Settings | File Templates.
 */


window.JST={};

window.JST['editor/tools'] = _.template('\
     Mouse Left: <span id="button1"> Button </span> <span id="drag1"> Drag </span><br />\
     Mouse Middle: <span id="button2"> Button </span> <span id="drag2"> Drag </span><br />\
     Mouse Right: <span id="button3"> Button </span> <span id="drag3"> Drag </span>\
     <div id="size-slider" style="margin: 5px"></div>\
');
