function Event () {
    if ( !(this instanceof Event) ) return new Event;

    var er = this
    var events = {}

    this.on = function (name, callback, useCache) {
        if (typeof name !== 'string' || typeof callback !== 'function') return er;

        if ( !events[name] ) {
            events[name] = {
                fired: false,
                data: null,
                callbacks: []
            }
        }

        var e = events[name]

        e.callbacks.push(callback)

        if (useCache && e.fired) {
            callback.apply(e, e.data)
        }

        return er
    }

    this.off = function (name, callback) {
        var n = arguments.length 

        if (n === 0) {
            for (var p in events) {
                if ( events.hasOwnProperty(p) ) {
                    events[p].callbacks = []
                }
            }
        } else {
            if (typeof name === 'string') {
                var e = events[name]

                if (e) {
                    if (n === 1) {
                        e.callbacks = []
                    } else {
                        if (typeof callback === 'function') {
                            for (var i = 0, l = e.callbacks.length; i < l; i++) {
                                if (callback === e.callbacks[i]) {
                                    e.callbacks.splice(i, 1)
                                }
                            }
                        }
                    }
                }
            }
        }

        return er
    }

    this.emit = function (name, dataA, dataB, dataC) {
        if (typeof name !== 'string') return er;

        if ( !events[name] ) {
            events[name] = {
                fired: false,
                data: null,
                callbacks: []
            }
        }

        var e = events[name]

        e.fired = true
        e.data = Array.prototype.slice.call(arguments, 1)

        for (var i = 0, l = e.callbacks.length; i < l; i++) {
            e.callbacks[i].apply(e, e.data)
        }

        return er
    }
}