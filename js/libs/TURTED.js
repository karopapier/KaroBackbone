var TURTED = function (sockjs_url) {
    var me = this;
    this.callbacks = {};
    this.nativeConnection = {};
    this.callbackQueue = [];
    this.reconnectQueue = [];
    this.isConnected = false;
    this.debugMode = false;

    this.connect = function (isReconnect) {
        var sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function () {
            //fire queued events here
            me.isConnected = true;
            me.processQueue();
            if (isReconnect) {
                me.processReconnectQueue()
            }
        }
        sockjs.onmessage = function (e) {
            //console.log("Sock gives me ", e);
            data = JSON.parse(e.data);
            //console.log("After parsing I have ", data);
            var type = data.type;
            var data = data.data;

            //console.log(type, data);
            if (typeof me.callbacks[type] === "object") {
                var l = me.callbacks[type].length;
                if (this.debugMode) console.log("Triggering callbacks on ", type);
                for (var i = 0; i < l; i++) {
                    me.callbacks[type][i].call(me, data);
                }
            }
        };

        sockjs.onerror = function (e) {
            console.log("Error", e)
        }
        sockjs.onclose = function () {
            this.isConnected = false;
            setTimeout(this.reconnect.bind(this), 1000);
        }.bind(this);
        ;

        this.nativeConnection = sockjs;
    }

    this.reconnect = function() {
        this.connect(true);
    }.bind(this);

    this.connect();
}

TURTED.prototype.on = function (on, f) {
    if (typeof this.callbacks[on] === "undefined") {
        this.callbacks[on] = [];
    }
    this.callbacks[on].push(f);
};

TURTED.prototype.ident = function (id, username, token) {
    //enqueue the "ident" action until connected
    var f = function () {
        this.nativeConnection.send(this.encode("ident", {
            id: id,
            username: username,
            token: token
        }));
    }.bind(this);
    this.enqueue(f);
    this.enqueueReconnect(f);

    //in case the call was made on an open connection, immediately process the queue again
    if (this.isConnected) {
        this.processQueue();
    }
}

TURTED.prototype.join = function (channel) {
    //enqueue the "join" action until connected
    this.enqueue(function () {
        this.nativeConnection.send(this.encode("join", {
            channel: channel
        }));
    }.bind(this));

    //in case the call was made on an open connection, immediately process the queue again
    if (this.isConnected) {
        this.processQueue();
    }
}

TURTED.prototype.send = function (message) {
    this.nativeConnection.send(this.encode("message", message));
    console.log(this.encode("message", message));
}

TURTED.prototype.echo = function (message) {
    this.nativeConnection.send(this.encode("echo", message));
}

TURTED.prototype.encode = function (type, data) {
    return JSON.stringify({
        type: type,
        data: data
    });
}

TURTED.prototype.enqueue = function (f) {
    //store the callback
    this.callbackQueue.push(f);
}

TURTED.prototype.enqueueReconnect = function (f) {
    //store the callback
    this.reconnectQueue.push(f);
}

TURTED.prototype.processQueue = function () {
    var emergency = 100;
    while ((this.callbackQueue.length > 0) && (emergency > 0)) {
        var f = this.callbackQueue.shift();
        if (typeof f === "function") {
            f();
        }
        emergency--;
    }
}

TURTED.prototype.processReconnectQueue = function () {
    var emergency = 100;
    for (var i=0;i<this.reconnectQueue.length;i++) {
        var f = this.reconnectQueue[i];
        if (typeof f === "function") {
            f();
        }
        emergency--;
    }
}


