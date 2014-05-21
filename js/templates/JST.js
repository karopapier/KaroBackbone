this["JST"] = this["JST"] || {};

this["JST"]["basic/basic"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="header">Header</div>\r\n<div id="content">Content</div>\r\n<div id="footer">Footer</div>';}return __p};

this["JST"]["chat/layout"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="chatmessages"></div>\r\n<div id="chatinfo"></div>\r\n';}return __p};

this["JST"]["dumbview"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += 'Hello, I am a <strong>' +((__t = ( adjective )) == null ? '' : __t) +'</strong> view template. Please JST me via grunt an watch my changes, so I can regrunt!\r\n';}return __p};