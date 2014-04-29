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
window.JST['svg'] = function() {
    return '    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" id="mapSvgView" width="300" height="200">\
            <defs>\
                <style type="text/css">\
                    .grass {\
                        fill: rgb(0, 200, 0);\
                    }\
    \
                    .road {\
                        fill: rgb(128, 128, 128);\
                    }\
    \
                    .start {\
                        fill: url(#startPattern)\
                    }\
    \
                    .finish {\
                        fill: url(#finishPattern)\
                    }\
    \
                    .mud {\
                        fill: rgb(100, 70, 0);\
                    }\
    \
                    .sand {\
                        fill: rgb(230, 230, 115);\
                    }\
    \
                    .water {\
                        fill: blue;\
                    }\
    \
                    .earth {\
                        fill: brown;\
                    }\
    \
                    .night {\
                        fill: black;\
                    }\
    \
                    .parc {\
                        fill: rgb(200, 200, 200);\
                    }\
    \
                    .cp1color {\
                        fill: rgb(0, 102, 255);\
                    }\
    \
                    .cp2color {\
                        fill: rgb(0, 100, 200);\
                    }\
    \
                    .cp3color {\
                        fill: rgb(0, 255, 102);\
                    }\
    \
                    .cp4color {\
                        fill: rgb(0, 200, 0);\
                    }\
    \
                    .cp5color {\
                        fill: rgb(255, 255, 0);\
                    }\
    \
                    .cp6color {\
                        fill: rgb(200, 200, 0);\
                    }\
    \
                    .cp7color {\
                        fill: rgb(255, 0, 0);\
                    }\
    \
                    .cp8color {\
                        fill: rgb(200, 0, 0);\
                    }\
    \
                    .cp9color {\
                        fill: rgb(255, 0, 255);\
                    }\
    \
                    .cp1 {\
                        fill: url(#cp1pattern);\
                    }\
    \
                    .cp2 {\
                        fill: url(#cp2pattern);\
                    }\
    \
                    .cp3 {\
                        fill: url(#cp3pattern);\
                    }\
    \
                    .cp4 {\
                        fill: url(#cp4pattern);\
                    }\
    \
                    .cp5 {\
                        fill: url(#cp5pattern);\
                    }\
    \
                    .cp6 {\
                        fill: url(#cp6pattern);\
                    }\
    \
                    .cp7 {\
                        fill: url(#cp7pattern);\
                    }\
    \
                    .cp8 {\
                        fill: url(#cp8pattern);\
                    }\
    \
                    .cp9 {\
                        fill: url(#cp9pattern);\
                    }\
    \
                    .primaryColor {\
                        fill: rgb(0, 255, 102);\
                    }\
    \
                </style>\
                <pattern id="grid" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <line x1="12" y1="0" x2="12" y2="12" stroke="black" stroke-width="1"></line>\
                    <line x1="0" y1="12" x2="12" y2="12" stroke="black" stroke-width="1"></line>\
                </pattern>\
                <pattern id="finishPattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" fill="black"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="white"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="white"></path>\
                </pattern>\
                <pattern id="startPattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" fill="rgb(100,100,100)"></rect>\
                    <rect x="3.5" y="3.5" width="5" height="5" fill="none" stroke="rgb(200,200,200)" stroke-width="1"></rect>\
                    >\
                </pattern>\
                <pattern id="cp1pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp1color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="black"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="black"></path>\
                </pattern>\
                <pattern id="cp2pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp2color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="white"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="white"></path>\
                </pattern>\
                <pattern id="cp3pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp3color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="black"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="black"></path>\
                </pattern>\
                <pattern id="cp4pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp4color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="white"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="white"></path>\
                </pattern>\
                <pattern id="cp5pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp5color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="black"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="black"></path>\
                </pattern>\
                <pattern id="cp6pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp6color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="white"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="white"></path>\
                </pattern>\
                <pattern id="cp7pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp7color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="black"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="black"></path>\
                </pattern>\
                <pattern id="cp8pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp8color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="white"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="white"></path>\
                </pattern>\
                <pattern id="cp9pattern" patternUnits="userSpaceOnUse" width="12" height="12" x="0" y="0">\
                    <rect x="0" y="0" width="12" height="12" class="cp9color"></rect>\
                    <path d="M0,0L3,0L3,3L0,3L0,0M6,0L9,0L9,3L6,3L6,0M3,3L6,3L6,6L3,6L3,3M9,3L12,3L12,6L9,6L9,3" fill="black"></path>\
                    <path d="M0,6L3,6L3,9L0,9L0,6M6,6L9,6L9,9L6,9L6,6M3,9L6,9L6,12L3,12L3,9M9,9L12,9L12,12L9,12L9,9" fill="black"></path>\
                </pattern>\
            </defs>\
            <rect id="mainfill" class="" x="0" y="0" width="100%" height="100%" />\
            <g id="paths">\
            </g>\
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" opacity=".3"></rect>\
        </svg>';
}
