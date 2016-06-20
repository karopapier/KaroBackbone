var TURTED = function(url) {
    var me = this;
    this.callbacks = {};
    this.nativeConnection = {};
    this.callbackQueue = [];
    this.reconnectQueue = [];
    this.isConnected = false;
    this.retryTimeout = 1;

    this.connect = function(isReconnect) {
        console.log("native triggered connect");
        console.log("I connect");
        var native = io(url, { transports: ['websocket']});
        native.on("connect", function() {
            console.log("I am connected now and will fire queued events here");
            me.isConnected = true;
            me.processQueue();
        });

        native.on("ECHO", function(data) {
            me.processCallbacks("ECHO", data);
        });

        native.on("EVENT", function(e) {
            var type = e.event;
            var data = e.payload;

            console.log(type, data);
            me.processCallbacks(type, data);
        });

        native.onerror = function(e) {
            console.log("Error", e)
        };
        
        native.onclose = function() {
            this.isConnected = false;
            console.log("Retry in", this.retryTimeout);
            setTimeout(this.connect.bind(this), (this.retryTimeout++) * 1000);
        }.bind(this);

        native.on("reconnect", function(data) {
            console.log("native triggered reconnect");
            me.processReconnectQueue();
        });
        this.nativeConnection = native;
    };

    this.connect();
};

TURTED.prototype.on = function(on, f) {
    if (typeof this.callbacks[on] === "undefined") {
        this.callbacks[on] = [];
    }
    this.callbacks[on].push(f);
};

TURTED.prototype.ident = function(data) {
    console.log("enqueue the *ident* action until connected");
    var f = function() {
        this.nativeConnection.emit("IDENT", data);
    }.bind(this);
    this.enqueue(f);
    this.enqueueReconnect(f);

    //in case the call was made on an open connection, immediately process the queue again
    if (this.isConnected) {
        this.processQueue();
    }
}

TURTED.prototype.join = function(channel) {
    //enqueue the "join" action until connected
    this.enqueue(function() {
        this.nativeConnection.emit("JOIN", {
            channel: channel
        });
    }.bind(this));

    //in case the call was made on an open connection, immediately process the queue again
    if (this.isConnected) {
        this.processQueue();
    }
};

TURTED.prototype.echo = function(message) {
    this.nativeConnection.emit("ECHO", message);
};

TURTED.prototype.enqueue = function(f) {
    //store the callback
    this.callbackQueue.push(f);
};

TURTED.prototype.enqueueReconnect = function(f) {
    //store the callback
    this.reconnectQueue.push(f);
};

TURTED.prototype.processQueue = function() {
    var emergency = 100;
    while ((this.callbackQueue.length > 0) && (emergency > 0)) {
        var f = this.callbackQueue.shift();
        if (typeof f === "function") {
            f();
        }
        emergency--;
    }
};

TURTED.prototype.processReconnectQueue = function() {
    var emergency = 100;
    for (var i = 0; i < this.reconnectQueue.length; i++) {
        var f = this.reconnectQueue[i];
        if (typeof f === "function") {
            f();
        }
        emergency--;
    }
};

TURTED.prototype.processCallbacks = function(type, data) {
    if (typeof this.callbacks[type] === "object") {
        var l = this.callbacks[type].length;
        console.log("Triggering callbacks on ", type);
        for (var i = 0; i < l; i++) {
            this.callbacks[type][i](data);
        }
    }
};

TURTED.prototype.send = function() {
    alert("Sending from the client is not supported");
};
