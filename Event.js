    // https://github.com/huya-fed/Event
    
    var Callbacks = $.Callbacks
    
    var arr = []
    var slice = arr.slice

    var isFunction = function (f) {
        return typeof f === 'function'
    }

    var isString = function (s) {
        return typeof s === 'string'
    }

    function Event () {
        var events = {}

        function on (name, callback, useCache) {
            if ( !isString(name) || !isFunction(callback) ) return this;

            var e = events[name] || ( events[name] = {fired: false, data: null, callbacks: new Callbacks()} )

            e.callbacks.add(callback)

            if (useCache && e.fired) {
                e.callbacks.fireWith(this, e.data)
            }

            return this
        }

        function emit (name, dataA, dataB, dataC) {
            if ( !isString(name) ) return this;

            var e = events[name] || ( events[name] = {fired: false, data: null, callbacks: new Callbacks()} )

            e.fired = true
            e.data = slice.call(arguments, 1)

            if (name !== 'ALL') {
                e.callbacks.fireWith(this, e.data)
            }

            // emit('ALL')
            var eAll = events['ALL'] || ( events['ALL'] = {fired: false, data: null, callbacks: new Callbacks()} )

            eAll.fired = true
            eAll.data = slice.call(arguments, 0) 
            eAll.callbacks.fireWith(this, eAll.data)

            return this
        }

        function off (name, callback) {
            var l = arguments.length 

            if (l === 0) {
                for (var p in events) {
                    if ( events.hasOwnProperty(p) ) {
                        events[p].callbacks.empty()
                    }
                }
            } else {
                if ( isString(name) ) {
                    var e = events[name]

                    if (e) {
                        if (l === 1) {
                            e.callbacks.empty()
                        } else {
                            if ( isFunction(callback) ) {
                                e.callbacks.remove(callback)
                            }
                        }
                    }
                }
            }

            return this
        }

        function one (name, callback, useCache) {
            if ( !isString(name) || !isFunction(callback) ) return this;

            var proxy = function () {
                callback.apply(this, arguments)
                off(name, proxy)
            }

            on(name, proxy, useCache)
        }

        return {
            on: on,
            one: one,
            off: off,
            emit: emit
        }
    }

    return Event