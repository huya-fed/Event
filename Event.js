var Event = (function(){
    var arr = []
    var slice = arr.slice
    var indexOf = arr.indexOf || function( elem ) {
        for ( var i = 0, l = this.length; i < l; i++ ) {
            if ( this[i] === elem ) {
                return i
            }
        }

        return -1
    }

    var isFunction = function (f) {
        return typeof f === 'function'
    }
    
    var isString = function (s) {
        return typeof s === 'string'
    }

    function Callbacks () {
        var list = []
        var firingIndex = -1

        function fire () {
            firingIndex = -1

            // 回调里有可能存在对 add/remove/empty 的(多次)调用，这会导致 list 的length发生改变
            // 所以这里不能取 list.length 的快照去进行比较，必须每次都要重新获取
            while (++firingIndex < list.length) {
                list[firingIndex].apply(this, arguments)
            }

            return this
        }

        function fireWith (context, args) {
            return fire.apply(context, args)
        }

        function add (callback) {
            if ( isFunction(callback) ) {
                list.push(callback)
            }

            return this
        }

        function remove (callback) {
            if ( !isFunction(callback) ) return this;

            var i = 0;

            // 同一个callback有可能被添加了多次 list里存在多个对它的引用 都要清掉
            while ( (i = indexOf.call(list, callback, i)) > -1 ) {
                list.splice(i, 1)

                // Handle firing indexes
                if ( i <= firingIndex ) {
                    firingIndex--
                }
            }

            return this
        }

        function empty () {
            list = [];
            return this
        }

        return {
            add: add,
            remove: remove,
            empty: empty,
            fire: fire,
            fireWith: fireWith
        }
    }

    function Event () {
        var events = {}

        function on (name, callback, useCache) {
            if ( !isString(name) || !isFunction(callback) ) return this;

            if ( !events[name] ) {
                events[name] = {
                    fired: false,
                    data: null,
                    callbacks: new Callbacks()
                }
            }

            var e = events[name]

            e.callbacks.add(callback)

            if (useCache && e.fired) {
                e.callbacks.fireWith(this, e.data)
            }

            return this
        }

        function emit (name, dataA, dataB, dataC) {
            if ( !isString(name) ) return this;

            if ( !events[name] ) {
                events[name] = {
                    fired: false,
                    data: null,
                    callbacks: new Callbacks()
                }
            }

            var e = events[name]

            e.fired = true
            e.data = slice.call(arguments, 1)

            e.callbacks.fireWith(this, e.data)

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

    Event.Callbacks = Callbacks;

    return Event
})();