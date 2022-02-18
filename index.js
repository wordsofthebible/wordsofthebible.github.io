// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
        left: function(a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;
            while(lo < hi){
                var mid = lo + hi >>> 1;
                if (compare(a[mid], x) < 0) lo = mid + 1;
                else hi = mid;
            }
            return lo;
        },
        right: function(a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;
            while(lo < hi){
                var mid = lo + hi >>> 1;
                if (compare(a[mid], x) > 0) hi = mid;
                else lo = mid + 1;
            }
            return lo;
        }
    };
}
function ascendingComparator(f) {
    return function(d, x) {
        return ascending(f(d), x);
    };
}
var ascendingBisect = bisector(ascending);
ascendingBisect.right;
ascendingBisect.left;
var array = Array.prototype;
array.slice;
array.map;
function merge(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array2;
    while(++i < n)j += arrays[i].length;
    merged = new Array(j);
    while(--n >= 0){
        array2 = arrays[n];
        m = array2.length;
        while(--m >= 0){
            merged[--j] = array2[m];
        }
    }
    return merged;
}
Array.prototype.slice;
var noop = {
    value: function() {}
};
function dispatch() {
    for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new Dispatch(_);
}
function Dispatch(_) {
    this._ = _;
}
function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name
        };
    });
}
Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
        }
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {}, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new Dispatch(copy);
    },
    call: function(type1, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type1)) throw new Error("unknown type: " + type1);
        for(t = this._[type1], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type2, that, args) {
        if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
        for(var t = this._[type2], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function get(type3, name) {
    for(var i = 0, n = type3.length, c; i < n; ++i){
        if ((c = type3[i]).name === name) {
            return c.value;
        }
    }
}
function set(type4, name, callback) {
    for(var i = 0, n = type4.length; i < n; ++i){
        if (type4[i].name === name) {
            type4[i] = noop, type4 = type4.slice(0, i).concat(type4.slice(i + 1));
            break;
        }
    }
    if (callback != null) type4.push({
        name,
        value: callback
    });
    return type4;
}
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name) {
    var prefix1 = name += "", i = prefix1.indexOf(":");
    if (i >= 0 && (prefix1 = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix1) ? {
        space: namespaces[prefix1],
        local: name
    } : name;
}
function creatorInherit(name) {
    return function() {
        var document2 = this.ownerDocument, uri = this.namespaceURI;
        return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
}
function creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}
function creator(name) {
    var fullname = namespace(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {}
function selector(selector2) {
    return selector2 == null ? none : function() {
        return this.querySelector(selector2);
    };
}
function selection_select(select2) {
    if (typeof select2 !== "function") select2 = selector(select2);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
            }
        }
    }
    return new Selection(subgroups, this._parents);
}
function empty() {
    return [];
}
function selectorAll(selector2) {
    return selector2 == null ? empty : function() {
        return this.querySelectorAll(selector2);
    };
}
function selection_selectAll(select2) {
    if (typeof select2 !== "function") select2 = selectorAll(select2);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                subgroups.push(select2.call(node, node.__data__, i, group));
                parents.push(node);
            }
        }
    }
    return new Selection(subgroups, parents);
}
function matcher(selector2) {
    return function() {
        return this.matches(selector2);
    };
}
function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new Selection(subgroups, this._parents);
}
function sparse(update) {
    return new Array(update.length);
}
function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}
EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector2) {
        return this._parent.querySelector(selector2);
    },
    querySelectorAll: function(selector2) {
        return this._parent.querySelectorAll(selector2);
    }
};
function constant(x) {
    return function() {
        return x;
    };
}
var keyPrefix = "$";
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    for(; i < dataLength; ++i){
        if (node = group[i]) {
            node.__data__ = data[i];
            update[i] = node;
        } else {
            enter[i] = new EnterNode(parent, data[i]);
        }
    }
    for(; i < groupLength; ++i){
        if (node = group[i]) {
            exit[i] = node;
        }
    }
}
function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = {}, groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for(i = 0; i < groupLength; ++i){
        if (node = group[i]) {
            keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
            if (keyValue in nodeByKeyValue) {
                exit[i] = node;
            } else {
                nodeByKeyValue[keyValue] = node;
            }
        }
    }
    for(i = 0; i < dataLength; ++i){
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue[keyValue] = null;
        } else {
            enter[i] = new EnterNode(parent, data[i]);
        }
    }
    for(i = 0; i < groupLength; ++i){
        if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
            exit[i] = node;
        }
    }
}
function selection_data(value1, key) {
    if (!value1) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) {
            data[++j] = d;
        });
        return data;
    }
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value1 !== "function") value1 = constant(value1);
    for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
        var parent = parents[j], group = groups[j], groupLength = group.length, data = value1.call(parent, parent && parent.__data__, j, parents), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
        for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0){
            if (previous = enterGroup[i0]) {
                if (i0 >= i1) i1 = i0 + 1;
                while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                previous._next = next || null;
            }
        }
    }
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(selection2) {
    for(var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge1 = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge1[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new Selection(merges, this._parents);
}
function selection_order() {
    for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
        for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;){
            if (node = group[i]) {
                if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
    }
    return this;
}
function selection_sort(compare) {
    if (!compare) compare = ascending1;
    function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group[i]) {
                sortgroup[i] = node;
            }
        }
        sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
}
function ascending1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
}
function selection_nodes() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() {
        nodes[++i] = this;
    });
    return nodes;
}
function selection_node() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
            var node = group[i];
            if (node) return node;
        }
    }
    return null;
}
function selection_size() {
    var size1 = 0;
    this.each(function() {
        ++size1;
    });
    return size1;
}
function selection_empty() {
    return !this.node();
}
function selection_each(callback) {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
    }
    return this;
}
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, value2) {
    return function() {
        this.setAttribute(name, value2);
    };
}
function attrConstantNS(fullname, value3) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value3);
    };
}
function attrFunction(name, value4) {
    return function() {
        var v = value4.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function attrFunctionNS(fullname, value5) {
    return function() {
        var v = value5.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}
function selection_attr(name, value6) {
    var fullname = namespace(name);
    if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value6 == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value6 === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value6));
}
function defaultView(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, value7, priority) {
    return function() {
        this.style.setProperty(name, value7, priority);
    };
}
function styleFunction(name, value8, priority) {
    return function() {
        var v = value8.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function selection_style(name, value9, priority) {
    return arguments.length > 1 ? this.each((value9 == null ? styleRemove : typeof value9 === "function" ? styleFunction : styleConstant)(name, value9, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
    return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}
function propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function propertyConstant(name, value10) {
    return function() {
        this[name] = value10;
    };
}
function propertyFunction(name, value11) {
    return function() {
        var v = value11.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}
function selection_property(name, value12) {
    return arguments.length > 1 ? this.each((value12 == null ? propertyRemove : typeof value12 === "function" ? propertyFunction : propertyConstant)(name, value12)) : this.node()[name];
}
function classArray(string1) {
    return string1.trim().split(/^|\s+/);
}
function classList(node) {
    return node.classList || new ClassList(node);
}
function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function classedTrue(names) {
    return function() {
        classedAdd(this, names);
    };
}
function classedFalse(names) {
    return function() {
        classedRemove(this, names);
    };
}
function classedFunction(names, value13) {
    return function() {
        (value13.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
}
function selection_classed(name, value14) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while(++i < n)if (!list.contains(names[i])) return false;
        return true;
    }
    return this.each((typeof value14 === "function" ? classedFunction : value14 ? classedTrue : classedFalse)(names, value14));
}
function textRemove() {
    this.textContent = "";
}
function textConstant(value15) {
    return function() {
        this.textContent = value15;
    };
}
function textFunction(value16) {
    return function() {
        var v = value16.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}
function selection_text(value17) {
    return arguments.length ? this.each(value17 == null ? textRemove : (typeof value17 === "function" ? textFunction : textConstant)(value17)) : this.node().textContent;
}
function htmlRemove() {
    this.innerHTML = "";
}
function htmlConstant(value18) {
    return function() {
        this.innerHTML = value18;
    };
}
function htmlFunction(value19) {
    return function() {
        var v = value19.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}
function selection_html(value20) {
    return arguments.length ? this.each(value20 == null ? htmlRemove : (typeof value20 === "function" ? htmlFunction : htmlConstant)(value20)) : this.node().innerHTML;
}
function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}
function selection_raise() {
    return this.each(raise);
}
function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
    return this.each(lower);
}
function selection_append(name) {
    var create2 = typeof name === "function" ? name : creator(name);
    return this.select(function() {
        return this.appendChild(create2.apply(this, arguments));
    });
}
function constantNull() {
    return null;
}
function selection_insert(name, before) {
    var create2 = typeof name === "function" ? name : creator(name), select2 = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
        return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
    });
}
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}
function selection_remove() {
    return this.each(remove);
}
function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value21) {
    return arguments.length ? this.property("__data__", value21) : this.node().__data__;
}
var filterEvents = {};
var event = null;
if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!("onmouseenter" in element)) {
        filterEvents = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
    }
}
function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function(event2) {
        var related = event2.relatedTarget;
        if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
            listener.call(this, event2);
        }
    };
}
function contextListener(listener, index, group) {
    return function(event1) {
        var event0 = event;
        event = event1;
        try {
            listener.call(this, this.__data__, index, group);
        } finally{
            event = event0;
        }
    };
}
function parseTypenames1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name
        };
    });
}
function onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j){
            if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.capture);
            } else {
                on[++i] = o;
            }
        }
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function onAdd(typename, value22, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value22, i, group);
        if (on) for(var j = 0, m = on.length; j < m; ++j){
            if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.capture);
                this.addEventListener(o.type, o.listener = listener, o.capture = capture);
                o.value = value22;
                return;
            }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {
            type: typename.type,
            name: typename.name,
            value: value22,
            listener,
            capture
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function selection_on(typename, value23, capture) {
    var typenames = parseTypenames1(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for(var j = 0, m = on.length, o; j < m; ++j){
            for(i = 0, o = on[j]; i < n; ++i){
                if ((t = typenames[i]).type === o.type && t.name === o.name) {
                    return o.value;
                }
            }
        }
        return;
    }
    on = value23 ? onAdd : onRemove;
    if (capture == null) capture = false;
    for(i = 0; i < n; ++i)this.each(on(typenames[i], value23, capture));
    return this;
}
function dispatchEvent(node, type5, params) {
    var window = defaultView(node), event2 = window.CustomEvent;
    if (typeof event2 === "function") {
        event2 = new event2(type5, params);
    } else {
        event2 = window.document.createEvent("Event");
        if (params) event2.initEvent(type5, params.bubbles, params.cancelable), event2.detail = params.detail;
        else event2.initEvent(type5, false, false);
    }
    node.dispatchEvent(event2);
}
function dispatchConstant(type6, params) {
    return function() {
        return dispatchEvent(this, type6, params);
    };
}
function dispatchFunction(type7, params) {
    return function() {
        return dispatchEvent(this, type7, params.apply(this, arguments));
    };
}
function selection_dispatch(type8, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type8, params));
}
var root = [
    null
];
function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function selection() {
    return new Selection([
        [
            document.documentElement
        ]
    ], root);
}
Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
};
var nextId = 0;
function local() {
    return new Local();
}
function Local() {
    this._ = "@" + (++nextId).toString(36);
}
Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
        var id1 = this._;
        while(!(id1 in node))if (!(node = node.parentNode)) return;
        return node[id1];
    },
    set: function(node, value24) {
        return node[this._] = value24;
    },
    remove: function(node) {
        return this._ in node && delete node[this._];
    },
    toString: function() {
        return this._;
    }
};
function DragEvent(target, type9, subject, id2, active, x, y, dx, dy, dispatch2) {
    this.target = target;
    this.type = type9;
    this.subject = subject;
    this.identifier = id2;
    this.active = active;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this._ = dispatch2;
}
DragEvent.prototype.on = function() {
    var value25 = this._.on.apply(this._, arguments);
    return value25 === this._ ? this : value25;
};
function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
}
function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for(var key in definition)prototype[key] = definition[key];
    return prototype;
}
function Color() {}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp("^rgb\\(" + [
    reI,
    reI,
    reI
] + "\\)$"), reRgbPercent = new RegExp("^rgb\\(" + [
    reP,
    reP,
    reP
] + "\\)$"), reRgbaInteger = new RegExp("^rgba\\(" + [
    reI,
    reI,
    reI,
    reN
] + "\\)$"), reRgbaPercent = new RegExp("^rgba\\(" + [
    reP,
    reP,
    reP,
    reN
] + "\\)$"), reHslPercent = new RegExp("^hsl\\(" + [
    reN,
    reP,
    reP
] + "\\)$"), reHslaPercent = new RegExp("^hsla\\(" + [
    reN,
    reP,
    reP,
    reN
] + "\\)$");
var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
};
define(Color, color, {
    copy: function(channels) {
        return Object.assign(new this.constructor(), this, channels);
    },
    displayable: function() {
        return this.rgb().displayable();
    },
    hex: color_formatHex,
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
});
function color_formatHex() {
    return this.rgb().formatHex();
}
function color_formatHsl() {
    return hslConvert(this).formatHsl();
}
function color_formatRgb() {
    return this.rgb().formatRgb();
}
function color(format1) {
    var m, l;
    format1 = (format1 + "").trim().toLowerCase();
    return (m = reHex.exec(format1)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format1)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format1)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format1)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format1)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format1)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format1)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format1) ? rgbn(named[format1]) : format1 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
        return this;
    },
    displayable: function() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: rgb_formatHex,
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
}));
function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}
function hex(value26) {
    value26 = Math.max(0, Math.min(255, Math.round(value26) || 0));
    return (value26 < 16 ? "0" : "") + value26.toString(16);
}
function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
}
function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
    if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
    } else {
        s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
        return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl: function() {
        var a = this.opacity;
        a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
    }
}));
function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;
var K = 18, Xn = 0.96422, Yn = 1, Zn = 0.82521, t0 = 4 / 29, t1 = 6 / 29, t2 = 3 * t1 * t1, t3 = t1 * t1 * t1;
function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y;
    else {
        x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
        z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}
function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}
function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
}
define(Lab, lab, extend(Color, {
    brighter: function(k) {
        return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
        return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
        var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
        x = Xn * lab2xyz(x);
        y = Yn * lab2xyz(y);
        z = Zn * lab2xyz(z);
        return new Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.033454 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
    }
}));
function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}
function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
}
function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}
function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}
function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
}
function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}
define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
        return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
        return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
        return hcl2lab(this).rgb();
    }
}));
var A = -0.14861, B = 1.78277, C = -0.29227, D = -0.90649, E = 1.97294, ED = E * D, EB = E * B, BC_DA = B * C - D * A;
function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB), bl = b - l, k = (E * (g - l) - C * bl) / D, s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}
function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}
function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh = Math.cos(h), sinh = Math.sin(h);
        return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
    }
}));
function basis(t12, v0, v1, v2, v3) {
    var t21 = t12 * t12, t31 = t21 * t12;
    return ((1 - 3 * t12 + 3 * t21 - t31) * v0 + (4 - 6 * t21 + 3 * t31) * v1 + (1 + 3 * t12 + 3 * t21 - 3 * t31) * v2 + t31 * v3) / 6;
}
function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
        var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
function basisClosed(values) {
    var n = values.length;
    return function(t) {
        var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
function constant1(x) {
    return function() {
        return x;
    };
}
function linear(a, d) {
    return function(t) {
        return a + t * d;
    };
}
function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
    };
}
function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant1(isNaN(a) ? b : a);
}
function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant1(isNaN(a) ? b : a);
    };
}
function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant1(isNaN(a) ? b : a);
}
var rgb1 = function rgbGamma(y) {
    var color2 = gamma(y);
    function rgb2(start1, end) {
        var r = color2((start1 = rgb(start1)).r, (end = rgb(end)).r), g = color2(start1.g, end.g), b = color2(start1.b, end.b), opacity = nogamma(start1.opacity, end.opacity);
        return function(t) {
            start1.r = r(t);
            start1.g = g(t);
            start1.b = b(t);
            start1.opacity = opacity(t);
            return start1 + "";
        };
    }
    rgb2.gamma = rgbGamma;
    return rgb2;
}(1);
function rgbSpline(spline) {
    return function(colors1) {
        var n = colors1.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
        for(i = 0; i < n; ++i){
            color2 = rgb(colors1[i]);
            r[i] = color2.r || 0;
            g[i] = color2.g || 0;
            b[i] = color2.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color2.opacity = 1;
        return function(t) {
            color2.r = r(t);
            color2.g = g(t);
            color2.b = b(t);
            return color2 + "";
        };
    };
}
var rgbBasis = rgbSpline(basis$1);
rgbSpline(basisClosed);
function numberArray(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
        for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
    };
}
function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for(i = 0; i < na; ++i)x[i] = value(a[i], b[i]);
    for(; i < nb; ++i)c[i] = b[i];
    return function(t) {
        for(i = 0; i < na; ++i)c[i] = x[i](t);
        return c;
    };
}
function date(a, b) {
    var d = new Date();
    return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
    };
}
function number(a, b) {
    return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
    };
}
function object(a, b) {
    var i = {}, c = {}, k;
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
    for(k in b){
        if (k in a) {
            i[k] = value(a[k], b[k]);
        } else {
            c[k] = b[k];
        }
    }
    return function(t) {
        for(k in i)c[k] = i[k](t);
        return c;
    };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
    return function() {
        return b;
    };
}
function one(b) {
    return function(t) {
        return b(t) + "";
    };
}
function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while((am = reA.exec(a)) && (bm = reB.exec(b))){
        if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs);
            if (s[i]) s[i] += bs;
            else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
            if (s[i]) s[i] += bm;
            else s[++i] = bm;
        } else {
            s[++i] = null;
            q.push({
                i,
                x: number(am, bm)
            });
        }
        bi = reB.lastIndex;
    }
    if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs;
        else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
        for(var i2 = 0, o; i2 < b; ++i2)s[(o = q[i2]).i] = o.x(t);
        return s.join("");
    });
}
function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant1(b) : (t === "number" ? number : t === "string" ? (c = color(b)) ? (b = c, rgb1) : string : b instanceof color ? rgb1 : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number)(a, b);
}
var degrees = 180 / Math.PI;
var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
};
function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX,
        scaleY
    };
}
var cssNode, cssRoot, cssView, svgNode;
function parseCss(value2) {
    if (value2 === "none") return identity;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value2;
    value2 = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value2 = value2.slice(7, -1).split(",");
    return decompose(+value2[0], +value2[1], +value2[2], +value2[3], +value2[4], +value2[5]);
}
function parseSvg(value2) {
    if (value2 == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value2);
    if (!(value2 = svgNode.transform.baseVal.consolidate())) return identity;
    value2 = value2.matrix;
    return decompose(value2.a, value2.b, value2.c, value2.d, value2.e, value2.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
        return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push("translate(", null, pxComma, null, pxParen);
            q.push({
                i: i - 4,
                x: number(xa, xb)
            }, {
                i: i - 2,
                x: number(ya, yb)
            });
        } else if (xb || yb) {
            s.push("translate(" + xb + pxComma + yb + pxParen);
        }
    }
    function rotate(a, b, s, q) {
        if (a !== b) {
            if (a - b > 180) b += 360;
            else if (b - a > 180) a += 360;
            q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: number(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "rotate(" + b + degParen);
        }
    }
    function skewX(a, b, s, q) {
        if (a !== b) {
            q.push({
                i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                x: number(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "skewX(" + b + degParen);
        }
    }
    function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push(pop(s) + "scale(", null, ",", null, ")");
            q.push({
                i: i - 4,
                x: number(xa, xb)
            }, {
                i: i - 2,
                x: number(ya, yb)
            });
        } else if (xb !== 1 || yb !== 1) {
            s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
    }
    return function(a, b) {
        var s = [], q = [];
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null;
        return function(t) {
            var i = -1, n = q.length, o;
            while(++i < n)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        };
    };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
function hsl1(hue2) {
    return function(start2, end) {
        var h = hue2((start2 = hsl(start2)).h, (end = hsl(end)).h), s = nogamma(start2.s, end.s), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
        return function(t) {
            start2.h = h(t);
            start2.s = s(t);
            start2.l = l(t);
            start2.opacity = opacity(t);
            return start2 + "";
        };
    };
}
hsl1(hue);
hsl1(nogamma);
function hcl1(hue2) {
    return function(start3, end) {
        var h = hue2((start3 = hcl(start3)).h, (end = hcl(end)).h), c = nogamma(start3.c, end.c), l = nogamma(start3.l, end.l), opacity = nogamma(start3.opacity, end.opacity);
        return function(t) {
            start3.h = h(t);
            start3.c = c(t);
            start3.l = l(t);
            start3.opacity = opacity(t);
            return start3 + "";
        };
    };
}
hcl1(hue);
hcl1(nogamma);
function cubehelix1(hue2) {
    return (function cubehelixGamma(y) {
        y = +y;
        function cubehelix2(start4, end) {
            var h = hue2((start4 = cubehelix(start4)).h, (end = cubehelix(end)).h), s = nogamma(start4.s, end.s), l = nogamma(start4.l, end.l), opacity = nogamma(start4.opacity, end.opacity);
            return function(t) {
                start4.h = h(t);
                start4.s = s(t);
                start4.l = l(Math.pow(t, y));
                start4.opacity = opacity(t);
                return start4 + "";
            };
        }
        cubehelix2.gamma = cubehelixGamma;
        return cubehelix2;
    })(1);
}
cubehelix1(hue);
var cubehelixLong = cubehelix1(nogamma);
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1000, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
};
function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
    clockNow = 0;
}
function Timer() {
    this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
            if (taskTail) taskTail._next = this;
            else taskHead = this;
            taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
    },
    stop: function() {
        if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
        }
    }
};
function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
}
function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while(t){
        if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
        t = t._next;
    }
    --frame;
}
function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
        timerFlush();
    } finally{
        frame = 0;
        nap();
        clockNow = 0;
    }
}
function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
    var t02, t13 = taskHead, t22, time = Infinity;
    while(t13){
        if (t13._call) {
            if (time > t13._time) time = t13._time;
            t02 = t13, t13 = t13._next;
        } else {
            t22 = t13._next, t13._next = null;
            t13 = t02 ? t02._next = t22 : taskHead = t22;
        }
    }
    taskTail = t02;
    sleep(time);
}
function sleep(time) {
    if (frame) return;
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
    } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
    }
}
function timeout$1(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart(function(elapsed) {
        t.stop();
        callback(elapsed + delay);
    }, delay, time);
    return t;
}
function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var exponent = 3;
(function custom(e) {
    e = +e;
    function polyIn2(t) {
        return Math.pow(t, e);
    }
    polyIn2.exponent = custom;
    return polyIn2;
})(exponent);
(function custom2(e) {
    e = +e;
    function polyOut2(t) {
        return 1 - Math.pow(1 - t, e);
    }
    polyOut2.exponent = custom2;
    return polyOut2;
})(exponent);
(function custom3(e) {
    e = +e;
    function polyInOut2(t) {
        return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    }
    polyInOut2.exponent = custom3;
    return polyInOut2;
})(exponent);
function tpmt(x) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
}
var overshoot = 1.70158;
(function custom4(s) {
    s = +s;
    function backIn2(t) {
        return (t = +t) * t * (s * (t - 1) + t);
    }
    backIn2.overshoot = custom4;
    return backIn2;
})(overshoot);
(function custom5(s) {
    s = +s;
    function backOut2(t) {
        return --t * t * ((t + 1) * s + t) + 1;
    }
    backOut2.overshoot = custom5;
    return backOut2;
})(overshoot);
(function custom6(s) {
    s = +s;
    function backInOut2(t) {
        return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    }
    backInOut2.overshoot = custom6;
    return backInOut2;
})(overshoot);
var tau = 2 * Math.PI, amplitude = 1, period = 0.3;
(function custom7(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticIn2(t) {
        return a * tpmt(- --t) * Math.sin((s - t) / p);
    }
    elasticIn2.amplitude = function(a2) {
        return custom7(a2, p * tau);
    };
    elasticIn2.period = function(p2) {
        return custom7(a, p2);
    };
    return elasticIn2;
})(amplitude, period);
(function custom8(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticOut2(t) {
        return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
    }
    elasticOut2.amplitude = function(a2) {
        return custom8(a2, p * tau);
    };
    elasticOut2.period = function(p2) {
        return custom8(a, p2);
    };
    return elasticOut2;
})(amplitude, period);
(function custom9(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
    function elasticInOut2(t) {
        return ((t = t * 2 - 1) < 0 ? a * tpmt(-t) * Math.sin((s - t) / p) : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
    }
    elasticInOut2.amplitude = function(a2) {
        return custom9(a2, p * tau);
    };
    elasticInOut2.period = function(p2) {
        return custom9(a, p2);
    };
    return elasticInOut2;
})(amplitude, period);
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name, id2, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id2 in schedules) return;
    create(node, id2, {
        name,
        index,
        group,
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
    });
}
function init(node, id2) {
    var schedule2 = get1(node, id2);
    if (schedule2.state > CREATED) throw new Error("too late; already scheduled");
    return schedule2;
}
function set1(node, id2) {
    var schedule2 = get1(node, id2);
    if (schedule2.state > STARTED) throw new Error("too late; already running");
    return schedule2;
}
function get1(node, id2) {
    var schedule2 = node.__transition;
    if (!schedule2 || !(schedule2 = schedule2[id2])) throw new Error("transition not found");
    return schedule2;
}
function create(node, id2, self) {
    var schedules = node.__transition, tween;
    schedules[id2] = self;
    self.timer = timer(schedule2, 0, self.time);
    function schedule2(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start2, self.delay, self.time);
        if (self.delay <= elapsed) start2(elapsed - self.delay);
    }
    function start2(elapsed) {
        var i, j, n, o;
        if (self.state !== SCHEDULED) return stop();
        for(i in schedules){
            o = schedules[i];
            if (o.name !== self.name) continue;
            if (o.state === STARTED) return timeout$1(start2);
            if (o.state === RUNNING) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("interrupt", node, node.__data__, o.index, o.group);
                delete schedules[i];
            } else if (+i < id2) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("cancel", node, node.__data__, o.index, o.group);
                delete schedules[i];
            }
        }
        timeout$1(function() {
            if (self.state === STARTED) {
                self.state = RUNNING;
                self.timer.restart(tick, self.delay, self.time);
                tick(elapsed);
            }
        });
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return;
        self.state = STARTED;
        tween = new Array(n = self.tween.length);
        for(i = 0, j = -1; i < n; ++i){
            if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
                tween[++j] = o;
            }
        }
        tween.length = j + 1;
    }
    function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
        while(++i < n){
            tween[i].call(node, t);
        }
        if (self.state === ENDING) {
            self.on.call("end", node, node.__data__, self.index, self.group);
            stop();
        }
    }
    function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id2];
        for(var i in schedules)return;
        delete node.__transition;
    }
}
function interrupt(node, name) {
    var schedules = node.__transition, schedule2, active2, empty1 = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for(i in schedules){
        if ((schedule2 = schedules[i]).name !== name) {
            empty1 = false;
            continue;
        }
        active2 = schedule2.state > STARTING && schedule2.state < ENDING;
        schedule2.state = ENDED;
        schedule2.timer.stop();
        schedule2.on.call(active2 ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
        delete schedules[i];
    }
    if (empty1) delete node.__transition;
}
function selection_interrupt(name) {
    return this.each(function() {
        interrupt(this, name);
    });
}
function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
        var schedule2 = set1(this, id2), tween = schedule2.tween;
        if (tween !== tween0) {
            tween1 = tween0 = tween;
            for(var i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1 = tween1.slice();
                    tween1.splice(i, 1);
                    break;
                }
            }
        }
        schedule2.tween = tween1;
    };
}
function tweenFunction(id2, name, value27) {
    var tween0, tween1;
    if (typeof value27 !== "function") throw new Error();
    return function() {
        var schedule2 = set1(this, id2), tween = schedule2.tween;
        if (tween !== tween0) {
            tween1 = (tween0 = tween).slice();
            for(var t = {
                name,
                value: value27
            }, i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1[i] = t;
                    break;
                }
            }
            if (i === n) tween1.push(t);
        }
        schedule2.tween = tween1;
    };
}
function transition_tween(name, value28) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
        var tween = get1(this.node(), id2).tween;
        for(var i = 0, n = tween.length, t; i < n; ++i){
            if ((t = tween[i]).name === name) {
                return t.value;
            }
        }
        return null;
    }
    return this.each((value28 == null ? tweenRemove : tweenFunction)(id2, name, value28));
}
function tweenValue(transition2, name, value29) {
    var id2 = transition2._id;
    transition2.each(function() {
        var schedule2 = set1(this, id2);
        (schedule2.value || (schedule2.value = {}))[name] = value29.apply(this, arguments);
    });
    return function(node) {
        return get1(node, id2).value[name];
    };
}
function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? number : b instanceof color ? rgb1 : (c = color(b)) ? (b = c, rgb1) : string)(a, b);
}
function attrRemove1(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS1(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant1(name, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function attrConstantNS1(fullname, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function attrFunction1(name, interpolate2, value30) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value30(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function attrFunctionNS1(fullname, interpolate2, value31) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value31(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function transition_attr(name, value32) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value32 === "function" ? (fullname.local ? attrFunctionNS1 : attrFunction1)(fullname, i, tweenValue(this, "attr." + name, value32)) : value32 == null ? (fullname.local ? attrRemoveNS1 : attrRemove1)(fullname) : (fullname.local ? attrConstantNS1 : attrConstant1)(fullname, i, value32));
}
function attrInterpolate(name, i) {
    return function(t) {
        this.setAttribute(name, i.call(this, t));
    };
}
function attrInterpolateNS(fullname, i) {
    return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
}
function attrTweenNS(fullname, value33) {
    var t03, i0;
    function tween() {
        var i = value33.apply(this, arguments);
        if (i !== i0) t03 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t03;
    }
    tween._value = value33;
    return tween;
}
function attrTween(name, value34) {
    var t04, i0;
    function tween() {
        var i = value34.apply(this, arguments);
        if (i !== i0) t04 = (i0 = i) && attrInterpolate(name, i);
        return t04;
    }
    tween._value = value34;
    return tween;
}
function transition_attrTween(name, value35) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value35 == null) return this.tween(key, null);
    if (typeof value35 !== "function") throw new Error();
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value35));
}
function delayFunction(id2, value36) {
    return function() {
        init(this, id2).delay = +value36.apply(this, arguments);
    };
}
function delayConstant(id2, value37) {
    return value37 = +value37, function() {
        init(this, id2).delay = value37;
    };
}
function transition_delay(value38) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value38 === "function" ? delayFunction : delayConstant)(id2, value38)) : get1(this.node(), id2).delay;
}
function durationFunction(id2, value39) {
    return function() {
        set1(this, id2).duration = +value39.apply(this, arguments);
    };
}
function durationConstant(id2, value40) {
    return value40 = +value40, function() {
        set1(this, id2).duration = value40;
    };
}
function transition_duration(value41) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value41 === "function" ? durationFunction : durationConstant)(id2, value41)) : get1(this.node(), id2).duration;
}
function easeConstant(id2, value42) {
    if (typeof value42 !== "function") throw new Error();
    return function() {
        set1(this, id2).ease = value42;
    };
}
function transition_ease(value43) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value43)) : get1(this.node(), id2).ease;
}
function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition2) {
    if (transition2._id !== this._id) throw new Error();
    for(var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge2[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new Transition(merges, this._parents, this._name, this._id);
}
function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
    });
}
function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set1;
    return function() {
        var schedule2 = sit(this, id2), on = schedule2.on;
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
        schedule2.on = on1;
    };
}
function transition_on(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get1(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}
function removeFunction(id2) {
    return function() {
        var parent = this.parentNode;
        for(var i in this.__transition)if (+i !== id2) return;
        if (parent) parent.removeChild(this);
    };
}
function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selector(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
                schedule(subgroup[i], name, id2, i, subgroup, get1(node, id2));
            }
        }
    }
    return new Transition(subgroups, this._parents, name, id2);
}
function transition_selectAll(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selectorAll(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                for(var children = select.call(node, node.__data__, i, group), child, inherit2 = get1(node, id2), k = 0, l = children.length; k < l; ++k){
                    if (child = children[k]) {
                        schedule(child, name, id2, k, children, inherit2);
                    }
                }
                subgroups.push(children);
                parents.push(node);
            }
        }
    }
    return new Transition(subgroups, parents, name, id2);
}
var Selection1 = selection.prototype.constructor;
function transition_selection() {
    return new Selection1(this._groups, this._parents);
}
function styleNull(name, interpolate2) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
    };
}
function styleRemove1(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant1(name, interpolate2, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = styleValue(this, name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
    };
}
function styleFunction1(name, interpolate2, value44) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = styleValue(this, name), value1 = value44(this), string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
    };
}
function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event1 = "end." + key, remove1;
    return function() {
        var schedule2 = set1(this, id2), on = schedule2.on, listener = schedule2.value[key] == null ? remove1 || (remove1 = styleRemove1(name)) : void 0;
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event1, listener0 = listener);
        schedule2.on = on1;
    };
}
function transition_style(name, value45, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value45 == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove1(name)) : typeof value45 === "function" ? this.styleTween(name, styleFunction1(name, i, tweenValue(this, "style." + name, value45))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant1(name, i, value45), priority).on("end.style." + name, null);
}
function styleInterpolate(name, i, priority) {
    return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
    };
}
function styleTween(name, value46, priority) {
    var t, i0;
    function tween() {
        var i = value46.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
    }
    tween._value = value46;
    return tween;
}
function transition_styleTween(name, value47, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value47 == null) return this.tween(key, null);
    if (typeof value47 !== "function") throw new Error();
    return this.tween(key, styleTween(name, value47, priority == null ? "" : priority));
}
function textConstant1(value48) {
    return function() {
        this.textContent = value48;
    };
}
function textFunction1(value49) {
    return function() {
        var value1 = value49(this);
        this.textContent = value1 == null ? "" : value1;
    };
}
function transition_text(value50) {
    return this.tween("text", typeof value50 === "function" ? textFunction1(tweenValue(this, "text", value50)) : textConstant1(value50 == null ? "" : value50 + ""));
}
function textInterpolate(i) {
    return function(t) {
        this.textContent = i.call(this, t);
    };
}
function textTween(value51) {
    var t05, i0;
    function tween() {
        var i = value51.apply(this, arguments);
        if (i !== i0) t05 = (i0 = i) && textInterpolate(i);
        return t05;
    }
    tween._value = value51;
    return tween;
}
function transition_textTween(value52) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value52 == null) return this.tween(key, null);
    if (typeof value52 !== "function") throw new Error();
    return this.tween(key, textTween(value52));
}
function transition_transition() {
    var name = this._name, id0 = this._id, id1 = newId();
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                var inherit2 = get1(node, id0);
                schedule(node, name, id1, i, group, {
                    time: inherit2.time + inherit2.delay + inherit2.duration,
                    delay: 0,
                    duration: inherit2.duration,
                    ease: inherit2.ease
                });
            }
        }
    }
    return new Transition(groups, this._parents, name, id1);
}
function transition_end() {
    var on0, on1, that = this, id2 = that._id, size2 = that.size();
    return new Promise(function(resolve, reject) {
        var cancel = {
            value: reject
        }, end = {
            value: function() {
                if (--size2 === 0) resolve();
            }
        };
        that.each(function() {
            var schedule2 = set1(this, id2), on = schedule2.on;
            if (on !== on0) {
                on1 = (on0 = on).copy();
                on1._.cancel.push(cancel);
                on1._.interrupt.push(cancel);
                on1._.end.push(end);
            }
            schedule2.on = on1;
        });
    });
}
var id = 0;
function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
}
function transition(name) {
    return selection().transition(name);
}
function newId() {
    return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    end: transition_end
};
var defaultTiming = {
    time: null,
    delay: 0,
    duration: 250,
    ease: cubicInOut
};
function inherit(node, id2) {
    var timing;
    while(!(timing = node.__transition) || !(timing = timing[id2])){
        if (!(node = node.parentNode)) {
            return defaultTiming.time = now(), defaultTiming;
        }
    }
    return timing;
}
function selection_transition(name) {
    var id2, timing;
    if (name instanceof Transition) {
        id2 = name._id, name = name._name;
    } else {
        id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                schedule(node, name, id2, i, group, timing || inherit(node, id2));
            }
        }
    }
    return new Transition(groups, this._parents, name, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
function number1(e) {
    return [
        +e[0],
        +e[1]
    ];
}
function number2(e) {
    return [
        number1(e[0]),
        number1(e[1])
    ];
}
({
    name: "x",
    handles: [
        "w",
        "e"
    ].map(type),
    input: function(x, e) {
        return x == null ? null : [
            [
                +x[0],
                e[0][1]
            ],
            [
                +x[1],
                e[1][1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][0],
            xy[1][0]
        ];
    }
});
({
    name: "y",
    handles: [
        "n",
        "s"
    ].map(type),
    input: function(y, e) {
        return y == null ? null : [
            [
                e[0][0],
                +y[0]
            ],
            [
                e[1][0],
                +y[1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][1],
            xy[1][1]
        ];
    }
});
({
    name: "xy",
    handles: [
        "n",
        "w",
        "e",
        "s",
        "nw",
        "ne",
        "sw",
        "se"
    ].map(type),
    input: function(xy) {
        return xy == null ? null : number2(xy);
    },
    output: function(xy) {
        return xy;
    }
});
function type(t) {
    return {
        type: t
    };
}
var pi = Math.PI, tau1 = 2 * pi, epsilon = 0.000001, tauEpsilon = tau1 - epsilon;
function Path() {
    this._x0 = this._y0 = this._x1 = this._y1 = null;
    this._ = "";
}
function path() {
    return new Path();
}
Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    },
    closePath: function() {
        if (this._x1 !== null) {
            this._x1 = this._x0, this._y1 = this._y0;
            this._ += "Z";
        }
    },
    lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x02 = this._x1, y02 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x02 - x1, y01 = y02 - y1, l01_2 = x01 * x01 + y01 * y01;
        if (r < 0) throw new Error("negative radius: " + r);
        if (this._x1 === null) {
            this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        } else if (!(l01_2 > epsilon)) ;
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
            this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        } else {
            var x20 = x2 - x02, y20 = y2 - y02, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
            if (Math.abs(t01 - 1) > epsilon) {
                this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }
            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
    },
    arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0), dy = r * Math.sin(a0), x03 = x + dx, y03 = y + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
        if (r < 0) throw new Error("negative radius: " + r);
        if (this._x1 === null) {
            this._ += "M" + x03 + "," + y03;
        } else if (Math.abs(this._x1 - x03) > epsilon || Math.abs(this._y1 - y03) > epsilon) {
            this._ += "L" + x03 + "," + y03;
        }
        if (!r) return;
        if (da < 0) da = da % tau1 + tau1;
        if (da > tauEpsilon) {
            this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x03) + "," + (this._y1 = y03);
        } else if (da > epsilon) {
            this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
    },
    rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
    },
    toString: function() {
        return this._;
    }
};
Array.prototype.slice;
var prefix = "$";
function Map() {}
Map.prototype = map.prototype = {
    constructor: Map,
    has: function(key) {
        return prefix + key in this;
    },
    get: function(key) {
        return this[prefix + key];
    },
    set: function(key, value53) {
        this[prefix + key] = value53;
        return this;
    },
    remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
    },
    clear: function() {
        for(var property in this)if (property[0] === prefix) delete this[property];
    },
    keys: function() {
        var keys2 = [];
        for(var property in this)if (property[0] === prefix) keys2.push(property.slice(1));
        return keys2;
    },
    values: function() {
        var values2 = [];
        for(var property in this)if (property[0] === prefix) values2.push(this[property]);
        return values2;
    },
    entries: function() {
        var entries2 = [];
        for(var property in this)if (property[0] === prefix) entries2.push({
            key: property.slice(1),
            value: this[property]
        });
        return entries2;
    },
    size: function() {
        var size3 = 0;
        for(var property in this)if (property[0] === prefix) ++size3;
        return size3;
    },
    empty: function() {
        for(var property in this)if (property[0] === prefix) return false;
        return true;
    },
    each: function(f) {
        for(var property in this)if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
};
function map(object2, f) {
    var map2 = new Map();
    if (object2 instanceof Map) object2.each(function(value54, key2) {
        map2.set(key2, value54);
    });
    else if (Array.isArray(object2)) {
        var i = -1, n = object2.length, o;
        if (f == null) while(++i < n)map2.set(i, object2[i]);
        else while(++i < n)map2.set(f(o = object2[i], i, object2), o);
    } else if (object2) for(var key in object2)map2.set(key, object2[key]);
    return map2;
}
function Set() {}
var proto = map.prototype;
Set.prototype = set2.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value55) {
        value55 += "";
        this[prefix + value55] = value55;
        return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
};
function set2(object3, f) {
    var set21 = new Set();
    if (object3 instanceof Set) object3.each(function(value56) {
        set21.add(value56);
    });
    else if (object3) {
        var i = -1, n = object3.length;
        if (f == null) while(++i < n)set21.add(object3[i]);
        else while(++i < n)set21.add(f(object3[i], i, object3));
    }
    return set21;
}
var array1 = Array.prototype;
array1.slice;
var EOL = {}, EOF = {}, QUOTE = 34, NEWLINE = 10, RETURN = 13;
function objectConverter(columns1) {
    return new Function("d", "return {" + columns1.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + '] || ""';
    }).join(",") + "}");
}
function customConverter(columns2, f) {
    var object4 = objectConverter(columns2);
    return function(row, i) {
        return f(object4(row), i, columns2);
    };
}
function inferColumns(rows) {
    var columnSet = Object.create(null), columns3 = [];
    rows.forEach(function(row) {
        for(var column in row){
            if (!(column in columnSet)) {
                columns3.push(columnSet[column] = column);
            }
        }
    });
    return columns3;
}
function pad(value57, width) {
    var s = value57 + "", length1 = s.length;
    return length1 < width ? new Array(width - length1 + 1).join(0) + s : s;
}
function formatYear(year1) {
    return year1 < 0 ? "-" + pad(-year1, 6) : year1 > 9999 ? "+" + pad(year1, 6) : pad(year1, 4);
}
function formatDate(date1) {
    var hours = date1.getUTCHours(), minutes = date1.getUTCMinutes(), seconds = date1.getUTCSeconds(), milliseconds = date1.getUTCMilliseconds();
    return isNaN(date1) ? "Invalid Date" : formatYear(date1.getUTCFullYear()) + "-" + pad(date1.getUTCMonth() + 1, 2) + "-" + pad(date1.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
}
function dsv(delimiter) {
    var reFormat = new RegExp('["' + delimiter + "\n\r]"), DELIMITER = delimiter.charCodeAt(0);
    function parse(text1, f) {
        var convert, columns4, rows = parseRows(text1, function(row, i) {
            if (convert) return convert(row, i - 1);
            columns4 = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns4 || [];
        return rows;
    }
    function parseRows(text2, f) {
        var rows = [], N = text2.length, I = 0, n = 0, t, eof = N <= 0, eol = false;
        if (text2.charCodeAt(N - 1) === NEWLINE) --N;
        if (text2.charCodeAt(N - 1) === RETURN) --N;
        function token() {
            if (eof) return EOF;
            if (eol) return eol = false, EOL;
            var i, j = I, c;
            if (text2.charCodeAt(j) === QUOTE) {
                while((I++) < N && text2.charCodeAt(I) !== QUOTE || text2.charCodeAt(++I) === QUOTE);
                if ((i = I) >= N) eof = true;
                else if ((c = text2.charCodeAt(I++)) === NEWLINE) eol = true;
                else if (c === RETURN) {
                    eol = true;
                    if (text2.charCodeAt(I) === NEWLINE) ++I;
                }
                return text2.slice(j + 1, i - 1).replace(/""/g, '"');
            }
            while(I < N){
                if ((c = text2.charCodeAt(i = I++)) === NEWLINE) eol = true;
                else if (c === RETURN) {
                    eol = true;
                    if (text2.charCodeAt(I) === NEWLINE) ++I;
                } else if (c !== DELIMITER) continue;
                return text2.slice(j, i);
            }
            return eof = true, text2.slice(j, N);
        }
        while((t = token()) !== EOF){
            var row = [];
            while(t !== EOL && t !== EOF)row.push(t), t = token();
            if (f && (row = f(row, n++)) == null) continue;
            rows.push(row);
        }
        return rows;
    }
    function preformatBody(rows, columns5) {
        return rows.map(function(row) {
            return columns5.map(function(column) {
                return formatValue(row[column]);
            }).join(delimiter);
        });
    }
    function format2(rows, columns6) {
        if (columns6 == null) columns6 = inferColumns(rows);
        return [
            columns6.map(formatValue).join(delimiter)
        ].concat(preformatBody(rows, columns6)).join("\n");
    }
    function formatBody(rows, columns7) {
        if (columns7 == null) columns7 = inferColumns(rows);
        return preformatBody(rows, columns7).join("\n");
    }
    function formatRows(rows) {
        return rows.map(formatRow).join("\n");
    }
    function formatRow(row) {
        return row.map(formatValue).join(delimiter);
    }
    function formatValue(value58) {
        return value58 == null ? "" : value58 instanceof Date ? formatDate(value58) : reFormat.test(value58 += "") ? '"' + value58.replace(/"/g, '""') + '"' : value58;
    }
    return {
        parse,
        parseRows,
        format: format2,
        formatBody,
        formatRows,
        formatRow,
        formatValue
    };
}
var csv = dsv(",");
var csvParse = csv.parse;
csv.parseRows;
csv.format;
csv.formatBody;
csv.formatRows;
csv.formatRow;
csv.formatValue;
var tsv = dsv("	");
var tsvParse = tsv.parse;
tsv.parseRows;
tsv.format;
tsv.formatBody;
tsv.formatRows;
tsv.formatRow;
tsv.formatValue;
new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();
function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
}
function text(input, init1) {
    return fetch(input, init1).then(responseText);
}
function dsvParse(parse) {
    return function(input, init2, row) {
        if (arguments.length === 2 && typeof init2 === "function") row = init2, init2 = void 0;
        return text(input, init2).then(function(response) {
            return parse(response, row);
        });
    };
}
dsvParse(csvParse);
dsvParse(tsvParse);
function parser(type10) {
    return function(input, init3) {
        return text(input, init3).then(function(text2) {
            return new DOMParser().parseFromString(text2, type10);
        });
    };
}
parser("application/xml");
parser("text/html");
parser("image/svg+xml");
function tree_add(d) {
    var x = +this._x.call(null, d), y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
}
function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree;
    var parent, node = tree._root, leaf = {
        data: d
    }, x04 = tree._x0, y04 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
    if (!node) return tree._root = leaf, tree;
    while(node.length){
        if (right = x >= (xm = (x04 + x1) / 2)) x04 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y04 + y1) / 2)) y04 = ym;
        else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
    do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x04 + x1) / 2)) x04 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y04 + y1) / 2)) y04 = ym;
        else y1 = ym;
    }while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm))
    return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
    var d, i, n = data.length, x, y, xz = new Array(n), yz = new Array(n), x05 = Infinity, y05 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for(i = 0; i < n; ++i){
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x05) x05 = x;
        if (x > x1) x1 = x;
        if (y < y05) y05 = y;
        if (y > y1) y1 = y;
    }
    if (x05 > x1 || y05 > y1) return this;
    this.cover(x05, y05).cover(x1, y1);
    for(i = 0; i < n; ++i){
        add(this, xz[i], yz[i], data[i]);
    }
    return this;
}
function tree_cover(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this;
    var x06 = this._x0, y06 = this._y0, x1 = this._x1, y1 = this._y1;
    if (isNaN(x06)) {
        x1 = (x06 = Math.floor(x)) + 1;
        y1 = (y06 = Math.floor(y)) + 1;
    } else {
        var z = x1 - x06, node = this._root, parent, i;
        while(x06 > x || x >= x1 || y06 > y || y >= y1){
            i = (y < y06) << 1 | x < x06;
            parent = new Array(4), parent[i] = node, node = parent, z *= 2;
            switch(i){
                case 0:
                    x1 = x06 + z, y1 = y06 + z;
                    break;
                case 1:
                    x06 = x1 - z, y1 = y06 + z;
                    break;
                case 2:
                    x1 = x06 + z, y06 = y1 - z;
                    break;
                case 3:
                    x06 = x1 - z, y06 = y1 - z;
                    break;
            }
        }
        if (this._root && this._root.length) this._root = node;
    }
    this._x0 = x06;
    this._y0 = y06;
    this._x1 = x1;
    this._y1 = y1;
    return this;
}
function tree_data() {
    var data = [];
    this.visit(function(node) {
        if (!node.length) do data.push(node.data);
        while (node = node.next)
    });
    return data;
}
function tree_extent(_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [
        [
            this._x0,
            this._y0
        ],
        [
            this._x1,
            this._y1
        ]
    ];
}
function Quad(node, x07, y07, x1, y1) {
    this.node = node;
    this.x0 = x07;
    this.y0 = y07;
    this.x1 = x1;
    this.y1 = y1;
}
function tree_find(x, y, radius) {
    var data, x08 = this._x0, y08 = this._y0, x1, y1, x2, y2, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
    if (node) quads.push(new Quad(node, x08, y08, x3, y3));
    if (radius == null) radius = Infinity;
    else {
        x08 = x - radius, y08 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
    }
    while(q = quads.pop()){
        if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x08 || (y2 = q.y1) < y08) continue;
        if (node.length) {
            var xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
            quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym));
            if (i = (y >= ym) << 1 | x >= xm) {
                q = quads[quads.length - 1];
                quads[quads.length - 1] = quads[quads.length - 1 - i];
                quads[quads.length - 1 - i] = q;
            }
        } else {
            var dx = x - +this._x.call(null, node.data), dy = y - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
            if (d2 < radius) {
                var d = Math.sqrt(radius = d2);
                x08 = x - d, y08 = y - d;
                x3 = x + d, y3 = y + d;
                data = node.data;
            }
        }
    }
    return data;
}
function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this;
    var parent, node = this._root, retainer, previous, next, x09 = this._x0, y09 = this._y0, x1 = this._x1, y1 = this._y1, x, y, xm, ym, right, bottom, i, j;
    if (!node) return this;
    if (node.length) while(true){
        if (right = x >= (xm = (x09 + x1) / 2)) x09 = xm;
        else x1 = xm;
        if (bottom = y >= (ym = (y09 + y1) / 2)) y09 = ym;
        else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
    }
    while(node.data !== d)if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;
    if (previous) return next ? previous.next = next : delete previous.next, this;
    if (!parent) return this._root = next, this;
    next ? parent[i] = next : delete parent[i];
    if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
    }
    return this;
}
function removeAll(data) {
    for(var i = 0, n = data.length; i < n; ++i)this.remove(data[i]);
    return this;
}
function tree_root() {
    return this._root;
}
function tree_size() {
    var size4 = 0;
    this.visit(function(node) {
        if (!node.length) do ++size4;
        while (node = node.next)
    });
    return size4;
}
function tree_visit(callback) {
    var quads = [], q, node = this._root, child, x010, y010, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while(q = quads.pop()){
        if (!callback(node = q.node, x010 = q.x0, y010 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
            var xm = (x010 + x1) / 2, ym = (y010 + y1) / 2;
            if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
            if (child = node[2]) quads.push(new Quad(child, x010, ym, xm, y1));
            if (child = node[1]) quads.push(new Quad(child, xm, y010, x1, ym));
            if (child = node[0]) quads.push(new Quad(child, x010, y010, xm, ym));
        }
    }
    return this;
}
function tree_visitAfter(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while(q = quads.pop()){
        var node = q.node;
        if (node.length) {
            var child, x011 = q.x0, y011 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x011 + x1) / 2, ym = (y011 + y1) / 2;
            if (child = node[0]) quads.push(new Quad(child, x011, y011, xm, ym));
            if (child = node[1]) quads.push(new Quad(child, xm, y011, x1, ym));
            if (child = node[2]) quads.push(new Quad(child, x011, ym, xm, y1));
            if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
    }
    while(q = next.pop()){
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
}
function defaultX(d) {
    return d[0];
}
function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
}
function defaultY(d) {
    return d[1];
}
function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
}
function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x, y, x012, y012, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x012;
    this._y0 = y012;
    this._x1 = x1;
    this._y1 = y1;
    this._root = void 0;
}
function leaf_copy(leaf) {
    var copy = {
        data: leaf.data
    }, next = copy;
    while(leaf = leaf.next)next = next.next = {
        data: leaf.data
    };
    return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
    if (!node) return copy;
    if (!node.length) return copy._root = leaf_copy(node), copy;
    nodes = [
        {
            source: node,
            target: copy._root = new Array(4)
        }
    ];
    while(node = nodes.pop()){
        for(var i = 0; i < 4; ++i){
            if (child = node.source[i]) {
                if (child.length) nodes.push({
                    source: child,
                    target: node.target[i] = new Array(4)
                });
                else node.target[i] = leaf_copy(child);
            }
        }
    }
    return copy;
};
treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;
function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1000000000000000000000 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}
function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null;
    var i, coefficient = x.slice(0, i);
    return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
    ];
}
function exponent1(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}
function formatGroup(grouping, thousands) {
    return function(value59, width) {
        var i = value59.length, t = [], j = 0, g = grouping[0], length2 = 0;
        while(i > 0 && g > 0){
            if (length2 + g + 1 > width) g = Math.max(1, width - length2);
            t.push(value59.substring(i -= g, i + g));
            if ((length2 += g + 1) > width) break;
            g = grouping[j = (j + 1) % grouping.length];
        }
        return t.reverse().join(thousands);
    };
}
function formatNumerals(numerals) {
    return function(value60) {
        return value60.replace(/[0-9]/g, function(i) {
            return numerals[+i];
        });
    };
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
    });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
    this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
    this.align = specifier.align === void 0 ? ">" : specifier.align + "";
    this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === void 0 ? void 0 : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function formatTrim(s) {
    out: for(var n = s.length, i = 1, i0 = -1, i1; i < n; ++i){
        switch(s[i]){
            case ".":
                i0 = i1 = i;
                break;
            case "0":
                if (i0 === 0) i0 = i;
                i1 = i;
                break;
            default:
                if (!+s[i]) break out;
                if (i0 > 0) i0 = 0;
                break;
        }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
var prefixExponent;
function formatPrefixAuto(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent2 = d[1], i = exponent2 - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) + 1, n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}
function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) return x + "";
    var coefficient = d[0], exponent2 = d[1];
    return exponent2 < 0 ? "0." + new Array(-exponent2).join("0") + coefficient : coefficient.length > exponent2 + 1 ? coefficient.slice(0, exponent2 + 1) + "." + coefficient.slice(exponent2 + 1) : coefficient + new Array(exponent2 - coefficient.length + 2).join("0");
}
var formatTypes = {
    "%": function(x, p) {
        return (x * 100).toFixed(p);
    },
    b: function(x) {
        return Math.round(x).toString(2);
    },
    c: function(x) {
        return x + "";
    },
    d: formatDecimal,
    e: function(x, p) {
        return x.toExponential(p);
    },
    f: function(x, p) {
        return x.toFixed(p);
    },
    g: function(x, p) {
        return x.toPrecision(p);
    },
    o: function(x) {
        return Math.round(x).toString(8);
    },
    p: function(x, p) {
        return formatRounded(x * 100, p);
    },
    r: formatRounded,
    s: formatPrefixAuto,
    X: function(x) {
        return Math.round(x).toString(16).toUpperCase();
    },
    x: function(x) {
        return Math.round(x).toString(16);
    }
};
function identity1(x) {
    return x;
}
var map1 = Array.prototype.map, prefixes = [
    "y",
    "z",
    "a",
    "f",
    "p",
    "n",
    "\xB5",
    "m",
    "",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y"
];
function formatLocale(locale2) {
    var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity1 : formatGroup(map1.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity1 : formatNumerals(map1.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "-" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
    function newFormat(specifier) {
        specifier = formatSpecifier(specifier);
        var fill = specifier.fill, align = specifier.align, sign2 = specifier.sign, symbol = specifier.symbol, zero1 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type11 = specifier.type;
        if (type11 === "n") comma = true, type11 = "g";
        else if (!formatTypes[type11]) precision === void 0 && (precision = 12), trim = true, type11 = "g";
        if (zero1 || fill === "0" && align === "=") zero1 = true, fill = "0", align = "=";
        var prefix2 = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type11) ? "0" + type11.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type11) ? percent : "";
        var formatType = formatTypes[type11], maybeSuffix = /[defgprs%]/.test(type11);
        precision = precision === void 0 ? 6 : /[gprs]/.test(type11) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
        function format2(value61) {
            var valuePrefix = prefix2, valueSuffix = suffix, i, n, c;
            if (type11 === "c") {
                valueSuffix = formatType(value61) + valueSuffix;
                value61 = "";
            } else {
                value61 = +value61;
                var valueNegative = value61 < 0 || 1 / value61 < 0;
                value61 = isNaN(value61) ? nan : formatType(Math.abs(value61), precision);
                if (trim) value61 = formatTrim(value61);
                if (valueNegative && +value61 === 0 && sign2 !== "+") valueNegative = false;
                valuePrefix = (valueNegative ? sign2 === "(" ? sign2 : minus : sign2 === "-" || sign2 === "(" ? "" : sign2) + valuePrefix;
                valueSuffix = (type11 === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign2 === "(" ? ")" : "");
                if (maybeSuffix) {
                    i = -1, n = value61.length;
                    while(++i < n){
                        if (c = value61.charCodeAt(i), 48 > c || c > 57) {
                            valueSuffix = (c === 46 ? decimal + value61.slice(i + 1) : value61.slice(i)) + valueSuffix;
                            value61 = value61.slice(0, i);
                            break;
                        }
                    }
                }
            }
            if (comma && !zero1) value61 = group(value61, Infinity);
            var length3 = valuePrefix.length + value61.length + valueSuffix.length, padding1 = length3 < width ? new Array(width - length3 + 1).join(fill) : "";
            if (comma && zero1) value61 = group(padding1 + value61, padding1.length ? width - valueSuffix.length : Infinity), padding1 = "";
            switch(align){
                case "<":
                    value61 = valuePrefix + value61 + valueSuffix + padding1;
                    break;
                case "=":
                    value61 = valuePrefix + padding1 + value61 + valueSuffix;
                    break;
                case "^":
                    value61 = padding1.slice(0, length3 = padding1.length >> 1) + valuePrefix + value61 + valueSuffix + padding1.slice(length3);
                    break;
                default:
                    value61 = padding1 + valuePrefix + value61 + valueSuffix;
                    break;
            }
            return numerals(value61);
        }
        format2.toString = function() {
            return specifier + "";
        };
        return format2;
    }
    function formatPrefix2(specifier, value62) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent1(value62) / 3))) * 3, k = Math.pow(10, -e), prefix3 = prefixes[8 + e / 3];
        return function(value2) {
            return f(k * value2) + prefix3;
        };
    }
    return {
        format: newFormat,
        formatPrefix: formatPrefix2
    };
}
var locale;
var format;
var formatPrefix;
defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [
        3
    ],
    currency: [
        "$",
        ""
    ],
    minus: "-"
});
function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
}
function adder() {
    return new Adder();
}
function Adder() {
    this.reset();
}
Adder.prototype = {
    constructor: Adder,
    reset: function() {
        this.s = this.t = 0;
    },
    add: function(y) {
        add1(temp, y, this.t);
        add1(this, temp.s, this.s);
        if (this.s) this.t += temp.t;
        else this.s = temp.t;
    },
    valueOf: function() {
        return this.s;
    }
};
var temp = new Adder();
function add1(adder2, a, b) {
    var x = adder2.s = a + b, bv = x - a, av = x - bv;
    adder2.t = a - av + (b - bv);
}
var epsilon1 = 0.000001;
var epsilon2 = 0.000000000001;
var pi1 = Math.PI;
var halfPi = pi1 / 2;
var quarterPi = pi1 / 4;
var tau2 = pi1 * 2;
var degrees1 = 180 / pi1;
var radians = pi1 / 180;
var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var exp = Math.exp;
var log = Math.log;
var sin = Math.sin;
var sign = Math.sign || function(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
};
var sqrt = Math.sqrt;
var tan = Math.tan;
function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi1 : Math.acos(x);
}
function asin(x) {
    return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}
function noop1() {}
function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
        streamGeometryType[geometry.type](geometry, stream);
    }
}
var streamObjectType = {
    Feature: function(object2, stream) {
        streamGeometry(object2.geometry, stream);
    },
    FeatureCollection: function(object2, stream) {
        var features = object2.features, i = -1, n = features.length;
        while(++i < n)streamGeometry(features[i].geometry, stream);
    }
};
var streamGeometryType = {
    Sphere: function(object2, stream) {
        stream.sphere();
    },
    Point: function(object2, stream) {
        object2 = object2.coordinates;
        stream.point(object2[0], object2[1], object2[2]);
    },
    MultiPoint: function(object2, stream) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)object2 = coordinates2[i], stream.point(object2[0], object2[1], object2[2]);
    },
    LineString: function(object2, stream) {
        streamLine(object2.coordinates, stream, 0);
    },
    MultiLineString: function(object2, stream) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)streamLine(coordinates2[i], stream, 0);
    },
    Polygon: function(object2, stream) {
        streamPolygon(object2.coordinates, stream);
    },
    MultiPolygon: function(object2, stream) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)streamPolygon(coordinates2[i], stream);
    },
    GeometryCollection: function(object2, stream) {
        var geometries = object2.geometries, i = -1, n = geometries.length;
        while(++i < n)streamGeometry(geometries[i], stream);
    }
};
function streamLine(coordinates2, stream, closed) {
    var i = -1, n = coordinates2.length - closed, coordinate;
    stream.lineStart();
    while(++i < n)coordinate = coordinates2[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    stream.lineEnd();
}
function streamPolygon(coordinates2, stream) {
    var i = -1, n = coordinates2.length;
    stream.polygonStart();
    while(++i < n)streamLine(coordinates2[i], stream, 1);
    stream.polygonEnd();
}
function geoStream(object2, stream) {
    if (object2 && streamObjectType.hasOwnProperty(object2.type)) {
        streamObjectType[object2.type](object2, stream);
    } else {
        streamGeometry(object2, stream);
    }
}
var areaRingSum = adder();
var areaSum = adder(), lambda00, phi00, lambda0, cosPhi0, sinPhi0;
var areaStream = {
    point: noop1,
    lineStart: noop1,
    lineEnd: noop1,
    polygonStart: function() {
        areaRingSum.reset();
        areaStream.lineStart = areaRingStart;
        areaStream.lineEnd = areaRingEnd;
    },
    polygonEnd: function() {
        var areaRing = +areaRingSum;
        areaSum.add(areaRing < 0 ? tau2 + areaRing : areaRing);
        this.lineStart = this.lineEnd = this.point = noop1;
    },
    sphere: function() {
        areaSum.add(tau2);
    }
};
function areaRingStart() {
    areaStream.point = areaPointFirst;
}
function areaRingEnd() {
    areaPoint(lambda00, phi00);
}
function areaPointFirst(lambda, phi2) {
    areaStream.point = areaPoint;
    lambda00 = lambda, phi00 = phi2;
    lambda *= radians, phi2 *= radians;
    lambda0 = lambda, cosPhi0 = cos(phi2 = phi2 / 2 + quarterPi), sinPhi0 = sin(phi2);
}
function areaPoint(lambda, phi3) {
    lambda *= radians, phi3 *= radians;
    phi3 = phi3 / 2 + quarterPi;
    var dLambda = lambda - lambda0, sdLambda = dLambda >= 0 ? 1 : -1, adLambda = sdLambda * dLambda, cosPhi = cos(phi3), sinPhi = sin(phi3), k = sinPhi0 * sinPhi, u = cosPhi0 * cosPhi + k * cos(adLambda), v = k * sdLambda * sin(adLambda);
    areaRingSum.add(atan2(v, u));
    lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
}
function spherical(cartesian2) {
    return [
        atan2(cartesian2[1], cartesian2[0]),
        asin(cartesian2[2])
    ];
}
function cartesian(spherical2) {
    var lambda = spherical2[0], phi4 = spherical2[1], cosPhi = cos(phi4);
    return [
        cosPhi * cos(lambda),
        cosPhi * sin(lambda),
        sin(phi4)
    ];
}
function cartesianCross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
function cartesianNormalizeInPlace(d) {
    var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l, d[1] /= l, d[2] /= l;
}
var lambda0$1, phi0, lambda1, phi1, lambda2, lambda00$1, phi00$1, p0, deltaSum = adder(), ranges, range;
var boundsStream = {
    point: boundsPoint,
    lineStart: boundsLineStart,
    lineEnd: boundsLineEnd,
    polygonStart: function() {
        boundsStream.point = boundsRingPoint;
        boundsStream.lineStart = boundsRingStart;
        boundsStream.lineEnd = boundsRingEnd;
        deltaSum.reset();
        areaStream.polygonStart();
    },
    polygonEnd: function() {
        areaStream.polygonEnd();
        boundsStream.point = boundsPoint;
        boundsStream.lineStart = boundsLineStart;
        boundsStream.lineEnd = boundsLineEnd;
        if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
        else if (deltaSum > epsilon1) phi1 = 90;
        else if (deltaSum < -epsilon1) phi0 = -90;
        range[0] = lambda0$1, range[1] = lambda1;
    },
    sphere: function() {
        lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    }
};
function boundsPoint(lambda, phi5) {
    ranges.push(range = [
        lambda0$1 = lambda,
        lambda1 = lambda
    ]);
    if (phi5 < phi0) phi0 = phi5;
    if (phi5 > phi1) phi1 = phi5;
}
function linePoint(lambda, phi6) {
    var p = cartesian([
        lambda * radians,
        phi6 * radians
    ]);
    if (p0) {
        var normal1 = cartesianCross(p0, p), equatorial = [
            normal1[1],
            -normal1[0],
            0
        ], inflection = cartesianCross(equatorial, normal1);
        cartesianNormalizeInPlace(inflection);
        inflection = spherical(inflection);
        var delta = lambda - lambda2, sign2 = delta > 0 ? 1 : -1, lambdai = inflection[0] * degrees1 * sign2, phii, antimeridian = abs(delta) > 180;
        if (antimeridian ^ (sign2 * lambda2 < lambdai && lambdai < sign2 * lambda)) {
            phii = inflection[1] * degrees1;
            if (phii > phi1) phi1 = phii;
        } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign2 * lambda2 < lambdai && lambdai < sign2 * lambda)) {
            phii = -inflection[1] * degrees1;
            if (phii < phi0) phi0 = phii;
        } else {
            if (phi6 < phi0) phi0 = phi6;
            if (phi6 > phi1) phi1 = phi6;
        }
        if (antimeridian) {
            if (lambda < lambda2) {
                if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
            } else {
                if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
            }
        } else {
            if (lambda1 >= lambda0$1) {
                if (lambda < lambda0$1) lambda0$1 = lambda;
                if (lambda > lambda1) lambda1 = lambda;
            } else {
                if (lambda > lambda2) {
                    if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
                } else {
                    if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
                }
            }
        }
    } else {
        ranges.push(range = [
            lambda0$1 = lambda,
            lambda1 = lambda
        ]);
    }
    if (phi6 < phi0) phi0 = phi6;
    if (phi6 > phi1) phi1 = phi6;
    p0 = p, lambda2 = lambda;
}
function boundsLineStart() {
    boundsStream.point = linePoint;
}
function boundsLineEnd() {
    range[0] = lambda0$1, range[1] = lambda1;
    boundsStream.point = boundsPoint;
    p0 = null;
}
function boundsRingPoint(lambda, phi7) {
    if (p0) {
        var delta = lambda - lambda2;
        deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
    } else {
        lambda00$1 = lambda, phi00$1 = phi7;
    }
    areaStream.point(lambda, phi7);
    linePoint(lambda, phi7);
}
function boundsRingStart() {
    areaStream.lineStart();
}
function boundsRingEnd() {
    boundsRingPoint(lambda00$1, phi00$1);
    areaStream.lineEnd();
    if (abs(deltaSum) > epsilon1) lambda0$1 = -(lambda1 = 180);
    range[0] = lambda0$1, range[1] = lambda1;
    p0 = null;
}
function angle(lambda02, lambda12) {
    return (lambda12 -= lambda02) < 0 ? lambda12 + 360 : lambda12;
}
var W0, W1, X0, Y0, Z0, X1, Y1, Z1, X2, Y2, Z2, lambda00$2, phi00$2, x0, y0, z0;
var centroidStream = {
    sphere: noop1,
    point: centroidPoint,
    lineStart: centroidLineStart,
    lineEnd: centroidLineEnd,
    polygonStart: function() {
        centroidStream.lineStart = centroidRingStart;
        centroidStream.lineEnd = centroidRingEnd;
    },
    polygonEnd: function() {
        centroidStream.lineStart = centroidLineStart;
        centroidStream.lineEnd = centroidLineEnd;
    }
};
function centroidPoint(lambda, phi8) {
    lambda *= radians, phi8 *= radians;
    var cosPhi = cos(phi8);
    centroidPointCartesian(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi8));
}
function centroidPointCartesian(x, y, z) {
    ++W0;
    X0 += (x - X0) / W0;
    Y0 += (y - Y0) / W0;
    Z0 += (z - Z0) / W0;
}
function centroidLineStart() {
    centroidStream.point = centroidLinePointFirst;
}
function centroidLinePointFirst(lambda, phi9) {
    lambda *= radians, phi9 *= radians;
    var cosPhi = cos(phi9);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi9);
    centroidStream.point = centroidLinePoint;
    centroidPointCartesian(x0, y0, z0);
}
function centroidLinePoint(lambda, phi10) {
    lambda *= radians, phi10 *= radians;
    var cosPhi = cos(phi10), x = cosPhi * cos(lambda), y = cosPhi * sin(lambda), z = sin(phi10), w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
}
function centroidLineEnd() {
    centroidStream.point = centroidPoint;
}
function centroidRingStart() {
    centroidStream.point = centroidRingPointFirst;
}
function centroidRingEnd() {
    centroidRingPoint(lambda00$2, phi00$2);
    centroidStream.point = centroidPoint;
}
function centroidRingPointFirst(lambda, phi11) {
    lambda00$2 = lambda, phi00$2 = phi11;
    lambda *= radians, phi11 *= radians;
    centroidStream.point = centroidRingPoint;
    var cosPhi = cos(phi11);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi11);
    centroidPointCartesian(x0, y0, z0);
}
function centroidRingPoint(lambda, phi12) {
    lambda *= radians, phi12 *= radians;
    var cosPhi = cos(phi12), x = cosPhi * cos(lambda), y = cosPhi * sin(lambda), z = sin(phi12), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = sqrt(cx * cx + cy * cy + cz * cz), w = asin(m), v = m && -w / m;
    X2 += v * cx;
    Y2 += v * cy;
    Z2 += v * cz;
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
}
function rotationIdentity(lambda, phi13) {
    return [
        abs(lambda) > pi1 ? lambda + Math.round(-lambda / tau2) * tau2 : lambda,
        phi13
    ];
}
rotationIdentity.invert = rotationIdentity;
function clipBuffer() {
    var lines = [], line;
    return {
        point: function(x, y, m) {
            line.push([
                x,
                y,
                m
            ]);
        },
        lineStart: function() {
            lines.push(line = []);
        },
        lineEnd: noop1,
        rejoin: function() {
            if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
        },
        result: function() {
            var result = lines;
            lines = [];
            line = null;
            return result;
        }
    };
}
function pointEqual(a, b) {
    return abs(a[0] - b[0]) < epsilon1 && abs(a[1] - b[1]) < epsilon1;
}
function Intersection(point1, points, other, entry) {
    this.x = point1;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
}
function clipRejoin(segments, compareIntersection2, startInside, interpolate2, stream) {
    var subject = [], clip2 = [], i, n;
    segments.forEach(function(segment) {
        if ((n2 = segment.length - 1) <= 0) return;
        var n2, p02 = segment[0], p1 = segment[n2], x;
        if (pointEqual(p02, p1)) {
            if (!p02[2] && !p1[2]) {
                stream.lineStart();
                for(i = 0; i < n2; ++i)stream.point((p02 = segment[i])[0], p02[1]);
                stream.lineEnd();
                return;
            }
            p1[0] += 2 * epsilon1;
        }
        subject.push(x = new Intersection(p02, segment, null, true));
        clip2.push(x.o = new Intersection(p02, null, x, false));
        subject.push(x = new Intersection(p1, segment, null, false));
        clip2.push(x.o = new Intersection(p1, null, x, true));
    });
    if (!subject.length) return;
    clip2.sort(compareIntersection2);
    link(subject);
    link(clip2);
    for(i = 0, n = clip2.length; i < n; ++i){
        clip2[i].e = startInside = !startInside;
    }
    var start5 = subject[0], points, point2;
    while(1){
        var current = start5, isSubject = true;
        while(current.v)if ((current = current.n) === start5) return;
        points = current.z;
        stream.lineStart();
        do {
            current.v = current.o.v = true;
            if (current.e) {
                if (isSubject) {
                    for(i = 0, n = points.length; i < n; ++i)stream.point((point2 = points[i])[0], point2[1]);
                } else {
                    interpolate2(current.x, current.n.x, 1, stream);
                }
                current = current.n;
            } else {
                if (isSubject) {
                    points = current.p.z;
                    for(i = points.length - 1; i >= 0; --i)stream.point((point2 = points[i])[0], point2[1]);
                } else {
                    interpolate2(current.x, current.p.x, -1, stream);
                }
                current = current.p;
            }
            current = current.o;
            points = current.z;
            isSubject = !isSubject;
        }while (!current.v)
        stream.lineEnd();
    }
}
function link(array3) {
    if (!(n = array3.length)) return;
    var n, i = 0, a = array3[0], b;
    while(++i < n){
        a.n = b = array3[i];
        b.p = a;
        a = b;
    }
    a.n = b = array3[0];
    b.p = a;
}
var sum = adder();
function longitude(point3) {
    if (abs(point3[0]) <= pi1) return point3[0];
    else return sign(point3[0]) * ((abs(point3[0]) + pi1) % tau2 - pi1);
}
function polygonContains(polygon, point4) {
    var lambda = longitude(point4), phi14 = point4[1], sinPhi = sin(phi14), normal2 = [
        sin(lambda),
        -cos(lambda),
        0
    ], angle2 = 0, winding = 0;
    sum.reset();
    if (sinPhi === 1) phi14 = halfPi + epsilon1;
    else if (sinPhi === -1) phi14 = -halfPi - epsilon1;
    for(var i = 0, n = polygon.length; i < n; ++i){
        if (!(m = (ring = polygon[i]).length)) continue;
        var ring, m, point0 = ring[m - 1], lambda02 = longitude(point0), phi02 = point0[1] / 2 + quarterPi, sinPhi02 = sin(phi02), cosPhi02 = cos(phi02);
        for(var j = 0; j < m; ++j, lambda02 = lambda12, sinPhi02 = sinPhi1, cosPhi02 = cosPhi1, point0 = point1){
            var point1 = ring[j], lambda12 = longitude(point1), phi12 = point1[1] / 2 + quarterPi, sinPhi1 = sin(phi12), cosPhi1 = cos(phi12), delta = lambda12 - lambda02, sign2 = delta >= 0 ? 1 : -1, absDelta = sign2 * delta, antimeridian = absDelta > pi1, k = sinPhi02 * sinPhi1;
            sum.add(atan2(k * sign2 * sin(absDelta), cosPhi02 * cosPhi1 + k * cos(absDelta)));
            angle2 += antimeridian ? delta + sign2 * tau2 : delta;
            if (antimeridian ^ lambda02 >= lambda ^ lambda12 >= lambda) {
                var arc = cartesianCross(cartesian(point0), cartesian(point1));
                cartesianNormalizeInPlace(arc);
                var intersection = cartesianCross(normal2, arc);
                cartesianNormalizeInPlace(intersection);
                var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
                if (phi14 > phiArc || phi14 === phiArc && (arc[0] || arc[1])) {
                    winding += antimeridian ^ delta >= 0 ? 1 : -1;
                }
            }
        }
    }
    return (angle2 < -epsilon1 || angle2 < epsilon1 && sum < -epsilon1) ^ winding & 1;
}
function clip(pointVisible, clipLine2, interpolate2, start6) {
    return function(sink) {
        var line = clipLine2(sink), ringBuffer = clipBuffer(), ringSink = clipLine2(ringBuffer), polygonStarted = false, polygon, segments, ring;
        var clip2 = {
            point: point5,
            lineStart,
            lineEnd,
            polygonStart: function() {
                clip2.point = pointRing;
                clip2.lineStart = ringStart;
                clip2.lineEnd = ringEnd;
                segments = [];
                polygon = [];
            },
            polygonEnd: function() {
                clip2.point = point5;
                clip2.lineStart = lineStart;
                clip2.lineEnd = lineEnd;
                segments = merge(segments);
                var startInside = polygonContains(polygon, start6);
                if (segments.length) {
                    if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
                    clipRejoin(segments, compareIntersection, startInside, interpolate2, sink);
                } else if (startInside) {
                    if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
                    sink.lineStart();
                    interpolate2(null, null, 1, sink);
                    sink.lineEnd();
                }
                if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
                segments = polygon = null;
            },
            sphere: function() {
                sink.polygonStart();
                sink.lineStart();
                interpolate2(null, null, 1, sink);
                sink.lineEnd();
                sink.polygonEnd();
            }
        };
        function point5(lambda, phi15) {
            if (pointVisible(lambda, phi15)) sink.point(lambda, phi15);
        }
        function pointLine(lambda, phi16) {
            line.point(lambda, phi16);
        }
        function lineStart() {
            clip2.point = pointLine;
            line.lineStart();
        }
        function lineEnd() {
            clip2.point = point5;
            line.lineEnd();
        }
        function pointRing(lambda, phi17) {
            ring.push([
                lambda,
                phi17
            ]);
            ringSink.point(lambda, phi17);
        }
        function ringStart() {
            ringSink.lineStart();
            ring = [];
        }
        function ringEnd() {
            pointRing(ring[0][0], ring[0][1]);
            ringSink.lineEnd();
            var clean = ringSink.clean(), ringSegments = ringBuffer.result(), i, n = ringSegments.length, m, segment, point2;
            ring.pop();
            polygon.push(ring);
            ring = null;
            if (!n) return;
            if (clean & 1) {
                segment = ringSegments[0];
                if ((m = segment.length - 1) > 0) {
                    if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
                    sink.lineStart();
                    for(i = 0; i < m; ++i)sink.point((point2 = segment[i])[0], point2[1]);
                    sink.lineEnd();
                }
                return;
            }
            if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
            segments.push(ringSegments.filter(validSegment));
        }
        return clip2;
    };
}
function validSegment(segment) {
    return segment.length > 1;
}
function compareIntersection(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon1 : halfPi - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon1 : halfPi - b[1]);
}
clip(function() {
    return true;
}, clipAntimeridianLine, clipAntimeridianInterpolate, [
    -pi1,
    -halfPi
]);
function clipAntimeridianLine(stream) {
    var lambda02 = NaN, phi02 = NaN, sign0 = NaN, clean;
    return {
        lineStart: function() {
            stream.lineStart();
            clean = 1;
        },
        point: function(lambda12, phi12) {
            var sign1 = lambda12 > 0 ? pi1 : -pi1, delta = abs(lambda12 - lambda02);
            if (abs(delta - pi1) < epsilon1) {
                stream.point(lambda02, phi02 = (phi02 + phi12) / 2 > 0 ? halfPi : -halfPi);
                stream.point(sign0, phi02);
                stream.lineEnd();
                stream.lineStart();
                stream.point(sign1, phi02);
                stream.point(lambda12, phi02);
                clean = 0;
            } else if (sign0 !== sign1 && delta >= pi1) {
                if (abs(lambda02 - sign0) < epsilon1) lambda02 -= sign0 * epsilon1;
                if (abs(lambda12 - sign1) < epsilon1) lambda12 -= sign1 * epsilon1;
                phi02 = clipAntimeridianIntersect(lambda02, phi02, lambda12, phi12);
                stream.point(sign0, phi02);
                stream.lineEnd();
                stream.lineStart();
                stream.point(sign1, phi02);
                clean = 0;
            }
            stream.point(lambda02 = lambda12, phi02 = phi12);
            sign0 = sign1;
        },
        lineEnd: function() {
            stream.lineEnd();
            lambda02 = phi02 = NaN;
        },
        clean: function() {
            return 2 - clean;
        }
    };
}
function clipAntimeridianIntersect(lambda02, phi02, lambda12, phi12) {
    var cosPhi02, cosPhi1, sinLambda0Lambda1 = sin(lambda02 - lambda12);
    return abs(sinLambda0Lambda1) > epsilon1 ? atan((sin(phi02) * (cosPhi1 = cos(phi12)) * sin(lambda12) - sin(phi12) * (cosPhi02 = cos(phi02)) * sin(lambda02)) / (cosPhi02 * cosPhi1 * sinLambda0Lambda1)) : (phi02 + phi12) / 2;
}
function clipAntimeridianInterpolate(from, to, direction, stream) {
    var phi18;
    if (from == null) {
        phi18 = direction * halfPi;
        stream.point(-pi1, phi18);
        stream.point(0, phi18);
        stream.point(pi1, phi18);
        stream.point(pi1, 0);
        stream.point(pi1, -phi18);
        stream.point(0, -phi18);
        stream.point(-pi1, -phi18);
        stream.point(-pi1, 0);
        stream.point(-pi1, phi18);
    } else if (abs(from[0] - to[0]) > epsilon1) {
        var lambda = from[0] < to[0] ? pi1 : -pi1;
        phi18 = direction * lambda / 2;
        stream.point(-lambda, phi18);
        stream.point(0, phi18);
        stream.point(lambda, phi18);
    } else {
        stream.point(to[0], to[1]);
    }
}
var lengthSum = adder(), lambda0$2, sinPhi0$1, cosPhi0$1;
var lengthStream = {
    sphere: noop1,
    point: noop1,
    lineStart: lengthLineStart,
    lineEnd: noop1,
    polygonStart: noop1,
    polygonEnd: noop1
};
function lengthLineStart() {
    lengthStream.point = lengthPointFirst;
    lengthStream.lineEnd = lengthLineEnd;
}
function lengthLineEnd() {
    lengthStream.point = lengthStream.lineEnd = noop1;
}
function lengthPointFirst(lambda, phi19) {
    lambda *= radians, phi19 *= radians;
    lambda0$2 = lambda, sinPhi0$1 = sin(phi19), cosPhi0$1 = cos(phi19);
    lengthStream.point = lengthPoint;
}
function lengthPoint(lambda, phi20) {
    lambda *= radians, phi20 *= radians;
    var sinPhi = sin(phi20), cosPhi = cos(phi20), delta = abs(lambda - lambda0$2), cosDelta = cos(delta), sinDelta = sin(delta), x = cosPhi * sinDelta, y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta, z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
    lengthSum.add(atan2(sqrt(x * x + y * y), z));
    lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
}
function length(object2) {
    lengthSum.reset();
    geoStream(object2, lengthStream);
    return +lengthSum;
}
var coordinates = [
    null,
    null
], object1 = {
    type: "LineString",
    coordinates
};
function distance(a, b) {
    coordinates[0] = a;
    coordinates[1] = b;
    return length(object1);
}
var containsGeometryType = {
    Sphere: function() {
        return true;
    },
    Point: function(object2, point6) {
        return containsPoint(object2.coordinates, point6);
    },
    MultiPoint: function(object2, point7) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)if (containsPoint(coordinates2[i], point7)) return true;
        return false;
    },
    LineString: function(object2, point8) {
        return containsLine(object2.coordinates, point8);
    },
    MultiLineString: function(object2, point9) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)if (containsLine(coordinates2[i], point9)) return true;
        return false;
    },
    Polygon: function(object2, point10) {
        return containsPolygon(object2.coordinates, point10);
    },
    MultiPolygon: function(object2, point11) {
        var coordinates2 = object2.coordinates, i = -1, n = coordinates2.length;
        while(++i < n)if (containsPolygon(coordinates2[i], point11)) return true;
        return false;
    },
    GeometryCollection: function(object2, point12) {
        var geometries = object2.geometries, i = -1, n = geometries.length;
        while(++i < n)if (containsGeometry(geometries[i], point12)) return true;
        return false;
    }
};
function containsGeometry(geometry, point13) {
    return geometry && containsGeometryType.hasOwnProperty(geometry.type) ? containsGeometryType[geometry.type](geometry, point13) : false;
}
function containsPoint(coordinates2, point14) {
    return distance(coordinates2, point14) === 0;
}
function containsLine(coordinates2, point15) {
    var ao, bo, ab;
    for(var i = 0, n = coordinates2.length; i < n; i++){
        bo = distance(coordinates2[i], point15);
        if (bo === 0) return true;
        if (i > 0) {
            ab = distance(coordinates2[i], coordinates2[i - 1]);
            if (ab > 0 && ao <= ab && bo <= ab && (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < epsilon2 * ab) return true;
        }
        ao = bo;
    }
    return false;
}
function containsPolygon(coordinates2, point16) {
    return !!polygonContains(coordinates2.map(ringRadians), pointRadians(point16));
}
function ringRadians(ring) {
    return ring = ring.map(pointRadians), ring.pop(), ring;
}
function pointRadians(point17) {
    return [
        point17[0] * radians,
        point17[1] * radians
    ];
}
var areaSum$1 = adder(), areaRingSum$1 = adder(), x00, y00, x0$1, y0$1;
var areaStream$1 = {
    point: noop1,
    lineStart: noop1,
    lineEnd: noop1,
    polygonStart: function() {
        areaStream$1.lineStart = areaRingStart$1;
        areaStream$1.lineEnd = areaRingEnd$1;
    },
    polygonEnd: function() {
        areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop1;
        areaSum$1.add(abs(areaRingSum$1));
        areaRingSum$1.reset();
    },
    result: function() {
        var area2 = areaSum$1 / 2;
        areaSum$1.reset();
        return area2;
    }
};
function areaRingStart$1() {
    areaStream$1.point = areaPointFirst$1;
}
function areaPointFirst$1(x, y) {
    areaStream$1.point = areaPoint$1;
    x00 = x0$1 = x, y00 = y0$1 = y;
}
function areaPoint$1(x, y) {
    areaRingSum$1.add(y0$1 * x - x0$1 * y);
    x0$1 = x, y0$1 = y;
}
function areaRingEnd$1() {
    areaPoint$1(x00, y00);
}
var X0$1 = 0, Y0$1 = 0, Z0$1 = 0, X1$1 = 0, Y1$1 = 0, Z1$1 = 0, X2$1 = 0, Y2$1 = 0, Z2$1 = 0, x00$1, y00$1, x0$3, y0$3;
var centroidStream$1 = {
    point: centroidPoint$1,
    lineStart: centroidLineStart$1,
    lineEnd: centroidLineEnd$1,
    polygonStart: function() {
        centroidStream$1.lineStart = centroidRingStart$1;
        centroidStream$1.lineEnd = centroidRingEnd$1;
    },
    polygonEnd: function() {
        centroidStream$1.point = centroidPoint$1;
        centroidStream$1.lineStart = centroidLineStart$1;
        centroidStream$1.lineEnd = centroidLineEnd$1;
    },
    result: function() {
        var centroid2 = Z2$1 ? [
            X2$1 / Z2$1,
            Y2$1 / Z2$1
        ] : Z1$1 ? [
            X1$1 / Z1$1,
            Y1$1 / Z1$1
        ] : Z0$1 ? [
            X0$1 / Z0$1,
            Y0$1 / Z0$1
        ] : [
            NaN,
            NaN
        ];
        X0$1 = Y0$1 = Z0$1 = X1$1 = Y1$1 = Z1$1 = X2$1 = Y2$1 = Z2$1 = 0;
        return centroid2;
    }
};
function centroidPoint$1(x, y) {
    X0$1 += x;
    Y0$1 += y;
    ++Z0$1;
}
function centroidLineStart$1() {
    centroidStream$1.point = centroidPointFirstLine;
}
function centroidPointFirstLine(x, y) {
    centroidStream$1.point = centroidPointLine;
    centroidPoint$1(x0$3 = x, y0$3 = y);
}
function centroidPointLine(x, y) {
    var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
    centroidPoint$1(x0$3 = x, y0$3 = y);
}
function centroidLineEnd$1() {
    centroidStream$1.point = centroidPoint$1;
}
function centroidRingStart$1() {
    centroidStream$1.point = centroidPointFirstRing;
}
function centroidRingEnd$1() {
    centroidPointRing(x00$1, y00$1);
}
function centroidPointFirstRing(x, y) {
    centroidStream$1.point = centroidPointRing;
    centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
}
function centroidPointRing(x, y) {
    var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
    z = y0$3 * x - x0$3 * y;
    X2$1 += z * (x0$3 + x);
    Y2$1 += z * (y0$3 + y);
    Z2$1 += z * 3;
    centroidPoint$1(x0$3 = x, y0$3 = y);
}
function PathContext(context) {
    this._context = context;
}
PathContext.prototype = {
    _radius: 4.5,
    pointRadius: function(_) {
        return this._radius = _, this;
    },
    polygonStart: function() {
        this._line = 0;
    },
    polygonEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line === 0) this._context.closePath();
        this._point = NaN;
    },
    point: function(x, y) {
        switch(this._point){
            case 0:
                {
                    this._context.moveTo(x, y);
                    this._point = 1;
                    break;
                }
            case 1:
                {
                    this._context.lineTo(x, y);
                    break;
                }
            default:
                {
                    this._context.moveTo(x + this._radius, y);
                    this._context.arc(x, y, this._radius, 0, tau2);
                    break;
                }
        }
    },
    result: noop1
};
var lengthSum$1 = adder(), lengthRing, x00$2, y00$2, x0$4, y0$4;
var lengthStream$1 = {
    point: noop1,
    lineStart: function() {
        lengthStream$1.point = lengthPointFirst$1;
    },
    lineEnd: function() {
        if (lengthRing) lengthPoint$1(x00$2, y00$2);
        lengthStream$1.point = noop1;
    },
    polygonStart: function() {
        lengthRing = true;
    },
    polygonEnd: function() {
        lengthRing = null;
    },
    result: function() {
        var length2 = +lengthSum$1;
        lengthSum$1.reset();
        return length2;
    }
};
function lengthPointFirst$1(x, y) {
    lengthStream$1.point = lengthPoint$1;
    x00$2 = x0$4 = x, y00$2 = y0$4 = y;
}
function lengthPoint$1(x, y) {
    x0$4 -= x, y0$4 -= y;
    lengthSum$1.add(sqrt(x0$4 * x0$4 + y0$4 * y0$4));
    x0$4 = x, y0$4 = y;
}
function PathString() {
    this._string = [];
}
PathString.prototype = {
    _radius: 4.5,
    _circle: circle$1(4.5),
    pointRadius: function(_) {
        if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
        return this;
    },
    polygonStart: function() {
        this._line = 0;
    },
    polygonEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line === 0) this._string.push("Z");
        this._point = NaN;
    },
    point: function(x, y) {
        switch(this._point){
            case 0:
                {
                    this._string.push("M", x, ",", y);
                    this._point = 1;
                    break;
                }
            case 1:
                {
                    this._string.push("L", x, ",", y);
                    break;
                }
            default:
                {
                    if (this._circle == null) this._circle = circle$1(this._radius);
                    this._string.push("M", x, ",", y, this._circle);
                    break;
                }
        }
    },
    result: function() {
        if (this._string.length) {
            var result = this._string.join("");
            this._string = [];
            return result;
        } else {
            return null;
        }
    }
};
function circle$1(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
}
function transformer(methods) {
    return function(stream) {
        var s = new TransformStream();
        for(var key in methods)s[key] = methods[key];
        s.stream = stream;
        return s;
    };
}
function TransformStream() {}
TransformStream.prototype = {
    constructor: TransformStream,
    point: function(x, y) {
        this.stream.point(x, y);
    },
    sphere: function() {
        this.stream.sphere();
    },
    lineStart: function() {
        this.stream.lineStart();
    },
    lineEnd: function() {
        this.stream.lineEnd();
    },
    polygonStart: function() {
        this.stream.polygonStart();
    },
    polygonEnd: function() {
        this.stream.polygonEnd();
    }
};
cos(30 * radians);
transformer({
    point: function(x, y) {
        this.stream.point(x * radians, y * radians);
    }
});
function azimuthalRaw(scale) {
    return function(x, y) {
        var cx = cos(x), cy = cos(y), k = scale(cx * cy);
        return [
            k * cy * sin(x),
            k * sin(y)
        ];
    };
}
function azimuthalInvert(angle2) {
    return function(x, y) {
        var z = sqrt(x * x + y * y), c = angle2(z), sc = sin(c), cc = cos(c);
        return [
            atan2(x * sc, z * cc),
            asin(z && y * sc / z)
        ];
    };
}
var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
    return sqrt(2 / (1 + cxcy));
});
azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
    return 2 * asin(z / 2);
});
var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
    return (c = acos(c)) && c / sin(c);
});
azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
    return z;
});
function mercatorRaw(lambda, phi21) {
    return [
        lambda,
        log(tan((halfPi + phi21) / 2))
    ];
}
mercatorRaw.invert = function(x, y) {
    return [
        x,
        2 * atan(exp(y)) - halfPi
    ];
};
function equirectangularRaw(lambda, phi22) {
    return [
        lambda,
        phi22
    ];
}
equirectangularRaw.invert = equirectangularRaw;
var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = sqrt(3) / 2, iterations = 12;
function equalEarthRaw(lambda, phi23) {
    var l = asin(M * sin(phi23)), l2 = l * l, l6 = l2 * l2 * l2;
    return [
        lambda * cos(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))),
        l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2))
    ];
}
equalEarthRaw.invert = function(x, y) {
    var l = y, l2 = l * l, l6 = l2 * l2 * l2;
    for(var i = 0, delta, fy, fpy; i < iterations; ++i){
        fy = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)) - y;
        fpy = A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2);
        l -= delta = fy / fpy, l2 = l * l, l6 = l2 * l2 * l2;
        if (abs(delta) < epsilon2) break;
    }
    return [
        M * x * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)) / cos(l),
        asin(sin(l) / M)
    ];
};
function gnomonicRaw(x, y) {
    var cy = cos(y), k = cos(x) * cy;
    return [
        cy * sin(x) / k,
        sin(y) / k
    ];
}
gnomonicRaw.invert = azimuthalInvert(atan);
function naturalEarth1Raw(lambda, phi24) {
    var phi2 = phi24 * phi24, phi4 = phi2 * phi2;
    return [
        lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
        phi24 * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
    ];
}
naturalEarth1Raw.invert = function(x, y) {
    var phi25 = y, i = 25, delta;
    do {
        var phi2 = phi25 * phi25, phi4 = phi2 * phi2;
        phi25 -= delta = (phi25 * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
    }while (abs(delta) > epsilon1 && --i > 0)
    return [
        x / (0.8707 + (phi2 = phi25 * phi25) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
        phi25
    ];
};
function orthographicRaw(x, y) {
    return [
        cos(y) * sin(x),
        sin(y)
    ];
}
orthographicRaw.invert = azimuthalInvert(asin);
function stereographicRaw(x, y) {
    var cy = cos(y), k = 1 + cos(x) * cy;
    return [
        cy * sin(x) / k,
        sin(y) / k
    ];
}
stereographicRaw.invert = azimuthalInvert(function(z) {
    return 2 * atan(z);
});
function transverseMercatorRaw(lambda, phi26) {
    return [
        log(tan((halfPi + phi26) / 2)),
        -lambda
    ];
}
transverseMercatorRaw.invert = function(x, y) {
    return [
        -y,
        2 * atan(exp(x)) - halfPi
    ];
};
function count(node) {
    var sum1 = 0, children = node.children, i = children && children.length;
    if (!i) sum1 = 1;
    else while(--i >= 0)sum1 += children[i].value;
    node.value = sum1;
}
function node_count() {
    return this.eachAfter(count);
}
function node_each(callback) {
    var node = this, current, next = [
        node
    ], children, i, n;
    do {
        current = next.reverse(), next = [];
        while(node = current.pop()){
            callback(node), children = node.children;
            if (children) for(i = 0, n = children.length; i < n; ++i){
                next.push(children[i]);
            }
        }
    }while (next.length)
    return this;
}
function node_eachBefore(callback) {
    var node = this, nodes = [
        node
    ], children, i;
    while(node = nodes.pop()){
        callback(node), children = node.children;
        if (children) for(i = children.length - 1; i >= 0; --i){
            nodes.push(children[i]);
        }
    }
    return this;
}
function node_eachAfter(callback) {
    var node = this, nodes = [
        node
    ], next = [], children, i, n;
    while(node = nodes.pop()){
        next.push(node), children = node.children;
        if (children) for(i = 0, n = children.length; i < n; ++i){
            nodes.push(children[i]);
        }
    }
    while(node = next.pop()){
        callback(node);
    }
    return this;
}
function node_sum(value63) {
    return this.eachAfter(function(node) {
        var sum2 = +value63(node.data) || 0, children = node.children, i = children && children.length;
        while(--i >= 0)sum2 += children[i].value;
        node.value = sum2;
    });
}
function node_sort(compare) {
    return this.eachBefore(function(node) {
        if (node.children) {
            node.children.sort(compare);
        }
    });
}
function node_path(end) {
    var start7 = this, ancestor = leastCommonAncestor(start7, end), nodes = [
        start7
    ];
    while(start7 !== ancestor){
        start7 = start7.parent;
        nodes.push(start7);
    }
    var k = nodes.length;
    while(end !== ancestor){
        nodes.splice(k, 0, end);
        end = end.parent;
    }
    return nodes;
}
function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(), bNodes = b.ancestors(), c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while(a === b){
        c = a;
        a = aNodes.pop();
        b = bNodes.pop();
    }
    return c;
}
function node_ancestors() {
    var node = this, nodes = [
        node
    ];
    while(node = node.parent){
        nodes.push(node);
    }
    return nodes;
}
function node_descendants() {
    var nodes = [];
    this.each(function(node) {
        nodes.push(node);
    });
    return nodes;
}
function node_leaves() {
    var leaves = [];
    this.eachBefore(function(node) {
        if (!node.children) {
            leaves.push(node);
        }
    });
    return leaves;
}
function node_links() {
    var root1 = this, links = [];
    root1.each(function(node) {
        if (node !== root1) {
            links.push({
                source: node.parent,
                target: node
            });
        }
    });
    return links;
}
function hierarchy(data, children) {
    var root2 = new Node(data), valued = +data.value && (root2.value = data.value), node, nodes = [
        root2
    ], child, childs, i, n;
    if (children == null) children = defaultChildren;
    while(node = nodes.pop()){
        if (valued) node.value = +node.data.value;
        if ((childs = children(node.data)) && (n = childs.length)) {
            node.children = new Array(n);
            for(i = n - 1; i >= 0; --i){
                nodes.push(child = node.children[i] = new Node(childs[i]));
                child.parent = node;
                child.depth = node.depth + 1;
            }
        }
    }
    return root2.eachBefore(computeHeight);
}
function node_copy() {
    return hierarchy(this).eachBefore(copyData);
}
function defaultChildren(d) {
    return d.children;
}
function copyData(node) {
    node.data = node.data.data;
}
function computeHeight(node) {
    var height1 = 0;
    do node.height = height1;
    while ((node = node.parent) && node.height < ++height1)
}
function Node(data) {
    this.data = data;
    this.depth = this.height = 0;
    this.parent = null;
}
Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: node_count,
    each: node_each,
    eachAfter: node_eachAfter,
    eachBefore: node_eachBefore,
    sum: node_sum,
    sort: node_sort,
    path: node_path,
    ancestors: node_ancestors,
    descendants: node_descendants,
    leaves: node_leaves,
    links: node_links,
    copy: node_copy
};
Array.prototype.slice;
function treemapDice(parent, x013, y013, x1, y1) {
    var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (x1 - x013) / parent.value;
    while(++i < n){
        node = nodes[i], node.y0 = y013, node.y1 = y1;
        node.x0 = x013, node.x1 = x013 += node.value * k;
    }
}
function TreeNode(node, i) {
    this._ = node;
    this.parent = null;
    this.children = null;
    this.A = null;
    this.a = this;
    this.z = 0;
    this.m = 0;
    this.c = 0;
    this.s = 0;
    this.t = null;
    this.i = i;
}
TreeNode.prototype = Object.create(Node.prototype);
function treemapSlice(parent, x014, y014, x1, y1) {
    var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (y1 - y014) / parent.value;
    while(++i < n){
        node = nodes[i], node.x0 = x014, node.x1 = x1;
        node.y0 = y014, node.y1 = y014 += node.value * k;
    }
}
var phi = (1 + Math.sqrt(5)) / 2;
function squarifyRatio(ratio, parent, x015, y015, x1, y1) {
    var rows = [], nodes = parent.children, row, nodeValue, i0 = 0, i1 = 0, n = nodes.length, dx, dy, value64 = parent.value, sumValue, minValue, maxValue, newRatio, minRatio, alpha, beta;
    while(i0 < n){
        dx = x1 - x015, dy = y1 - y015;
        do sumValue = nodes[i1++].value;
        while (!sumValue && i1 < n)
        minValue = maxValue = sumValue;
        alpha = Math.max(dy / dx, dx / dy) / (value64 * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);
        for(; i1 < n; ++i1){
            sumValue += nodeValue = nodes[i1].value;
            if (nodeValue < minValue) minValue = nodeValue;
            if (nodeValue > maxValue) maxValue = nodeValue;
            beta = sumValue * sumValue * alpha;
            newRatio = Math.max(maxValue / beta, beta / minValue);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }
            minRatio = newRatio;
        }
        rows.push(row = {
            value: sumValue,
            dice: dx < dy,
            children: nodes.slice(i0, i1)
        });
        if (row.dice) treemapDice(row, x015, y015, x1, value64 ? y015 += dy * sumValue / value64 : y1);
        else treemapSlice(row, x015, y015, value64 ? x015 += dx * sumValue / value64 : x1, y1);
        value64 -= sumValue, i0 = i1;
    }
    return rows;
}
(function custom(ratio) {
    function squarify2(parent, x016, y016, x1, y1) {
        squarifyRatio(ratio, parent, x016, y016, x1, y1);
    }
    squarify2.ratio = function(x) {
        return custom((x = +x) > 1 ? x : 1);
    };
    return squarify2;
})(phi);
(function custom2(ratio) {
    function resquarify2(parent, x017, y017, x1, y1) {
        if ((rows = parent._squarify) && rows.ratio === ratio) {
            var rows, row, nodes, i, j = -1, n, m = rows.length, value65 = parent.value;
            while(++j < m){
                row = rows[j], nodes = row.children;
                for(i = row.value = 0, n = nodes.length; i < n; ++i)row.value += nodes[i].value;
                if (row.dice) treemapDice(row, x017, y017, x1, y017 += (y1 - y017) * row.value / value65);
                else treemapSlice(row, x017, y017, x017 += (x1 - x017) * row.value / value65, y1);
                value65 -= row.value;
            }
        } else {
            parent._squarify = rows = squarifyRatio(ratio, parent, x017, y017, x1, y1);
            rows.ratio = ratio;
        }
    }
    resquarify2.ratio = function(x) {
        return custom2((x = +x) > 1 ? x : 1);
    };
    return resquarify2;
})(phi);
function defaultSource() {
    return Math.random();
}
(function sourceRandomUniform(source) {
    function randomUniform(min, max) {
        min = min == null ? 0 : +min;
        max = max == null ? 1 : +max;
        if (arguments.length === 1) max = min, min = 0;
        else max -= min;
        return function() {
            return source() * max + min;
        };
    }
    randomUniform.source = sourceRandomUniform;
    return randomUniform;
})(defaultSource);
var normal = function sourceRandomNormal(source) {
    function randomNormal(mu, sigma) {
        var x, r;
        mu = mu == null ? 0 : +mu;
        sigma = sigma == null ? 1 : +sigma;
        return function() {
            var y;
            if (x != null) y = x, x = null;
            else do {
                x = source() * 2 - 1;
                y = source() * 2 - 1;
                r = x * x + y * y;
            }while (!r || r > 1)
            return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
        };
    }
    randomNormal.source = sourceRandomNormal;
    return randomNormal;
}(defaultSource);
(function sourceRandomLogNormal(source) {
    function randomLogNormal() {
        var randomNormal = normal.source(source).apply(this, arguments);
        return function() {
            return Math.exp(randomNormal());
        };
    }
    randomLogNormal.source = sourceRandomLogNormal;
    return randomLogNormal;
})(defaultSource);
var irwinHall = function sourceRandomIrwinHall(source) {
    function randomIrwinHall(n) {
        return function() {
            for(var sum3 = 0, i = 0; i < n; ++i)sum3 += source();
            return sum3;
        };
    }
    randomIrwinHall.source = sourceRandomIrwinHall;
    return randomIrwinHall;
}(defaultSource);
(function sourceRandomBates(source) {
    function randomBates(n) {
        var randomIrwinHall = irwinHall.source(source)(n);
        return function() {
            return randomIrwinHall() / n;
        };
    }
    randomBates.source = sourceRandomBates;
    return randomBates;
})(defaultSource);
(function sourceRandomExponential(source) {
    function randomExponential(lambda) {
        return function() {
            return -Math.log(1 - source()) / lambda;
        };
    }
    randomExponential.source = sourceRandomExponential;
    return randomExponential;
})(defaultSource);
var t01 = new Date(), t11 = new Date();
function newInterval(floori, offseti, count1, field) {
    function interval1(date2) {
        return floori(date2 = arguments.length === 0 ? new Date() : new Date(+date2)), date2;
    }
    interval1.floor = function(date3) {
        return floori(date3 = new Date(+date3)), date3;
    };
    interval1.ceil = function(date4) {
        return floori(date4 = new Date(date4 - 1)), offseti(date4, 1), floori(date4), date4;
    };
    interval1.round = function(date5) {
        var d0 = interval1(date5), d1 = interval1.ceil(date5);
        return date5 - d0 < d1 - date5 ? d0 : d1;
    };
    interval1.offset = function(date6, step) {
        return offseti(date6 = new Date(+date6), step == null ? 1 : Math.floor(step)), date6;
    };
    interval1.range = function(start8, stop, step) {
        var range1 = [], previous;
        start8 = interval1.ceil(start8);
        step = step == null ? 1 : Math.floor(step);
        if (!(start8 < stop) || !(step > 0)) return range1;
        do range1.push(previous = new Date(+start8)), offseti(start8, step), floori(start8);
        while (previous < start8 && start8 < stop)
        return range1;
    };
    interval1.filter = function(test) {
        return newInterval(function(date7) {
            if (date7 >= date7) while(floori(date7), !test(date7))date7.setTime(date7 - 1);
        }, function(date8, step) {
            if (date8 >= date8) {
                if (step < 0) while(++step <= 0){
                    while(offseti(date8, -1), !test(date8)){}
                }
                else while(--step >= 0){
                    while(offseti(date8, 1), !test(date8)){}
                }
            }
        });
    };
    if (count1) {
        interval1.count = function(start9, end) {
            t01.setTime(+start9), t11.setTime(+end);
            floori(t01), floori(t11);
            return Math.floor(count1(t01, t11));
        };
        interval1.every = function(step) {
            step = Math.floor(step);
            return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval1 : interval1.filter(field ? function(d) {
                return field(d) % step === 0;
            } : function(d) {
                return interval1.count(0, d) % step === 0;
            });
        };
    }
    return interval1;
}
var millisecond = newInterval(function() {}, function(date9, step) {
    date9.setTime(+date9 + step);
}, function(start10, end) {
    return end - start10;
});
millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date10) {
        date10.setTime(Math.floor(date10 / k) * k);
    }, function(date11, step) {
        date11.setTime(+date11 + step * k);
    }, function(start11, end) {
        return (end - start11) / k;
    });
};
millisecond.range;
var durationSecond = 1000;
var durationMinute = 60000;
var durationHour = 3600000;
var durationDay = 86400000;
var durationWeek = 604800000;
var second = newInterval(function(date12) {
    date12.setTime(date12 - date12.getMilliseconds());
}, function(date13, step) {
    date13.setTime(+date13 + step * durationSecond);
}, function(start12, end) {
    return (end - start12) / durationSecond;
}, function(date14) {
    return date14.getUTCSeconds();
});
second.range;
var minute = newInterval(function(date15) {
    date15.setTime(date15 - date15.getMilliseconds() - date15.getSeconds() * durationSecond);
}, function(date16, step) {
    date16.setTime(+date16 + step * durationMinute);
}, function(start13, end) {
    return (end - start13) / durationMinute;
}, function(date17) {
    return date17.getMinutes();
});
minute.range;
var hour = newInterval(function(date18) {
    date18.setTime(date18 - date18.getMilliseconds() - date18.getSeconds() * durationSecond - date18.getMinutes() * durationMinute);
}, function(date19, step) {
    date19.setTime(+date19 + step * durationHour);
}, function(start14, end) {
    return (end - start14) / durationHour;
}, function(date20) {
    return date20.getHours();
});
hour.range;
var day = newInterval(function(date21) {
    date21.setHours(0, 0, 0, 0);
}, function(date22, step) {
    date22.setDate(date22.getDate() + step);
}, function(start15, end) {
    return (end - start15 - (end.getTimezoneOffset() - start15.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date23) {
    return date23.getDate() - 1;
});
day.range;
function weekday(i) {
    return newInterval(function(date24) {
        date24.setDate(date24.getDate() - (date24.getDay() + 7 - i) % 7);
        date24.setHours(0, 0, 0, 0);
    }, function(date25, step) {
        date25.setDate(date25.getDate() + step * 7);
    }, function(start16, end) {
        return (end - start16 - (end.getTimezoneOffset() - start16.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);
sunday.range;
monday.range;
tuesday.range;
wednesday.range;
thursday.range;
friday.range;
saturday.range;
var month = newInterval(function(date26) {
    date26.setDate(1);
    date26.setHours(0, 0, 0, 0);
}, function(date27, step) {
    date27.setMonth(date27.getMonth() + step);
}, function(start17, end) {
    return end.getMonth() - start17.getMonth() + (end.getFullYear() - start17.getFullYear()) * 12;
}, function(date28) {
    return date28.getMonth();
});
month.range;
var year = newInterval(function(date29) {
    date29.setMonth(0, 1);
    date29.setHours(0, 0, 0, 0);
}, function(date30, step) {
    date30.setFullYear(date30.getFullYear() + step);
}, function(start18, end) {
    return end.getFullYear() - start18.getFullYear();
}, function(date31) {
    return date31.getFullYear();
});
year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date32) {
        date32.setFullYear(Math.floor(date32.getFullYear() / k) * k);
        date32.setMonth(0, 1);
        date32.setHours(0, 0, 0, 0);
    }, function(date33, step) {
        date33.setFullYear(date33.getFullYear() + step * k);
    });
};
year.range;
var utcMinute = newInterval(function(date34) {
    date34.setUTCSeconds(0, 0);
}, function(date35, step) {
    date35.setTime(+date35 + step * durationMinute);
}, function(start19, end) {
    return (end - start19) / durationMinute;
}, function(date36) {
    return date36.getUTCMinutes();
});
utcMinute.range;
var utcHour = newInterval(function(date37) {
    date37.setUTCMinutes(0, 0, 0);
}, function(date38, step) {
    date38.setTime(+date38 + step * durationHour);
}, function(start20, end) {
    return (end - start20) / durationHour;
}, function(date39) {
    return date39.getUTCHours();
});
utcHour.range;
var utcDay = newInterval(function(date40) {
    date40.setUTCHours(0, 0, 0, 0);
}, function(date41, step) {
    date41.setUTCDate(date41.getUTCDate() + step);
}, function(start21, end) {
    return (end - start21) / durationDay;
}, function(date42) {
    return date42.getUTCDate() - 1;
});
utcDay.range;
function utcWeekday(i) {
    return newInterval(function(date43) {
        date43.setUTCDate(date43.getUTCDate() - (date43.getUTCDay() + 7 - i) % 7);
        date43.setUTCHours(0, 0, 0, 0);
    }, function(date44, step) {
        date44.setUTCDate(date44.getUTCDate() + step * 7);
    }, function(start22, end) {
        return (end - start22) / durationWeek;
    });
}
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
utcSunday.range;
utcMonday.range;
utcTuesday.range;
utcWednesday.range;
utcThursday.range;
utcFriday.range;
utcSaturday.range;
var utcMonth = newInterval(function(date45) {
    date45.setUTCDate(1);
    date45.setUTCHours(0, 0, 0, 0);
}, function(date46, step) {
    date46.setUTCMonth(date46.getUTCMonth() + step);
}, function(start23, end) {
    return end.getUTCMonth() - start23.getUTCMonth() + (end.getUTCFullYear() - start23.getUTCFullYear()) * 12;
}, function(date47) {
    return date47.getUTCMonth();
});
utcMonth.range;
var utcYear = newInterval(function(date48) {
    date48.setUTCMonth(0, 1);
    date48.setUTCHours(0, 0, 0, 0);
}, function(date49, step) {
    date49.setUTCFullYear(date49.getUTCFullYear() + step);
}, function(start24, end) {
    return end.getUTCFullYear() - start24.getUTCFullYear();
}, function(date50) {
    return date50.getUTCFullYear();
});
utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date51) {
        date51.setUTCFullYear(Math.floor(date51.getUTCFullYear() / k) * k);
        date51.setUTCMonth(0, 1);
        date51.setUTCHours(0, 0, 0, 0);
    }, function(date52, step) {
        date52.setUTCFullYear(date52.getUTCFullYear() + step * k);
    });
};
utcYear.range;
function localDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date53 = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date53.setFullYear(d.y);
        return date53;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date54 = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date54.setUTCFullYear(d.y);
        return date54;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate(y, m, d) {
    return {
        y,
        m,
        d,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
function formatLocale1(locale2) {
    var locale_dateTime = locale2.dateTime, locale_date = locale2.date, locale_time = locale2.time, locale_periods = locale2.periods, locale_weekdays = locale2.days, locale_shortWeekdays = locale2.shortDays, locale_months = locale2.months, locale_shortMonths = locale2.shortMonths;
    var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
    var formats = {
        a: formatShortWeekday,
        A: formatWeekday,
        b: formatShortMonth,
        B: formatMonth,
        c: null,
        d: formatDayOfMonth,
        e: formatDayOfMonth,
        f: formatMicroseconds,
        g: formatYearISO,
        G: formatFullYearISO,
        H: formatHour24,
        I: formatHour12,
        j: formatDayOfYear,
        L: formatMilliseconds,
        m: formatMonthNumber,
        M: formatMinutes,
        p: formatPeriod,
        q: formatQuarter,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatSeconds,
        u: formatWeekdayNumberMonday,
        U: formatWeekNumberSunday,
        V: formatWeekNumberISO,
        w: formatWeekdayNumberSunday,
        W: formatWeekNumberMonday,
        x: null,
        X: null,
        y: formatYear1,
        Y: formatFullYear,
        Z: formatZone,
        "%": formatLiteralPercent
    };
    var utcFormats = {
        a: formatUTCShortWeekday,
        A: formatUTCWeekday,
        b: formatUTCShortMonth,
        B: formatUTCMonth,
        c: null,
        d: formatUTCDayOfMonth,
        e: formatUTCDayOfMonth,
        f: formatUTCMicroseconds,
        g: formatUTCYearISO,
        G: formatUTCFullYearISO,
        H: formatUTCHour24,
        I: formatUTCHour12,
        j: formatUTCDayOfYear,
        L: formatUTCMilliseconds,
        m: formatUTCMonthNumber,
        M: formatUTCMinutes,
        p: formatUTCPeriod,
        q: formatUTCQuarter,
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatUTCSeconds,
        u: formatUTCWeekdayNumberMonday,
        U: formatUTCWeekNumberSunday,
        V: formatUTCWeekNumberISO,
        w: formatUTCWeekdayNumberSunday,
        W: formatUTCWeekNumberMonday,
        x: null,
        X: null,
        y: formatUTCYear,
        Y: formatUTCFullYear,
        Z: formatUTCZone,
        "%": formatLiteralPercent
    };
    var parses = {
        a: parseShortWeekday,
        A: parseWeekday,
        b: parseShortMonth,
        B: parseMonth,
        c: parseLocaleDateTime,
        d: parseDayOfMonth,
        e: parseDayOfMonth,
        f: parseMicroseconds,
        g: parseYear,
        G: parseFullYear,
        H: parseHour24,
        I: parseHour24,
        j: parseDayOfYear,
        L: parseMilliseconds,
        m: parseMonthNumber,
        M: parseMinutes,
        p: parsePeriod,
        q: parseQuarter,
        Q: parseUnixTimestamp,
        s: parseUnixTimestampSeconds,
        S: parseSeconds,
        u: parseWeekdayNumberMonday,
        U: parseWeekNumberSunday,
        V: parseWeekNumberISO,
        w: parseWeekdayNumberSunday,
        W: parseWeekNumberMonday,
        x: parseLocaleDate,
        X: parseLocaleTime,
        y: parseYear,
        Y: parseFullYear,
        Z: parseZone,
        "%": parseLiteralPercent
    };
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);
    function newFormat(specifier, formats2) {
        return function(date55) {
            var string2 = [], i = -1, j = 0, n = specifier.length, c, pad2, format3;
            if (!(date55 instanceof Date)) date55 = new Date(+date55);
            while(++i < n){
                if (specifier.charCodeAt(i) === 37) {
                    string2.push(specifier.slice(j, i));
                    if ((pad2 = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
                    else pad2 = c === "e" ? " " : "0";
                    if (format3 = formats2[c]) c = format3(date55, pad2);
                    string2.push(c);
                    j = i + 1;
                }
            }
            string2.push(specifier.slice(j, i));
            return string2.join("");
        };
    }
    function newParse(specifier, Z) {
        return function(string3) {
            var d = newDate(1900, void 0, 1), i = parseSpecifier(d, specifier, string3 += "", 0), week, day1;
            if (i != string3.length) return null;
            if ("Q" in d) return new Date(d.Q);
            if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));
            if (Z && !("Z" in d)) d.Z = 0;
            if ("p" in d) d.H = d.H % 12 + d.p * 12;
            if (d.m === void 0) d.m = "q" in d ? d.q : 0;
            if ("V" in d) {
                if (d.V < 1 || d.V > 53) return null;
                if (!("w" in d)) d.w = 1;
                if ("Z" in d) {
                    week = utcDate(newDate(d.y, 0, 1)), day1 = week.getUTCDay();
                    week = day1 > 4 || day1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
                    week = utcDay.offset(week, (d.V - 1) * 7);
                    d.y = week.getUTCFullYear();
                    d.m = week.getUTCMonth();
                    d.d = week.getUTCDate() + (d.w + 6) % 7;
                } else {
                    week = localDate(newDate(d.y, 0, 1)), day1 = week.getDay();
                    week = day1 > 4 || day1 === 0 ? monday.ceil(week) : monday(week);
                    week = day.offset(week, (d.V - 1) * 7);
                    d.y = week.getFullYear();
                    d.m = week.getMonth();
                    d.d = week.getDate() + (d.w + 6) % 7;
                }
            } else if ("W" in d || "U" in d) {
                if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
                day1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
                d.m = 0;
                d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day1 + 5) % 7 : d.w + d.U * 7 - (day1 + 6) % 7;
            }
            if ("Z" in d) {
                d.H += d.Z / 100 | 0;
                d.M += d.Z % 100;
                return utcDate(d);
            }
            return localDate(d);
        };
    }
    function parseSpecifier(d, specifier, string4, j) {
        var i = 0, n = specifier.length, m = string4.length, c, parse;
        while(i < n){
            if (j >= m) return -1;
            c = specifier.charCodeAt(i++);
            if (c === 37) {
                c = specifier.charAt(i++);
                parse = parses[c in pads ? specifier.charAt(i++) : c];
                if (!parse || (j = parse(d, string4, j)) < 0) return -1;
            } else if (c != string4.charCodeAt(j++)) {
                return -1;
            }
        }
        return j;
    }
    function parsePeriod(d, string5, i) {
        var n = periodRe.exec(string5.slice(i));
        return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseShortWeekday(d, string6, i) {
        var n = shortWeekdayRe.exec(string6.slice(i));
        return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseWeekday(d, string7, i) {
        var n = weekdayRe.exec(string7.slice(i));
        return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseShortMonth(d, string8, i) {
        var n = shortMonthRe.exec(string8.slice(i));
        return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseMonth(d, string9, i) {
        var n = monthRe.exec(string9.slice(i));
        return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseLocaleDateTime(d, string10, i) {
        return parseSpecifier(d, locale_dateTime, string10, i);
    }
    function parseLocaleDate(d, string11, i) {
        return parseSpecifier(d, locale_date, string11, i);
    }
    function parseLocaleTime(d, string12, i) {
        return parseSpecifier(d, locale_time, string12, i);
    }
    function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
    }
    function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
    }
    function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
    }
    function formatMonth(d) {
        return locale_months[d.getMonth()];
    }
    function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
    }
    function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
    }
    function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
    }
    function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
    }
    function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
    }
    function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
    }
    function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
    }
    function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
    }
    return {
        format: function(specifier) {
            var f = newFormat(specifier += "", formats);
            f.toString = function() {
                return specifier;
            };
            return f;
        },
        parse: function(specifier) {
            var p = newParse(specifier += "", false);
            p.toString = function() {
                return specifier;
            };
            return p;
        },
        utcFormat: function(specifier) {
            var f = newFormat(specifier += "", utcFormats);
            f.toString = function() {
                return specifier;
            };
            return f;
        },
        utcParse: function(specifier) {
            var p = newParse(specifier += "", true);
            p.toString = function() {
                return specifier;
            };
            return p;
        }
    };
}
var pads = {
    "-": "",
    _: " ",
    "0": "0"
}, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad1(value66, fill, width) {
    var sign3 = value66 < 0 ? "-" : "", string13 = (sign3 ? -value66 : value66) + "", length4 = string13.length;
    return sign3 + (length4 < width ? new Array(width - length4 + 1).join(fill) + string13 : string13);
}
function requote(s) {
    return s.replace(requoteRe, "\\$&");
}
function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
    var map2 = {}, i = -1, n = names.length;
    while(++i < n)map2[names[i].toLowerCase()] = i;
    return map2;
}
function parseWeekdayNumberSunday(d, string14, i) {
    var n = numberRe.exec(string14.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
}
function parseWeekdayNumberMonday(d, string15, i) {
    var n = numberRe.exec(string15.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberSunday(d, string16, i) {
    var n = numberRe.exec(string16.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberISO(d, string17, i) {
    var n = numberRe.exec(string17.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberMonday(d, string18, i) {
    var n = numberRe.exec(string18.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
}
function parseFullYear(d, string19, i) {
    var n = numberRe.exec(string19.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
}
function parseYear(d, string20, i) {
    var n = numberRe.exec(string20.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}
function parseZone(d, string21, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string21.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}
function parseQuarter(d, string22, i) {
    var n = numberRe.exec(string22.slice(i, i + 1));
    return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}
function parseMonthNumber(d, string23, i) {
    var n = numberRe.exec(string23.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}
function parseDayOfMonth(d, string24, i) {
    var n = numberRe.exec(string24.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
}
function parseDayOfYear(d, string25, i) {
    var n = numberRe.exec(string25.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}
function parseHour24(d, string26, i) {
    var n = numberRe.exec(string26.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
}
function parseMinutes(d, string27, i) {
    var n = numberRe.exec(string27.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
}
function parseSeconds(d, string28, i) {
    var n = numberRe.exec(string28.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
}
function parseMilliseconds(d, string29, i) {
    var n = numberRe.exec(string29.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
}
function parseMicroseconds(d, string30, i) {
    var n = numberRe.exec(string30.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}
function parseLiteralPercent(d, string31, i) {
    var n = percentRe.exec(string31.slice(i, i + 1));
    return n ? i + n[0].length : -1;
}
function parseUnixTimestamp(d, string32, i) {
    var n = numberRe.exec(string32.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
}
function parseUnixTimestampSeconds(d, string33, i) {
    var n = numberRe.exec(string33.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
}
function formatDayOfMonth(d, p) {
    return pad1(d.getDate(), p, 2);
}
function formatHour24(d, p) {
    return pad1(d.getHours(), p, 2);
}
function formatHour12(d, p) {
    return pad1(d.getHours() % 12 || 12, p, 2);
}
function formatDayOfYear(d, p) {
    return pad1(1 + day.count(year(d), d), p, 3);
}
function formatMilliseconds(d, p) {
    return pad1(d.getMilliseconds(), p, 3);
}
function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
}
function formatMonthNumber(d, p) {
    return pad1(d.getMonth() + 1, p, 2);
}
function formatMinutes(d, p) {
    return pad1(d.getMinutes(), p, 2);
}
function formatSeconds(d, p) {
    return pad1(d.getSeconds(), p, 2);
}
function formatWeekdayNumberMonday(d) {
    var day2 = d.getDay();
    return day2 === 0 ? 7 : day2;
}
function formatWeekNumberSunday(d, p) {
    return pad1(sunday.count(year(d) - 1, d), p, 2);
}
function dISO(d) {
    var day3 = d.getDay();
    return day3 >= 4 || day3 === 0 ? thursday(d) : thursday.ceil(d);
}
function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad1(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}
function formatWeekdayNumberSunday(d) {
    return d.getDay();
}
function formatWeekNumberMonday(d, p) {
    return pad1(monday.count(year(d) - 1, d), p, 2);
}
function formatYear1(d, p) {
    return pad1(d.getFullYear() % 100, p, 2);
}
function formatYearISO(d, p) {
    d = dISO(d);
    return pad1(d.getFullYear() % 100, p, 2);
}
function formatFullYear(d, p) {
    return pad1(d.getFullYear() % 10000, p, 4);
}
function formatFullYearISO(d, p) {
    var day4 = d.getDay();
    d = day4 >= 4 || day4 === 0 ? thursday(d) : thursday.ceil(d);
    return pad1(d.getFullYear() % 10000, p, 4);
}
function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+")) + pad1(z / 60 | 0, "0", 2) + pad1(z % 60, "0", 2);
}
function formatUTCDayOfMonth(d, p) {
    return pad1(d.getUTCDate(), p, 2);
}
function formatUTCHour24(d, p) {
    return pad1(d.getUTCHours(), p, 2);
}
function formatUTCHour12(d, p) {
    return pad1(d.getUTCHours() % 12 || 12, p, 2);
}
function formatUTCDayOfYear(d, p) {
    return pad1(1 + utcDay.count(utcYear(d), d), p, 3);
}
function formatUTCMilliseconds(d, p) {
    return pad1(d.getUTCMilliseconds(), p, 3);
}
function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
}
function formatUTCMonthNumber(d, p) {
    return pad1(d.getUTCMonth() + 1, p, 2);
}
function formatUTCMinutes(d, p) {
    return pad1(d.getUTCMinutes(), p, 2);
}
function formatUTCSeconds(d, p) {
    return pad1(d.getUTCSeconds(), p, 2);
}
function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday(d, p) {
    return pad1(utcSunday.count(utcYear(d) - 1, d), p, 2);
}
function UTCdISO(d) {
    var day5 = d.getUTCDay();
    return day5 >= 4 || day5 === 0 ? utcThursday(d) : utcThursday.ceil(d);
}
function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad1(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}
function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
}
function formatUTCWeekNumberMonday(d, p) {
    return pad1(utcMonday.count(utcYear(d) - 1, d), p, 2);
}
function formatUTCYear(d, p) {
    return pad1(d.getUTCFullYear() % 100, p, 2);
}
function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad1(d.getUTCFullYear() % 100, p, 2);
}
function formatUTCFullYear(d, p) {
    return pad1(d.getUTCFullYear() % 10000, p, 4);
}
function formatUTCFullYearISO(d, p) {
    var day6 = d.getUTCDay();
    d = day6 >= 4 || day6 === 0 ? utcThursday(d) : utcThursday.ceil(d);
    return pad1(d.getUTCFullYear() % 10000, p, 4);
}
function formatUTCZone() {
    return "+0000";
}
function formatLiteralPercent() {
    return "%";
}
function formatUnixTimestamp(d) {
    return +d;
}
function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
}
var locale1;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: [
        "AM",
        "PM"
    ],
    days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    shortDays: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    shortMonths: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
});
function defaultLocale1(definition) {
    locale1 = formatLocale1(definition);
    timeFormat = locale1.format;
    timeParse = locale1.parse;
    utcFormat = locale1.utcFormat;
    utcParse = locale1.utcParse;
    return locale1;
}
var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
function formatIsoNative(date56) {
    return date56.toISOString();
}
Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);
function parseIsoNative(string34) {
    var date57 = new Date(string34);
    return isNaN(date57) ? null : date57;
}
+new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);
var array2 = Array.prototype;
array2.map;
array2.slice;
function colors(specifier) {
    var n = specifier.length / 6 | 0, colors2 = new Array(n), i = 0;
    while(i < n)colors2[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors2;
}
colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");
colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");
colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");
colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");
colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");
colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");
colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");
colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");
var Tableau10 = colors("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
function ramp(scheme2) {
    return rgbBasis(scheme2[scheme2.length - 1]);
}
var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors);
ramp(scheme);
var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors);
ramp(scheme$1);
var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors);
ramp(scheme$2);
var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors);
ramp(scheme$3);
var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors);
ramp(scheme$4);
var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors);
ramp(scheme$5);
var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors);
ramp(scheme$6);
var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors);
ramp(scheme$7);
var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors);
ramp(scheme$8);
var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors);
ramp(scheme$9);
var scheme$a = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors);
ramp(scheme$a);
var scheme$b = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors);
ramp(scheme$b);
var scheme$c = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors);
ramp(scheme$c);
var scheme$d = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors);
ramp(scheme$d);
var scheme$e = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors);
ramp(scheme$e);
var scheme$f = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors);
ramp(scheme$f);
var scheme$g = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors);
ramp(scheme$g);
var scheme$h = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors);
ramp(scheme$h);
var scheme$i = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors);
ramp(scheme$i);
var scheme$j = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors);
ramp(scheme$j);
var scheme$k = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors);
ramp(scheme$k);
var scheme$l = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors);
ramp(scheme$l);
var scheme$m = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors);
ramp(scheme$m);
var scheme$n = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors);
ramp(scheme$n);
var scheme$o = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors);
ramp(scheme$o);
var scheme$p = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors);
ramp(scheme$p);
var scheme$q = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors);
ramp(scheme$q);
cubehelixLong(cubehelix(300, 0.5, 0), cubehelix(-240, 0.5, 1));
cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
cubehelix();
rgb();
function ramp$1(range2) {
    var n = range2.length;
    return function(t) {
        return range2[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
}
ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
var epsilon3 = 0.000000000001;
function Linear(context) {
    this._context = context;
}
Linear.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
            default:
                this._context.lineTo(x2, y2);
                break;
        }
    }
};
function curveLinear(context) {
    return new Linear(context);
}
curveRadial(curveLinear);
function Radial(curve) {
    this._curve = curve;
}
Radial.prototype = {
    areaStart: function() {
        this._curve.areaStart();
    },
    areaEnd: function() {
        this._curve.areaEnd();
    },
    lineStart: function() {
        this._curve.lineStart();
    },
    lineEnd: function() {
        this._curve.lineEnd();
    },
    point: function(a2, r) {
        this._curve.point(r * Math.sin(a2), r * -Math.cos(a2));
    }
};
function curveRadial(curve) {
    function radial(context) {
        return new Radial(curve(context));
    }
    radial._curve = curve;
    return radial;
}
Array.prototype.slice;
function noop2() {}
function point(that, x2, y2) {
    that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x2) / 6, (that._y0 + 4 * that._y1 + y2) / 6);
}
function Basis(context) {
    this._context = context;
}
Basis.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 3:
                point(this, this._x1, this._y1);
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
            default:
                point(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = x2;
        this._y0 = this._y1, this._y1 = y2;
    }
};
function BasisClosed(context) {
    this._context = context;
}
BasisClosed.prototype = {
    areaStart: noop2,
    areaEnd: noop2,
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x2, this._y2);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
                    this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x2, this._y2);
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    break;
                }
        }
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._x2 = x2, this._y2 = y2;
                break;
            case 1:
                this._point = 2;
                this._x3 = x2, this._y3 = y2;
                break;
            case 2:
                this._point = 3;
                this._x4 = x2, this._y4 = y2;
                this._context.moveTo((this._x0 + 4 * this._x1 + x2) / 6, (this._y0 + 4 * this._y1 + y2) / 6);
                break;
            default:
                point(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = x2;
        this._y0 = this._y1, this._y1 = y2;
    }
};
function BasisOpen(context) {
    this._context = context;
}
BasisOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                var x018 = (this._x0 + 4 * this._x1 + x2) / 6, y018 = (this._y0 + 4 * this._y1 + y2) / 6;
                this._line ? this._context.lineTo(x018, y018) : this._context.moveTo(x018, y018);
                break;
            case 3:
                this._point = 4;
            default:
                point(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = x2;
        this._y0 = this._y1, this._y1 = y2;
    }
};
function Bundle(context, beta) {
    this._basis = new Basis(context);
    this._beta = beta;
}
Bundle.prototype = {
    lineStart: function() {
        this._x = [];
        this._y = [];
        this._basis.lineStart();
    },
    lineEnd: function() {
        var x2 = this._x, y2 = this._y, j = x2.length - 1;
        if (j > 0) {
            var x019 = x2[0], y019 = y2[0], dx = x2[j] - x019, dy = y2[j] - y019, i = -1, t;
            while(++i <= j){
                t = i / j;
                this._basis.point(this._beta * x2[i] + (1 - this._beta) * (x019 + t * dx), this._beta * y2[i] + (1 - this._beta) * (y019 + t * dy));
            }
        }
        this._x = this._y = null;
        this._basis.lineEnd();
    },
    point: function(x2, y2) {
        this._x.push(+x2);
        this._y.push(+y2);
    }
};
(function custom(beta) {
    function bundle2(context) {
        return beta === 1 ? new Basis(context) : new Bundle(context, beta);
    }
    bundle2.beta = function(beta2) {
        return custom(+beta2);
    };
    return bundle2;
})(0.85);
function point$1(that, x2, y2) {
    that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x2), that._y2 + that._k * (that._y1 - y2), that._x2, that._y2);
}
function Cardinal(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
Cardinal.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x2, this._y2);
                break;
            case 3:
                point$1(this, this._x1, this._y1);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
                this._x1 = x2, this._y1 = y2;
                break;
            case 2:
                this._point = 3;
            default:
                point$1(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom2(tension) {
    function cardinal2(context) {
        return new Cardinal(context, tension);
    }
    cardinal2.tension = function(tension2) {
        return custom2(+tension2);
    };
    return cardinal2;
})(0);
function CardinalClosed(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
CardinalClosed.prototype = {
    areaStart: noop2,
    areaEnd: noop2,
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
        }
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._x3 = x2, this._y3 = y2;
                break;
            case 1:
                this._point = 2;
                this._context.moveTo(this._x4 = x2, this._y4 = y2);
                break;
            case 2:
                this._point = 3;
                this._x5 = x2, this._y5 = y2;
                break;
            default:
                point$1(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom3(tension) {
    function cardinal2(context) {
        return new CardinalClosed(context, tension);
    }
    cardinal2.tension = function(tension2) {
        return custom3(+tension2);
    };
    return cardinal2;
})(0);
function CardinalOpen(context, tension) {
    this._context = context;
    this._k = (1 - tension) / 6;
}
CardinalOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                break;
            case 3:
                this._point = 4;
            default:
                point$1(this, x2, y2);
                break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom4(tension) {
    function cardinal2(context) {
        return new CardinalOpen(context, tension);
    }
    cardinal2.tension = function(tension2) {
        return custom4(+tension2);
    };
    return cardinal2;
})(0);
function point$2(that, x2, y2) {
    var x1 = that._x1, y1 = that._y1, x22 = that._x2, y22 = that._y2;
    if (that._l01_a > epsilon3) {
        var a2 = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n = 3 * that._l01_a * (that._l01_a + that._l12_a);
        x1 = (x1 * a2 - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
        y1 = (y1 * a2 - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }
    if (that._l23_a > epsilon3) {
        var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m = 3 * that._l23_a * (that._l23_a + that._l12_a);
        x22 = (x22 * b + that._x1 * that._l23_2a - x2 * that._l12_2a) / m;
        y22 = (y22 * b + that._y1 * that._l23_2a - y2 * that._l12_2a) / m;
    }
    that._context.bezierCurveTo(x1, y1, x22, y22, that._x2, that._y2);
}
function CatmullRom(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRom.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x2, this._y2);
                break;
            case 3:
                this.point(this._x2, this._y2);
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        if (this._point) {
            var x23 = this._x2 - x2, y23 = this._y2 - y2;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
            default:
                point$2(this, x2, y2);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom5(alpha) {
    function catmullRom2(context) {
        return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
    }
    catmullRom2.alpha = function(alpha2) {
        return custom5(+alpha2);
    };
    return catmullRom2;
})(0.5);
function CatmullRomClosed(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRomClosed.prototype = {
    areaStart: noop2,
    areaEnd: noop2,
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 1:
                {
                    this._context.moveTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 2:
                {
                    this._context.lineTo(this._x3, this._y3);
                    this._context.closePath();
                    break;
                }
            case 3:
                {
                    this.point(this._x3, this._y3);
                    this.point(this._x4, this._y4);
                    this.point(this._x5, this._y5);
                    break;
                }
        }
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        if (this._point) {
            var x23 = this._x2 - x2, y23 = this._y2 - y2;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                this._x3 = x2, this._y3 = y2;
                break;
            case 1:
                this._point = 2;
                this._context.moveTo(this._x4 = x2, this._y4 = y2);
                break;
            case 2:
                this._point = 3;
                this._x5 = x2, this._y5 = y2;
                break;
            default:
                point$2(this, x2, y2);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom6(alpha) {
    function catmullRom2(context) {
        return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
    }
    catmullRom2.alpha = function(alpha2) {
        return custom6(+alpha2);
    };
    return catmullRom2;
})(0.5);
function CatmullRomOpen(context, alpha) {
    this._context = context;
    this._alpha = alpha;
}
CatmullRomOpen.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
    },
    lineEnd: function() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        if (this._point) {
            var x23 = this._x2 - x2, y23 = this._y2 - y2;
            this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }
        switch(this._point){
            case 0:
                this._point = 1;
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
                break;
            case 3:
                this._point = 4;
            default:
                point$2(this, x2, y2);
                break;
        }
        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
    }
};
(function custom7(alpha) {
    function catmullRom2(context) {
        return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
    }
    catmullRom2.alpha = function(alpha2) {
        return custom7(+alpha2);
    };
    return catmullRom2;
})(0.5);
function LinearClosed(context) {
    this._context = context;
}
LinearClosed.prototype = {
    areaStart: noop2,
    areaEnd: noop2,
    lineStart: function() {
        this._point = 0;
    },
    lineEnd: function() {
        if (this._point) this._context.closePath();
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        if (this._point) this._context.lineTo(x2, y2);
        else this._point = 1, this._context.moveTo(x2, y2);
    }
};
function sign1(x2) {
    return x2 < 0 ? -1 : 1;
}
function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign1(s0) + sign1(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}
function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}
function point$3(that, t06, t14) {
    var x020 = that._x0, y020 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x020) / 3;
    that._context.bezierCurveTo(x020 + dx, y020 + dx * t06, x1 - dx, y1 - dx * t14, x1, y1);
}
function MonotoneX(context) {
    this._context = context;
}
MonotoneX.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        switch(this._point){
            case 2:
                this._context.lineTo(this._x1, this._y1);
                break;
            case 3:
                point$3(this, this._t0, slope2(this, this._t0));
                break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        var t15 = NaN;
        x2 = +x2, y2 = +y2;
        if (x2 === this._x1 && y2 === this._y1) return;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
                break;
            case 2:
                this._point = 3;
                point$3(this, slope2(this, t15 = slope3(this, x2, y2)), t15);
                break;
            default:
                point$3(this, this._t0, t15 = slope3(this, x2, y2));
                break;
        }
        this._x0 = this._x1, this._x1 = x2;
        this._y0 = this._y1, this._y1 = y2;
        this._t0 = t15;
    }
};
function MonotoneY(context) {
    this._context = new ReflectContext(context);
}
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x2, y2) {
    MonotoneX.prototype.point.call(this, y2, x2);
};
function ReflectContext(context) {
    this._context = context;
}
ReflectContext.prototype = {
    moveTo: function(x2, y2) {
        this._context.moveTo(y2, x2);
    },
    closePath: function() {
        this._context.closePath();
    },
    lineTo: function(x2, y2) {
        this._context.lineTo(y2, x2);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
        this._context.bezierCurveTo(y1, x1, y2, x2, y3, x3);
    }
};
function Natural(context) {
    this._context = context;
}
Natural.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x = [];
        this._y = [];
    },
    lineEnd: function() {
        var x2 = this._x, y2 = this._y, n = x2.length;
        if (n) {
            this._line ? this._context.lineTo(x2[0], y2[0]) : this._context.moveTo(x2[0], y2[0]);
            if (n === 2) {
                this._context.lineTo(x2[1], y2[1]);
            } else {
                var px = controlPoints(x2), py = controlPoints(y2);
                for(var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1){
                    this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x2[i1], y2[i1]);
                }
            }
        }
        if (this._line || this._line !== 0 && n === 1) this._context.closePath();
        this._line = 1 - this._line;
        this._x = this._y = null;
    },
    point: function(x2, y2) {
        this._x.push(+x2);
        this._y.push(+y2);
    }
};
function controlPoints(x2) {
    var i, n = x2.length - 1, m, a2 = new Array(n), b = new Array(n), r = new Array(n);
    a2[0] = 0, b[0] = 2, r[0] = x2[0] + 2 * x2[1];
    for(i = 1; i < n - 1; ++i)a2[i] = 1, b[i] = 4, r[i] = 4 * x2[i] + 2 * x2[i + 1];
    a2[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x2[n - 1] + x2[n];
    for(i = 1; i < n; ++i)m = a2[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a2[n - 1] = r[n - 1] / b[n - 1];
    for(i = n - 2; i >= 0; --i)a2[i] = (r[i] - a2[i + 1]) / b[i];
    b[n - 1] = (x2[n] + a2[n - 1]) / 2;
    for(i = 0; i < n - 1; ++i)b[i] = 2 * x2[i + 1] - a2[i + 1];
    return [
        a2,
        b
    ];
}
function Step(context, t) {
    this._context = context;
    this._t = t;
}
Step.prototype = {
    areaStart: function() {
        this._line = 0;
    },
    areaEnd: function() {
        this._line = NaN;
    },
    lineStart: function() {
        this._x = this._y = NaN;
        this._point = 0;
    },
    lineEnd: function() {
        if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    },
    point: function(x2, y2) {
        x2 = +x2, y2 = +y2;
        switch(this._point){
            case 0:
                this._point = 1;
                this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
                break;
            case 1:
                this._point = 2;
            default:
                {
                    if (this._t <= 0) {
                        this._context.lineTo(this._x, y2);
                        this._context.lineTo(x2, y2);
                    } else {
                        var x1 = this._x * (1 - this._t) + x2 * this._t;
                        this._context.lineTo(x1, this._y);
                        this._context.lineTo(x1, y2);
                    }
                    break;
                }
        }
        this._x = x2, this._y = y2;
    }
};
function RedBlackTree() {
    this._ = null;
}
function RedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
}
RedBlackTree.prototype = {
    constructor: RedBlackTree,
    insert: function(after, node) {
        var parent, grandpa, uncle;
        if (after) {
            node.P = after;
            node.N = after.N;
            if (after.N) after.N.P = node;
            after.N = node;
            if (after.R) {
                after = after.R;
                while(after.L)after = after.L;
                after.L = node;
            } else {
                after.R = node;
            }
            parent = after;
        } else if (this._) {
            after = RedBlackFirst(this._);
            node.P = null;
            node.N = after;
            after.P = after.L = node;
            parent = after;
        } else {
            node.P = node.N = null;
            this._ = node;
            parent = null;
        }
        node.L = node.R = null;
        node.U = parent;
        node.C = true;
        after = node;
        while(parent && parent.C){
            grandpa = parent.U;
            if (parent === grandpa.L) {
                uncle = grandpa.R;
                if (uncle && uncle.C) {
                    parent.C = uncle.C = false;
                    grandpa.C = true;
                    after = grandpa;
                } else {
                    if (after === parent.R) {
                        RedBlackRotateLeft(this, parent);
                        after = parent;
                        parent = after.U;
                    }
                    parent.C = false;
                    grandpa.C = true;
                    RedBlackRotateRight(this, grandpa);
                }
            } else {
                uncle = grandpa.L;
                if (uncle && uncle.C) {
                    parent.C = uncle.C = false;
                    grandpa.C = true;
                    after = grandpa;
                } else {
                    if (after === parent.L) {
                        RedBlackRotateRight(this, parent);
                        after = parent;
                        parent = after.U;
                    }
                    parent.C = false;
                    grandpa.C = true;
                    RedBlackRotateLeft(this, grandpa);
                }
            }
            parent = after.U;
        }
        this._.C = false;
    },
    remove: function(node) {
        if (node.N) node.N.P = node.P;
        if (node.P) node.P.N = node.N;
        node.N = node.P = null;
        var parent = node.U, sibling, left = node.L, right = node.R, next, red;
        if (!left) next = right;
        else if (!right) next = left;
        else next = RedBlackFirst(right);
        if (parent) {
            if (parent.L === node) parent.L = next;
            else parent.R = next;
        } else {
            this._ = next;
        }
        if (left && right) {
            red = next.C;
            next.C = node.C;
            next.L = left;
            left.U = next;
            if (next !== right) {
                parent = next.U;
                next.U = node.U;
                node = next.R;
                parent.L = node;
                next.R = right;
                right.U = next;
            } else {
                next.U = parent;
                parent = next;
                node = next.R;
            }
        } else {
            red = node.C;
            node = next;
        }
        if (node) node.U = parent;
        if (red) return;
        if (node && node.C) {
            node.C = false;
            return;
        }
        do {
            if (node === this._) break;
            if (node === parent.L) {
                sibling = parent.R;
                if (sibling.C) {
                    sibling.C = false;
                    parent.C = true;
                    RedBlackRotateLeft(this, parent);
                    sibling = parent.R;
                }
                if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                    if (!sibling.R || !sibling.R.C) {
                        sibling.L.C = false;
                        sibling.C = true;
                        RedBlackRotateRight(this, sibling);
                        sibling = parent.R;
                    }
                    sibling.C = parent.C;
                    parent.C = sibling.R.C = false;
                    RedBlackRotateLeft(this, parent);
                    node = this._;
                    break;
                }
            } else {
                sibling = parent.L;
                if (sibling.C) {
                    sibling.C = false;
                    parent.C = true;
                    RedBlackRotateRight(this, parent);
                    sibling = parent.L;
                }
                if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                    if (!sibling.L || !sibling.L.C) {
                        sibling.R.C = false;
                        sibling.C = true;
                        RedBlackRotateLeft(this, sibling);
                        sibling = parent.L;
                    }
                    sibling.C = parent.C;
                    parent.C = sibling.L.C = false;
                    RedBlackRotateRight(this, parent);
                    node = this._;
                    break;
                }
            }
            sibling.C = true;
            node = parent;
            parent = parent.U;
        }while (!node.C)
        if (node) node.C = false;
    }
};
function RedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
        if (parent.L === p) parent.L = q;
        else parent.R = q;
    } else {
        tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
}
function RedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
        if (parent.L === p) parent.L = q;
        else parent.R = q;
    } else {
        tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
}
function RedBlackFirst(node) {
    while(node.L)node = node.L;
    return node;
}
function createEdge(left, right, v0, v1) {
    var edge = [
        null,
        null
    ], index = edges.push(edge) - 1;
    edge.left = left;
    edge.right = right;
    if (v0) setEdgeEnd(edge, left, right, v0);
    if (v1) setEdgeEnd(edge, right, left, v1);
    cells[left.index].halfedges.push(index);
    cells[right.index].halfedges.push(index);
    return edge;
}
function createBorderEdge(left, v0, v1) {
    var edge = [
        v0,
        v1
    ];
    edge.left = left;
    return edge;
}
function setEdgeEnd(edge, left, right, vertex) {
    if (!edge[0] && !edge[1]) {
        edge[0] = vertex;
        edge.left = left;
        edge.right = right;
    } else if (edge.left === right) {
        edge[1] = vertex;
    } else {
        edge[0] = vertex;
    }
}
function clipEdge(edge, x021, y021, x1, y1) {
    var a = edge[0], b = edge[1], ax = a[0], ay = a[1], bx = b[0], by = b[1], t07 = 0, t16 = 1, dx = bx - ax, dy = by - ay, r;
    r = x021 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) {
        if (r < t07) return;
        if (r < t16) t16 = r;
    } else if (dx > 0) {
        if (r > t16) return;
        if (r > t07) t07 = r;
    }
    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) {
        if (r > t16) return;
        if (r > t07) t07 = r;
    } else if (dx > 0) {
        if (r < t07) return;
        if (r < t16) t16 = r;
    }
    r = y021 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) {
        if (r < t07) return;
        if (r < t16) t16 = r;
    } else if (dy > 0) {
        if (r > t16) return;
        if (r > t07) t07 = r;
    }
    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) {
        if (r > t16) return;
        if (r > t07) t07 = r;
    } else if (dy > 0) {
        if (r < t07) return;
        if (r < t16) t16 = r;
    }
    if (!(t07 > 0) && !(t16 < 1)) return true;
    if (t07 > 0) edge[0] = [
        ax + t07 * dx,
        ay + t07 * dy
    ];
    if (t16 < 1) edge[1] = [
        ax + t16 * dx,
        ay + t16 * dy
    ];
    return true;
}
function connectEdge(edge, x022, y022, x1, y1) {
    var v1 = edge[1];
    if (v1) return true;
    var v0 = edge[0], left = edge.left, right = edge.right, lx = left[0], ly = left[1], rx = right[0], ry = right[1], fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
        if (fx < x022 || fx >= x1) return;
        if (lx > rx) {
            if (!v0) v0 = [
                fx,
                y022
            ];
            else if (v0[1] >= y1) return;
            v1 = [
                fx,
                y1
            ];
        } else {
            if (!v0) v0 = [
                fx,
                y1
            ];
            else if (v0[1] < y022) return;
            v1 = [
                fx,
                y022
            ];
        }
    } else {
        fm = (lx - rx) / (ry - ly);
        fb = fy - fm * fx;
        if (fm < -1 || fm > 1) {
            if (lx > rx) {
                if (!v0) v0 = [
                    (y022 - fb) / fm,
                    y022
                ];
                else if (v0[1] >= y1) return;
                v1 = [
                    (y1 - fb) / fm,
                    y1
                ];
            } else {
                if (!v0) v0 = [
                    (y1 - fb) / fm,
                    y1
                ];
                else if (v0[1] < y022) return;
                v1 = [
                    (y022 - fb) / fm,
                    y022
                ];
            }
        } else {
            if (ly < ry) {
                if (!v0) v0 = [
                    x022,
                    fm * x022 + fb
                ];
                else if (v0[0] >= x1) return;
                v1 = [
                    x1,
                    fm * x1 + fb
                ];
            } else {
                if (!v0) v0 = [
                    x1,
                    fm * x1 + fb
                ];
                else if (v0[0] < x022) return;
                v1 = [
                    x022,
                    fm * x022 + fb
                ];
            }
        }
    }
    edge[0] = v0;
    edge[1] = v1;
    return true;
}
function clipEdges(x023, y023, x1, y1) {
    var i = edges.length, edge;
    while(i--){
        if (!connectEdge(edge = edges[i], x023, y023, x1, y1) || !clipEdge(edge, x023, y023, x1, y1) || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon4 || Math.abs(edge[0][1] - edge[1][1]) > epsilon4)) {
            delete edges[i];
        }
    }
}
function createCell(site) {
    return cells[site.index] = {
        site,
        halfedges: []
    };
}
function cellHalfedgeAngle(cell, edge) {
    var site = cell.site, va = edge.left, vb = edge.right;
    if (site === vb) vb = va, va = site;
    if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
    if (site === va) va = edge[1], vb = edge[0];
    else va = edge[0], vb = edge[1];
    return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
}
function cellHalfedgeStart(cell, edge) {
    return edge[+(edge.left !== cell.site)];
}
function cellHalfedgeEnd(cell, edge) {
    return edge[+(edge.left === cell.site)];
}
function sortCellHalfedges() {
    for(var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i){
        if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
            var index = new Array(m), array4 = new Array(m);
            for(j = 0; j < m; ++j)index[j] = j, array4[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
            index.sort(function(i2, j2) {
                return array4[j2] - array4[i2];
            });
            for(j = 0; j < m; ++j)array4[j] = halfedges[index[j]];
            for(j = 0; j < m; ++j)halfedges[j] = array4[j];
        }
    }
}
function clipCells(x024, y024, x1, y1) {
    var nCells = cells.length, iCell, cell, site, iHalfedge, halfedges, nHalfedges, start25, startX, startY, end, endX, endY, cover = true;
    for(iCell = 0; iCell < nCells; ++iCell){
        if (cell = cells[iCell]) {
            site = cell.site;
            halfedges = cell.halfedges;
            iHalfedge = halfedges.length;
            while(iHalfedge--){
                if (!edges[halfedges[iHalfedge]]) {
                    halfedges.splice(iHalfedge, 1);
                }
            }
            iHalfedge = 0, nHalfedges = halfedges.length;
            while(iHalfedge < nHalfedges){
                end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
                start25 = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start25[0], startY = start25[1];
                if (Math.abs(endX - startX) > epsilon4 || Math.abs(endY - startY) > epsilon4) {
                    halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end, Math.abs(endX - x024) < epsilon4 && y1 - endY > epsilon4 ? [
                        x024,
                        Math.abs(startX - x024) < epsilon4 ? startY : y1
                    ] : Math.abs(endY - y1) < epsilon4 && x1 - endX > epsilon4 ? [
                        Math.abs(startY - y1) < epsilon4 ? startX : x1,
                        y1
                    ] : Math.abs(endX - x1) < epsilon4 && endY - y024 > epsilon4 ? [
                        x1,
                        Math.abs(startX - x1) < epsilon4 ? startY : y024
                    ] : Math.abs(endY - y024) < epsilon4 && endX - x024 > epsilon4 ? [
                        Math.abs(startY - y024) < epsilon4 ? startX : x024,
                        y024
                    ] : null)) - 1);
                    ++nHalfedges;
                }
            }
            if (nHalfedges) cover = false;
        }
    }
    if (cover) {
        var dx, dy, d2, dc = Infinity;
        for(iCell = 0, cover = null; iCell < nCells; ++iCell){
            if (cell = cells[iCell]) {
                site = cell.site;
                dx = site[0] - x024;
                dy = site[1] - y024;
                d2 = dx * dx + dy * dy;
                if (d2 < dc) dc = d2, cover = cell;
            }
        }
        if (cover) {
            var v00 = [
                x024,
                y024
            ], v01 = [
                x024,
                y1
            ], v11 = [
                x1,
                y1
            ], v10 = [
                x1,
                y024
            ];
            cover.halfedges.push(edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1, edges.push(createBorderEdge(site, v01, v11)) - 1, edges.push(createBorderEdge(site, v11, v10)) - 1, edges.push(createBorderEdge(site, v10, v00)) - 1);
        }
    }
    for(iCell = 0; iCell < nCells; ++iCell){
        if (cell = cells[iCell]) {
            if (!cell.halfedges.length) {
                delete cells[iCell];
            }
        }
    }
}
var circlePool = [];
var firstCircle;
function Circle() {
    RedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
}
function attachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite[0], by = cSite[1], ax = lSite[0] - bx, ay = lSite[1] - by, cx = rSite[0] - bx, cy = rSite[1] - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -epsilon21) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x2 = (cy * ha - ay * hc) / d, y2 = (ax * hc - cx * ha) / d;
    var circle = circlePool.pop() || new Circle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x2 + bx;
    circle.y = (circle.cy = y2 + by) + Math.sqrt(x2 * x2 + y2 * y2);
    arc.circle = circle;
    var before = null, node = circles._;
    while(node){
        if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
            if (node.L) node = node.L;
            else {
                before = node.P;
                break;
            }
        } else {
            if (node.R) node = node.R;
            else {
                before = node;
                break;
            }
        }
    }
    circles.insert(before, circle);
    if (!before) firstCircle = circle;
}
function detachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
        if (!circle.P) firstCircle = circle.N;
        circles.remove(circle);
        circlePool.push(circle);
        RedBlackNode(circle);
        arc.circle = null;
    }
}
var beachPool = [];
function Beach() {
    RedBlackNode(this);
    this.edge = this.site = this.circle = null;
}
function createBeach(site) {
    var beach = beachPool.pop() || new Beach();
    beach.site = site;
    return beach;
}
function detachBeach(beach) {
    detachCircle(beach);
    beaches.remove(beach);
    beachPool.push(beach);
    RedBlackNode(beach);
}
function removeBeach(beach) {
    var circle = beach.circle, x2 = circle.x, y2 = circle.cy, vertex = [
        x2,
        y2
    ], previous = beach.P, next = beach.N, disappearing = [
        beach
    ];
    detachBeach(beach);
    var lArc = previous;
    while(lArc.circle && Math.abs(x2 - lArc.circle.x) < epsilon4 && Math.abs(y2 - lArc.circle.cy) < epsilon4){
        previous = lArc.P;
        disappearing.unshift(lArc);
        detachBeach(lArc);
        lArc = previous;
    }
    disappearing.unshift(lArc);
    detachCircle(lArc);
    var rArc = next;
    while(rArc.circle && Math.abs(x2 - rArc.circle.x) < epsilon4 && Math.abs(y2 - rArc.circle.cy) < epsilon4){
        next = rArc.N;
        disappearing.push(rArc);
        detachBeach(rArc);
        rArc = next;
    }
    disappearing.push(rArc);
    detachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for(iArc = 1; iArc < nArcs; ++iArc){
        rArc = disappearing[iArc];
        lArc = disappearing[iArc - 1];
        setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);
    attachCircle(lArc);
    attachCircle(rArc);
}
function addBeach(site) {
    var x2 = site[0], directrix = site[1], lArc, rArc, dxl, dxr, node = beaches._;
    while(node){
        dxl = leftBreakPoint(node, directrix) - x2;
        if (dxl > epsilon4) node = node.L;
        else {
            dxr = x2 - rightBreakPoint(node, directrix);
            if (dxr > epsilon4) {
                if (!node.R) {
                    lArc = node;
                    break;
                }
                node = node.R;
            } else {
                if (dxl > -epsilon4) {
                    lArc = node.P;
                    rArc = node;
                } else if (dxr > -epsilon4) {
                    lArc = node;
                    rArc = node.N;
                } else {
                    lArc = rArc = node;
                }
                break;
            }
        }
    }
    createCell(site);
    var newArc = createBeach(site);
    beaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
        detachCircle(lArc);
        rArc = createBeach(lArc.site);
        beaches.insert(newArc, rArc);
        newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
        attachCircle(lArc);
        attachCircle(rArc);
        return;
    }
    if (!rArc) {
        newArc.edge = createEdge(lArc.site, newArc.site);
        return;
    }
    detachCircle(lArc);
    detachCircle(rArc);
    var lSite = lArc.site, ax = lSite[0], ay = lSite[1], bx = site[0] - ax, by = site[1] - ay, rSite = rArc.site, cx = rSite[0] - ax, cy = rSite[1] - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = [
        (cy * hb - by * hc) / d + ax,
        (bx * hc - cx * hb) / d + ay
    ];
    setEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = createEdge(lSite, site, null, vertex);
    rArc.edge = createEdge(site, rSite, null, vertex);
    attachCircle(lArc);
    attachCircle(rArc);
}
function leftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site[0], rfocy = site[1], pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site[0], lfocy = site[1], plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
}
function rightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return leftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site[1] === directrix ? site[0] : Infinity;
}
var epsilon4 = 0.000001;
var epsilon21 = 0.000000000001;
var beaches;
var cells;
var circles;
var edges;
function triangleArea(a, b, c) {
    return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
}
function lexicographic(a, b) {
    return b[1] - a[1] || b[0] - a[0];
}
function Diagram(sites, extent) {
    var site = sites.sort(lexicographic).pop(), x2, y2, circle;
    edges = [];
    cells = new Array(sites.length);
    beaches = new RedBlackTree();
    circles = new RedBlackTree();
    while(true){
        circle = firstCircle;
        if (site && (!circle || site[1] < circle.y || site[1] === circle.y && site[0] < circle.x)) {
            if (site[0] !== x2 || site[1] !== y2) {
                addBeach(site);
                x2 = site[0], y2 = site[1];
            }
            site = sites.pop();
        } else if (circle) {
            removeBeach(circle.arc);
        } else {
            break;
        }
    }
    sortCellHalfedges();
    if (extent) {
        var x025 = +extent[0][0], y025 = +extent[0][1], x1 = +extent[1][0], y1 = +extent[1][1];
        clipEdges(x025, y025, x1, y1);
        clipCells(x025, y025, x1, y1);
    }
    this.edges = edges;
    this.cells = cells;
    beaches = circles = edges = cells = null;
}
Diagram.prototype = {
    constructor: Diagram,
    polygons: function() {
        var edges2 = this.edges;
        return this.cells.map(function(cell) {
            var polygon = cell.halfedges.map(function(i) {
                return cellHalfedgeStart(cell, edges2[i]);
            });
            polygon.data = cell.site.data;
            return polygon;
        });
    },
    triangles: function() {
        var triangles = [], edges2 = this.edges;
        this.cells.forEach(function(cell, i) {
            if (!(m = (halfedges = cell.halfedges).length)) return;
            var site = cell.site, halfedges, j = -1, m, s0, e1 = edges2[halfedges[m - 1]], s1 = e1.left === site ? e1.right : e1.left;
            while(++j < m){
                s0 = s1;
                e1 = edges2[halfedges[j]];
                s1 = e1.left === site ? e1.right : e1.left;
                if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
                    triangles.push([
                        site.data,
                        s0.data,
                        s1.data
                    ]);
                }
            }
        });
        return triangles;
    },
    links: function() {
        return this.edges.filter(function(edge) {
            return edge.right;
        }).map(function(edge) {
            return {
                source: edge.left.data,
                target: edge.right.data
            };
        });
    },
    find: function(x2, y2, radius) {
        var that = this, i0, i1 = that._found || 0, n = that.cells.length, cell;
        while(!(cell = that.cells[i1]))if (++i1 >= n) return null;
        var dx = x2 - cell.site[0], dy = y2 - cell.site[1], d2 = dx * dx + dy * dy;
        do {
            cell = that.cells[i0 = i1], i1 = null;
            cell.halfedges.forEach(function(e) {
                var edge = that.edges[e], v = edge.left;
                if ((v === cell.site || !v) && !(v = edge.right)) return;
                var vx = x2 - v[0], vy = y2 - v[1], v2 = vx * vx + vy * vy;
                if (v2 < d2) d2 = v2, i1 = v.index;
            });
        }while (i1 !== null)
        that._found = i0;
        return radius == null || d2 <= radius * radius ? cell.site : null;
    }
};
function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
}
Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point18) {
        return [
            point18[0] * this.k + this.x,
            point18[1] * this.k + this.y
        ];
    },
    applyX: function(x) {
        return x * this.k + this.x;
    },
    applyY: function(y) {
        return y * this.k + this.y;
    },
    invert: function(location) {
        return [
            (location[0] - this.x) / this.k,
            (location[1] - this.y) / this.k
        ];
    },
    invertX: function(x) {
        return (x - this.x) / this.k;
    },
    invertY: function(y) {
        return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
    while(!node.__zoom)if (!(node = node.parentNode)) return identity2;
    return node.__zoom;
}
const normalizeWord = (d)=>d.toLowerCase()
;
let cwordMap = {};
let cwordToIndices = {};
let cbookMap = {};
let cbookMapInv = {};
let cwords = [];
const versesToWords = (verses)=>{
    const wordMap = {};
    const wordToIndices = {};
    const bookMap = {};
    const bookMapInv = {};
    let wordIndex = 0;
    let bookIndex = 0;
    let arrayIndex = 0;
    return {
        wordMap,
        wordToIndices,
        bookMap,
        bookMapInv,
        words: verses.flatMap((v)=>{
            const [book, chapter, verse] = v.ref.split(".");
            return (v.text.match(/\w+(?:\u2019\w+)*/g) || []).map((word)=>{
                const stem = normalizeWord(word);
                if (wordMap[stem] === undefined) {
                    wordMap[stem] = wordIndex;
                    wordIndex += 1;
                }
                if (bookMap[book] === undefined) {
                    bookMap[book] = bookIndex;
                    bookMapInv[bookIndex] = book;
                    bookIndex += 1;
                }
                if (wordToIndices[wordMap[stem]] === undefined) {
                    wordToIndices[wordMap[stem]] = [];
                }
                wordToIndices[wordMap[stem]].push(arrayIndex);
                arrayIndex += 1;
                return {
                    book: bookMap[book],
                    chapter: +chapter,
                    verse: +verse,
                    word: wordMap[stem],
                    text: word
                };
            });
        })
    };
};
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const backCanvas = document.getElementById("background");
const backContext = backCanvas.getContext("2d");
const hoverCanvas = document.getElementById("hover");
const hoverContext = hoverCanvas.getContext("2d");
let padding = 50;
let sectionWidth = 10;
let hoverSize = {
    x: 50,
    y: 25
};
let hoverOpacity = 0.8;
let size = 1;
let columns = 1;
let height = 1;
let hoverSection = 0;
let hoverRow = 0;
let hoverIndex = 0;
let hoverRows = 1;
const initializeView = ()=>{
    var scale = window.devicePixelRatio;
    canvas.width = Math.floor(canvas.clientWidth * scale);
    canvas.height = Math.floor(canvas.clientHeight * scale);
    backCanvas.width = Math.floor(canvas.clientWidth * scale);
    backCanvas.height = Math.floor(canvas.clientHeight * scale);
    hoverCanvas.width = Math.floor(canvas.clientWidth * scale);
    hoverCanvas.height = Math.floor(canvas.clientHeight * scale);
    ctx.scale(scale, scale);
    backContext.scale(scale, scale);
    hoverContext.scale(scale, scale);
    size = Math.sqrt((canvas.clientWidth - 2 * padding) * (canvas.clientHeight - 2 * padding) / cwords.length);
    columns = Math.floor((canvas.clientWidth - 2 * padding) / size);
    height = Math.ceil(cwords.length / columns);
    hoverRows = Math.ceil((canvas.clientHeight - 2 * padding) / hoverSize.y);
    drawBackground();
    draw();
};
const wordLocation = {
    forward: (i, sizeX, sizeY)=>{
        const section = Math.floor(i / (sectionWidth * height));
        const x = sizeX * (section * sectionWidth + i % sectionWidth) + padding;
        const y = (sizeY || sizeX) * Math.floor(i % (sectionWidth * height) / sectionWidth) + padding;
        return [
            x,
            y
        ];
    },
    backwardCoords: ([x, y], size1)=>{
        const row = Math.floor((y - padding) / size1);
        if (row < 0 || row >= height) {
            return {
                section: -1,
                row: -1,
                col: -1
            };
        }
        const globalCol = Math.floor((x - padding) / size1);
        if (globalCol < 0) {
            return {
                section: -1,
                row: -1,
                col: -1
            };
        }
        const section = Math.floor(globalCol / sectionWidth);
        const col = globalCol % sectionWidth;
        return {
            section,
            row,
            col
        };
    },
    backward: ([x, y], size2)=>{
        const { section , row , col  } = wordLocation.backwardCoords([
            x,
            y
        ], size2);
        return section * (sectionWidth * height) + row * sectionWidth + col;
    }
};
const drawBackground = ()=>{
    backContext.clearRect(0, 0, backCanvas.width, backCanvas.height);
    let curBook = -1;
    const lineColor = "rgb(220,220,220)";
    backContext.fillStyle = lineColor;
    const [lastX, lastY] = wordLocation.forward(cwords.length - cwords.length % sectionWidth, size);
    backContext.fillRect(padding, padding, lastX + size * sectionWidth - padding, 1);
    backContext.fillRect(padding, size * height + padding, lastX - padding, 1);
    backContext.fillRect(padding, padding, 1, size * height);
    backContext.fillRect(lastX + size * sectionWidth, padding, 1, lastY - padding);
    backContext.fillRect(lastX, lastY, size * sectionWidth, 1);
    backContext.fillRect(lastX, lastY, 1, size * height - (lastY - padding));
    cwords.forEach((w, i)=>{
        if (w.book !== curBook) {
            const [x, y] = wordLocation.forward(i - i % sectionWidth, size);
            backContext.fillRect(x, y, size * sectionWidth, 1);
            backContext.fillRect(x + size * sectionWidth, padding, 1, y - padding);
            backContext.fillRect(x, y, 1, canvas.clientHeight - padding - y);
            curBook = w.book;
        }
    });
    curBook = -1;
    backContext.fillStyle = "rgb(50,50,50)";
    cwords.forEach((w, i)=>{
        if (w.book !== curBook) {
            const [x, y] = wordLocation.forward(i - i % sectionWidth, size);
            backContext.fillText(cbookMapInv[w.book] || "", x + 2, y + 10);
            curBook = w.book;
        }
    });
};
let runningTimeout = undefined;
const draw = ()=>{
    const stems = searches.map((d)=>d.value
    ).map(normalizeWord);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (runningTimeout !== undefined) {
        clearTimeout(runningTimeout);
    }
    runningTimeout = undefined;
    let start26 = 0;
    const amount = 2000;
    let stemI = 0;
    const run = ()=>{
        let beginingStart = start26;
        while(start26 - beginingStart < 2000){
            const stem = stems[stemI];
            if (stem === undefined) {
                console.log(stems, stemI);
                throw new Error("stem is undefined");
            }
            const word = cwordMap[stem];
            if (word === undefined) {
                stemI += 1;
                if (stemI >= stems.length) {
                    return;
                }
                continue;
            }
            const wordIndices = cwordToIndices[word];
            const color1 = color(searchColors[stemI].value);
            start26 = drawAmount(color1, wordIndices, start26, amount);
            if (start26 === wordIndices.length) {
                start26 = 0;
                beginingStart = 0;
                stemI += 1;
            }
            if (stemI >= stems.length) {
                return;
            }
        }
        runningTimeout = setTimeout(run, 0);
    };
    run();
};
const drawAmount = (color3, wordIndices, startInd, amount)=>{
    let i = startInd;
    for(i = startInd; i < wordIndices.length && i - startInd < amount; i++){
        const wordI = wordIndices[i];
        const [x, y] = wordLocation.forward(wordI, size);
        color3.opacity = +fadeInput.value;
        ctx.fillStyle = color3.toString();
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size / 2, size + +sizeInput.value, size + +sizeInput.value, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    return i;
};
const drawHover = ()=>{
    hoverContext.clearRect(0, 0, canvas.width, canvas.height);
    info.innerText = "";
    if (hoverIndex < 0) {
        return;
    }
    hoverContext.font = "15px sans-serif";
    const stems = searches.map((d)=>d.value
    ).map(normalizeWord);
    const startIndex = Math.max(0, hoverSection * (sectionWidth * height) + hoverRow * sectionWidth);
    let xShift = 0;
    if (hoverIndex < cwords.length / 2) {
        xShift = canvas.clientWidth - 2 * padding - hoverSize.x * sectionWidth;
    }
    const start27 = cwords[startIndex];
    const ref = `${cbookMapInv[start27.book]} ${start27.chapter}:${start27.verse}`;
    hoverContext.fillText(ref, padding + xShift, padding - 3);
    cwords.slice(startIndex, startIndex + hoverRows * sectionWidth).forEach((w, i)=>{
        let [x, y] = wordLocation.forward(startIndex + i, size);
        hoverContext.fillStyle = "rgb(150,150,150)";
        hoverContext.fillRect(x, y, size, size);
        [x, y] = wordLocation.forward(i, hoverSize.x, hoverSize.y);
        x += xShift;
        let backgroundColor = `rgba(255,255,255,${hoverOpacity})`;
        let textColor = [
            0,
            0,
            0
        ];
        for(let s = 0; s < stems.length; s += 1){
            if (w.word === cwordMap[stems[s]]) {
                let color4 = color(searchColors[s].value);
                color4.opacity = hoverOpacity;
                backgroundColor = color4.toString();
                textColor = [
                    255,
                    255,
                    255
                ];
            }
        }
        hoverContext.fillStyle = backgroundColor;
        hoverContext.fillRect(x, y, hoverSize.x, hoverSize.y);
        hoverContext.fillStyle = `rgb(${textColor.join(",")})`;
        hoverContext.fillText(w.text, x + 1, y + hoverSize.y - 2, hoverSize.x - 2);
    });
};
const searches = [
    document.getElementById("search0"),
    document.getElementById("search1"),
    document.getElementById("search2"),
    document.getElementById("search3"), 
];
const searchColors = [
    document.getElementById("color0"),
    document.getElementById("color1"),
    document.getElementById("color2"),
    document.getElementById("color3"), 
];
const sizeInput = document.getElementById("size");
const fadeInput = document.getElementById("fade");
const copyLink = document.getElementById("copy-link");
const copyLinkButton = document.getElementById("copy-link-button");
const shareButton = document.getElementById("share-button");
const info = document.getElementById("info");
const versionInput = document.getElementById('version');
const versionToWords = {};
const loadVersion = async (v)=>{
    const res = await fetch(`versions/${v}.json`);
    const json = await res.json();
    versionToWords[v] = versesToWords(json);
};
loadVersion(versionInput.value.toLowerCase()).then(()=>{
    ({ words: cwords , wordMap: cwordMap , wordToIndices: cwordToIndices , bookMap: cbookMap , bookMapInv: cbookMapInv  } = versionToWords[versionInput.value.toLowerCase()]);
    sizeInput.addEventListener("input", ()=>{
        draw();
        drawHover();
    });
    fadeInput.addEventListener("input", ()=>{
        draw();
        drawHover();
    });
    shareButton.addEventListener("click", ()=>{
        let params = "?";
        searches.forEach((s, i)=>{
            params += `&search${i}=` + encodeURIComponent(s.value);
        });
        searchColors.forEach((c, i)=>{
            params += `&color${i}=` + encodeURIComponent(c.value);
        });
        params += `&size=${sizeInput.value}`;
        params += `&fade=${fadeInput.value}`;
        copyLink.value = window.location.origin + params;
    });
    copyLinkButton.addEventListener("click", ()=>{
        copyLink.select();
        copyLink.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyLink.value);
    });
    searches.forEach((s)=>s.addEventListener("input", ()=>{
            draw();
            drawHover();
        })
    );
    searchColors.forEach((s)=>s.addEventListener("input", ()=>{
            draw();
            drawHover();
        })
    );
    versionInput.addEventListener('change', async ()=>{
        if (!versionToWords[versionInput.value]) {
            await loadVersion(versionInput.value);
        }
        ({ words: cwords , wordMap: cwordMap , wordToIndices: cwordToIndices , bookMap: cbookMap , bookMapInv: cbookMapInv  } = versionToWords[versionInput.value.toLowerCase()]);
        draw();
        drawHover();
    });
    function brush(event2) {
        const { section , row , col  } = wordLocation.backwardCoords([
            event2.offsetX,
            event2.offsetY
        ], size);
        hoverIndex = wordLocation.backward([
            event2.offsetX,
            event2.offsetY
        ], size);
        hoverSection = section;
        hoverRow = Math.floor(row - Math.min(hoverRows / 2));
        drawHover();
    }
    hoverCanvas.addEventListener("mousemove", (event3)=>{
        brush(event3);
    });
    window.addEventListener("resize", initializeView);
    initializeView();
});
searchColors.forEach((s, i)=>{
    s.value = Tableau10[i];
});
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for(let i = 0; i < vars.length; i++){
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
}
searches.forEach((s, i)=>{
    let val = getQueryVariable(`search${i}`);
    if (val !== undefined) {
        s.value = val;
    }
});
searchColors.forEach((c, i)=>{
    let val = getQueryVariable(`color${i}`);
    if (val !== undefined) {
        c.value = val;
    }
});
let sizeVal = getQueryVariable("size");
if (sizeVal !== undefined) {
    sizeInput.value = sizeVal;
}
let fadeVal = getQueryVariable("fade");
if (fadeVal !== undefined) {
    fadeInput.value = fadeVal;
}
let version = getQueryVariable("version");
if (version !== undefined) {
    versionInput.value = version.toLowerCase();
}
