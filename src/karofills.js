//Polyfills
if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (typeof String.prototype.truncate != 'function') {
    String.prototype.truncate = function(str, c) {
        return str.substring(0, c) + "...";
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function(n) {
        n = n || 1;
        return Array(n + 1).join(this);
    };
}
