this["JST"] = this["JST"] || {};

this["JST"]["basic/basic.html"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="header">Header</div>\r\n<div id="content">Content</div>\r\n<div id="footer">Footer</div>';}return __p};

this["JST"]["dumbview.html"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += 'Hello, I am a <strong>' +((__t = ( adjective )) == null ? '' : __t) +'</strong> view template. Please JST me via grunt an watch my changes, so I can regrunt!\r\n';}return __p};