this["JST"] = this["JST"] || {};

this["JST"]["chat/chatControl"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="chatEnter">\r\n    <form id="chatEnterForm">\r\n        <span id="chatUserName">' +((__t = ( login )) == null ? '' : __t) +': </span>\r\n        <input type="text" name="newchatmessage" id="newchatmessage"/>\r\n        <input type="submit" value="Sag es"/>\r\n    </form>\r\n</div>\r\n';}return __p};

this["JST"]["chat/chatLayout"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div id="chatWrapper">\r\n    <div id="chatMessages"></div>\r\n    <div id="chatInfo"></div>\r\n</div>\r\n<div class="clearer"></div>\r\n<div id="chatControl">Say: <input></div>\r\n';}return __p};

this["JST"]["dumbview"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += 'Hello, I am a <strong>' +((__t = ( adjective )) == null ? '' : __t) +'</strong> view template. Please JST me via grunt an watch my changes, so I can regrunt!\r\n';}return __p};