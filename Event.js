    /**
     * Class Event
     * https://github.com/huya-fed/Event
     */
    
    var arr = []
    var slice = arr.slice

    var isFunction = function (f) {
        return typeof f === 'function'
    }

    var isString = function (s) {
        return typeof s === 'string'
    }

    function E () {
        return {
            fired: false, 
            data: [], 
            callbacks: new $.Callbacks()
        }
    }

    function Event () {
        var events = {}

        function on (name, callback, useCache) {
            if ( !isString(name) || !isFunction(callback) ) return this;

            var e = events[name] || ( events[name] = new E() )

            e.callbacks.add(callback)

            if (useCache && e.fired) {
                callback.apply(this, e.data)
            }

            return this
        }

        function emit (name) {
            if ( !isString(name) ) return this;

            var e = events[name] || ( events[name] = new E() )

            e.fired = true
            e.data = slice.call(arguments, 1)
            e.callbacks.fireWith(this, e.data)

            if (name !== 'ALL') {
                emit.apply( this, ['ALL'].concat( slice.call(arguments) ) )
            }

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