'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Iterables;
(function (Iterables) {
    function every(source, predicate) {
        for (const item of source) {
            if (!predicate(item))
                return false;
        }
        return true;
    }
    Iterables.every = every;
    function* filter(source, predicate) {
        for (const item of source) {
            if (predicate(item))
                yield item;
        }
    }
    Iterables.filter = filter;
    function* filterMap(source, predicateMapper) {
        for (const item of source) {
            const mapped = predicateMapper(item);
            if (mapped)
                yield mapped;
        }
    }
    Iterables.filterMap = filterMap;
    function forEach(source, fn) {
        let i = 0;
        for (const item of source) {
            fn(item, i);
            i++;
        }
    }
    Iterables.forEach = forEach;
    function find(source, predicate) {
        for (const item of source) {
            if (predicate(item))
                return item;
        }
        return null;
    }
    Iterables.find = find;
    function first(source) {
        return source[Symbol.iterator]().next().value;
    }
    Iterables.first = first;
    function* flatMap(source, mapper) {
        for (const item of source) {
            yield* mapper(item);
        }
    }
    Iterables.flatMap = flatMap;
    function has(source, item) {
        return some(source, _ => _ === item);
    }
    Iterables.has = has;
    function isIterable(source) {
        return typeof source[Symbol.iterator] === 'function';
    }
    Iterables.isIterable = isIterable;
    function join(source, separator) {
        let value = '';
        const iterator = source[Symbol.iterator]();
        let next = iterator.next();
        if (next.done)
            return value;
        while (true) {
            const s = next.value.toString();
            next = iterator.next();
            if (next.done) {
                value += s;
                break;
            }
            value += `${s}${separator}`;
        }
        return value;
    }
    Iterables.join = join;
    function last(source) {
        let item = null;
        for (item of source) { }
        return item;
    }
    Iterables.last = last;
    function* map(source, mapper) {
        for (const item of source) {
            yield mapper(item);
        }
    }
    Iterables.map = map;
    function next(source) {
        return source.next().value;
    }
    Iterables.next = next;
    function* skip(source, count) {
        let i = 0;
        for (const item of source) {
            if (i >= count)
                yield item;
            i++;
        }
    }
    Iterables.skip = skip;
    function some(source, predicate) {
        for (const item of source) {
            if (predicate(item))
                return true;
        }
        return false;
    }
    Iterables.some = some;
    function* take(source, count) {
        if (count > 0) {
            let i = 0;
            for (const item of source) {
                yield item;
                i++;
                if (i >= count)
                    break;
            }
        }
    }
    Iterables.take = take;
    function* union(...sources) {
        for (const source of sources) {
            for (const item of source) {
                yield item;
            }
        }
    }
    Iterables.union = union;
})(Iterables = exports.Iterables || (exports.Iterables = {}));
//# sourceMappingURL=iterable.js.map