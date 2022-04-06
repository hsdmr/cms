
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var us = {
      title: {
        home: "Home",
        dashboard: "Dashboard",
        options: "Options",
        users: "Users",
        logout: "Logout",
        layouts: "Layouts",
        fullName: "Full name",
        email: "Email",
        password: "Password",
        retypePassword: "Retype password",

        description: "Description",
        firstName: "First Name",
        lastName: "Last Name",
        role: "Role",
        username: "Username",
        nickname: "Nickname",
        image: "Image",
        createdAt: "Created At",
        status: "Status",
      },
      any: {
        title: "Title",
        content: "Content",
        search: "Search",
        addNew: "Add New",
        save: "Save",
        body: "Body",
        noElementFound: "No Element Found!",
        shownRecord: "The record shown on the page:",
        
        customize: "Customize",
        darkMode: "Dark Mode",
        fixed: "Fixed",
        collapsed: "Collapsed",
        navFlat: "Nav Flat",
        navLegacy: "Nav Legacy",
        navCompact: "Nav Compact",
        navChildIndent: "Nav Child Indent",
        navChildHideOnCollapse: "Nav Child Hide On Collapse",
        disableHoverFocusAutoExpand: "Disable Hover/Focus Auto-Expand",
        headerOptions: "Header Options",
        sidebarOptions: "Sidebar Options",
        footerOptions: "Footer Options",
        smallTextOption: "Small Text Options",
        navbarVariants: "Navbar Variants",
        sidebarVariants: "Sidebar Variants",
        brandLogoVariants: "Brand Logo Variants",
        noneSelected: "None Selected",
        primary: "Primary",
        secondary: "Secondary",
        info: "Info",
        warning: "Warning",
        success: "Success",
        danger: "Danger",
        indigo: "Indigo",
        purple: "Purple",
        pink: "Pink",
        navy: "Navy",
        lightblue: "Lightblue",
        cyan: "Cyan",
        dark: "Dark",
        grayDark: "Gray dark",
        gray: "Gray",
        light: "Light",
        white: "White",
        orange: "Orange",
        fuchsia: "Fuchsia",
        maroon: "Maroon",
        lime: "Lime",
        teal: "Teal",
        olive: "Olive",
      },
      footer: {
        text: "Anything you want",
        rights: "All rights reserved.",
        copyright: "Copyright"
      },
      login: {
        message: "Sign in to start your session",
        rememberMe: "Remember Me",
        signIn: "Sign In",
        forgetPassword: "I forgot my password",
        registerNew: "Register a new membership",
      },
      register: {
        message: "Register a new membership",
        register: "Register",
        alreadyMember: "I already have a membership",
      },
      password: {
        message: "You forgot your password? Here you can easily retrieve a new password.",
        requestNew: "Request new password",
        login: "Login",
      },
    };

    var tr = {
      title: {
        home: "Ana sayfa",
        dashboard: "Gösterge Paneli",
        options: "Ayarlar",
        logout: "Çıkış",
        users: "Kullanıcılar",
        layouts: "Düzenler",
        fullName: "İsim Soyisim",
        email: "Eposta",
        password: "Şifre",
        retypePassword: "Şifre tekrar",

        description: "Açıklama",
        firstName: "İsim",
        lastName: "Soyisim",
        role: "Rol",
        username: "Kullanıcı adı",
        nickname: "Takma ad",
        image: "Resim",
        createdAt: "Oluşturulma zamanı",
        status: "Durum",
      },
      any: {
        title: "Başlık",
        content: "İçerik",
        search: "Ara",
        addNew: "Yeni Ekle",
        save: "Kaydet",
        body: "Gövde",
        noElementFound: "Öğe Bulunamadı!",
        shownRecord: "Sayfada gösterilen kayıt:",
        
        customize: "Özelleştir",
        darkMode: "Karanlık Mod",
        fixed: "Sabit",
        collapsed: "Daralt",
        navFlat: "Düz Menu",
        navLegacy: "Miras Menu",
        navCompact: "Sıkı Menu",
        navChildIndent: "Menu Alt Girinti",
        navChildHideOnCollapse: "Menü Daraltıldığında Alt Elemanı Gizle",
        disableHoverFocusAutoExpand: "Hover/Odak Otomatik Genişletmeyi Devre Dışı Bırak",
        headerOptions: "Başlık Seçenekleri",
        sidebarOptions: "Kenarlık Seçenekleri",
        footerOptions: "Altbilgi Seçenekleri",
        smallTextOption: "Küçük Metin Seçenekleri",
        navbarVariants: "Menü Varyantları",
        sidebarVariants: "Kenarlık Varyantları",
        brandLogoVariants: "Marka Logo Varyantları",
        noneSelected: "Hiçbiri",
        primary: "Birincil",
        secondary: "İkincil",
        info: "Bilgi",
        warning: "Uyarı",
        success: "Başarı",
        danger: "Tehlike",
        indigo: "Çivit",
        purple: "Mor",
        pink: "Pembe",
        navy: "Lacivert ",
        lightblue: "Açık Mavi",
        cyan: "Camgöbeği",
        dark: "Karanlık",
        grayDark: "Koyu Gri",
        gray: "Gri",
        light: "Açık",
        white: "Beyaz",
        orange: "Turuncu",
        fuchsia: "Fuşya",
        maroon: "Bordo",
        lime: "Limon Yeşili",
        teal: "Deniz Mavisi",
        olive: "Zeytin Yeşili",
      },
      footer: {
        text: "Ne isterseniz",
        rights: "Tüm Hakları Saklıdır.",
        copyright: "Telif Hakkı"
      },
      login: {
        message: "Oturumunuzu başlatmak için giriş yapın",
        rememberMe: "Beni Hatırla",
        signIn: "Giriş",
        forgetPassword: "Şifremi unuttum",
        registerNew: "Yeni üyelik kaydı",
      },
      register: {
        message: "Yeni üyelik kaydı",
        register: "kaydol",
        alreadyMember: "Zaten üyeyim",
      },
      password: {
        message: "Şifrenizi mi unuttunuz? Burdan kolayca şifre alabilirsiniz.",
        requestNew: "Yeni şifre isteği",
        login: "Giriş",
      },
      table: {
        title: "Title",
        description: "Description",
        firstName: "First Name",
        lastName: "Last Name",
        fullName: "Full Name",
        role: "Role",
        username: "Username",
        nickname: "Nickname",
        email: "Email",
        image: "Image",
        createdAt: "Created At",
        status: "Status",
      }
    };

    var translations = {
      tr: tr,
      us: us,
    };

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const dict = writable();
    const locale = writable('us');
    const languages = Object.keys(translations);

    const localizedDict = derived([dict, locale], ([dict, locale]) => {
      if (!dict || !locale) return;
      return (dict[locale]);
    });

    const getMessageFromLocalizedDict = (id, localizedDict) => {
      const splitId = id.split('.');
      let message = { ...localizedDict };
      splitId.forEach((partialId) => {
        message = message[partialId];
      });
      return (message);
    };

    const createMessageFormatter = (localizedDict) => (id) => getMessageFromLocalizedDict(id, localizedDict);

    const __ = derived(localizedDict, (localizedDict) => {
      return (createMessageFormatter(localizedDict));
    });

    /* src\components\Translator.svelte generated by Svelte v3.46.6 */

    function create_fragment$n(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Translator', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Translator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ translations, dict });
    	dict.set(translations);
    	return [$$scope, slots];
    }

    class Translator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Translator",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate: navigate$1 } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.46.6 */

    const file$m = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$m, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$m, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$m($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$m,
    			create_fragment$m,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.46.6 */
    const file$l = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$4(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$l, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$l, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$l($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.46.6 */
    const file$k = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$k(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$k, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    let href = window.location.href;
    let path = window.location.pathname;
    let root;

    if (path != '/') {
      root = href.split(path)[0];
    }

    const APP_ROOT = root ?? href.slice(0, -1);

    let apiUrl = 'http://localhost:8000/v2';

    const api = {
      login: `${apiUrl}/login`,
      logout: `${apiUrl}/logout`,
      check: `${apiUrl}/check`,
      register: `${apiUrl}/register`,
      forgetPassword: `${apiUrl}/forget-password`,
      admin: `${apiUrl}/admin`,
      
      user: `${apiUrl}/user`,
    };

    const route = {
      login: `login`,
      register: `register`,
      forgetPassword: `forget-password`,
      admin: `admin`,
      home: `/`,
      
      users: `users`,
      user: `user`,
      layouts: `layouts`,
    };

    function getSessionItem(key, value) {
      return JSON.parse(sessionStorage.getItem(key));
    }

    function setSessionItem(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
      return JSON.parse(sessionStorage.getItem(key))
    }

    function deleteSessionItem(key) {
      sessionStorage.removeItem(key);
      return true;
    }

    async function checkAuth() {
      const auth = getSessionItem("auth");
      let response = [];

      if (auth) {
        if (typeof auth.access_token !== "undefined") {
          response = await checkUserDetails(auth.access_token);
        }
      }

      if (typeof response.access_token === "undefined") {
        if (typeof response.message !== "undefined") {
          toastr.error(response.message);
        }
        navigate$1("/" + route.login);
      }
    }

    const getUserDetails = async (user, password) => {
      return fetch(api.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ user, password }),
      }).then((response) => {
        if (!response.ok) {
          console.error(`HTTP error: ${response.status}`);
        }
        return response.json();
      }).then((user) => {
        if (typeof user.message !== 'undefined') {
          deleteSessionItem('auth');
          return user;
        }
        if (typeof user.access_token !== 'undefined') {
          deleteSessionItem('auth');
          return setSessionItem('auth', user);
        }
      }).catch((err) => console.error(`Fetch problem: ${err.message}`));
    };

    const checkUserDetails = async (access_token) => {
      return fetch(api.check, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization": access_token
        },
      }).then((response) => {
        if (!response.ok) {
          console.error(`HTTP error: ${response.status}`);
        }
        return response.json();
      }).then((user) => {
        if (typeof user.message !== 'undefined') {
          deleteSessionItem('auth');
          return user;
        }
        if (typeof user.access_token !== 'undefined') {
          deleteSessionItem('auth');
          return setSessionItem('auth', user);
        }
      }).catch((err) => console.error(`Fetch problem: ${err.message}`));
    };

    const deleteUserDetails = async (access_token) => {
      return fetch(api.logout, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization": access_token
        },
      }).then((response) => {
        if (!response.ok) {
          console.error(`HTTP error: ${response.status}`);
        }
        return deleteSessionItem('auth');
      }).catch((err) => console.error(`Fetch problem: ${err.message}`));
    };

    /* src\components\Lang.svelte generated by Svelte v3.46.6 */
    const file$j = "src\\components\\Lang.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (15:4) {#each languages as lang}
    function create_each_block$7(ctx) {
    	let a;
    	let i;
    	let t0;
    	let t1_value = /*lang*/ ctx[3].toUpperCase() + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*lang*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", "flag-icon flag-icon-" + /*lang*/ ctx[3] + " mr-2");
    			add_location(i, file$j, 16, 8, 518);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "dropdown-item");
    			add_location(a, file$j, 15, 6, 439);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(15:4) {#each languages as lang}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let span;
    	let a;
    	let i;
    	let i_class_value;
    	let t;
    	let div;
    	let each_value = languages;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			i = element("i");
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", i_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0]);
    			add_location(i, file$j, 8, 4, 245);
    			attr_dev(a, "data-toggle", "dropdown");
    			attr_dev(a, "href", '#');
    			attr_dev(a, "aria-expanded", "false");
    			add_location(a, file$j, 7, 2, 180);
    			attr_dev(div, "class", "dropdown-menu dropdown-menu-right p-0");
    			set_style(div, "left", "inherit");
    			set_style(div, "right", "0px");
    			add_location(div, file$j, 10, 2, 300);
    			attr_dev(span, "class", "dropdown float-right");
    			add_location(span, file$j, 6, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, i);
    			append_dev(span, t);
    			append_dev(span, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$locale*/ 1 && i_class_value !== (i_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0])) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*setLocale, languages*/ 2) {
    				each_value = languages;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $locale;
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(0, $locale = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lang', slots, []);

    	function setLocale(lang) {
    		set_store_value(locale, $locale = lang, $locale);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lang> was created with unknown prop '${key}'`);
    	});

    	const click_handler = lang => setLocale(lang);

    	$$self.$capture_state = () => ({
    		languages,
    		locale,
    		__,
    		setLocale,
    		$locale
    	});

    	return [$locale, setLocale, click_handler];
    }

    class Lang extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lang",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\pages\auth\Login.svelte generated by Svelte v3.46.6 */

    const { console: console_1$4 } = globals;
    const file$i = "src\\pages\\auth\\Login.svelte";

    // (50:8) {#if error.includes("email")}
    function create_if_block_1$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[4]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$i, 50, 10, 1397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 16) set_data_dev(t, /*error*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(50:8) {#if error.includes(\\\"email\\\")}",
    		ctx
    	});

    	return block;
    }

    // (66:8) {#if error.includes("password")}
    function create_if_block$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[4]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$i, 66, 10, 1902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 16) set_data_dev(t, /*error*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(66:8) {#if error.includes(\\\"password\\\")}",
    		ctx
    	});

    	return block;
    }

    // (103:10) <Link to="/{route.forgetPassword}">
    function create_default_slot_1$2(ctx) {
    	let t_value = /*$__*/ ctx[5]("login.forgetPassword") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 32 && t_value !== (t_value = /*$__*/ ctx[5]("login.forgetPassword") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(103:10) <Link to=\\\"/{route.forgetPassword}\\\">",
    		ctx
    	});

    	return block;
    }

    // (107:10) <Link to="/{route.register}" class="text-center"              >
    function create_default_slot$6(ctx) {
    	let t_value = /*$__*/ ctx[5]("login.registerNew") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 32 && t_value !== (t_value = /*$__*/ ctx[5]("login.registerNew") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(107:10) <Link to=\\\"/{route.register}\\\" class=\\\"text-center\\\"              >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div13;
    	let div12;
    	let div11;
    	let div0;
    	let lang;
    	let t0;
    	let a;
    	let b;
    	let t2;
    	let t3;
    	let div10;
    	let p0;
    	let t4_value = /*$__*/ ctx[5]("login.message") + "";
    	let t4;
    	let t5;
    	let show_if_1 = /*error*/ ctx[4].includes("email");
    	let t6;
    	let div3;
    	let input0;
    	let input0_placeholder_value;
    	let t7;
    	let div2;
    	let div1;
    	let span0;
    	let t8;
    	let show_if = /*error*/ ctx[4].includes("password");
    	let t9;
    	let div5;
    	let input1;
    	let input1_placeholder_value;
    	let t10;
    	let div4;
    	let button0;
    	let span1;
    	let t11;
    	let div9;
    	let div7;
    	let div6;
    	let input2;
    	let t12;
    	let label;
    	let t13_value = /*$__*/ ctx[5]("login.rememberMe") + "";
    	let t13;
    	let t14;
    	let div8;
    	let button1;
    	let t15_value = /*$__*/ ctx[5]("login.signIn") + "";
    	let t15;
    	let t16;
    	let p1;
    	let link0;
    	let t17;
    	let p2;
    	let link1;
    	let div11_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });
    	let if_block0 = show_if_1 && create_if_block_1$3(ctx);
    	let if_block1 = show_if && create_if_block$3(ctx);

    	link0 = new Link$1({
    			props: {
    				to: "/" + route.forgetPassword,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/" + route.register,
    				class: "text-center",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div10 = element("div");
    			p0 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t10 = space();
    			div4 = element("div");
    			button0 = element("button");
    			span1 = element("span");
    			t11 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			input2 = element("input");
    			t12 = space();
    			label = element("label");
    			t13 = text(t13_value);
    			t14 = space();
    			div8 = element("div");
    			button1 = element("button");
    			t15 = text(t15_value);
    			t16 = space();
    			p1 = element("p");
    			create_component(link0.$$.fragment);
    			t17 = space();
    			p2 = element("p");
    			create_component(link1.$$.fragment);
    			add_location(b, file$i, 44, 31, 1220);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "h1");
    			add_location(a, file$i, 44, 8, 1197);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$i, 42, 6, 1132);
    			attr_dev(p0, "class", "login-box-msg");
    			add_location(p0, file$i, 47, 8, 1293);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", input0_placeholder_value = /*$__*/ ctx[5]("title.email"));
    			add_location(input0, file$i, 53, 10, 1502);
    			attr_dev(span0, "class", "fas fa-envelope");
    			add_location(span0, file$i, 61, 14, 1762);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$i, 60, 12, 1716);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$i, 59, 10, 1670);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$i, 52, 8, 1460);
    			attr_dev(input1, "type", /*type*/ ctx[0]);
    			input1.value = /*password*/ ctx[2];
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = /*$__*/ ctx[5]("title.password"));
    			add_location(input1, file$i, 69, 10, 2007);
    			attr_dev(span1, "class", "fas fa-eye");
    			add_location(span1, file$i, 78, 14, 2328);
    			attr_dev(button0, "class", "input-group-text");
    			add_location(button0, file$i, 77, 12, 2251);
    			attr_dev(div4, "class", "input-group-append");
    			add_location(div4, file$i, 76, 10, 2205);
    			attr_dev(div5, "class", "input-group mb-3");
    			add_location(div5, file$i, 68, 8, 1965);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "remember");
    			add_location(input2, file$i, 85, 14, 2528);
    			attr_dev(label, "for", "remember");
    			add_location(label, file$i, 86, 14, 2609);
    			attr_dev(div6, "class", "icheck-success");
    			add_location(div6, file$i, 84, 12, 2484);
    			attr_dev(div7, "class", "col-8");
    			add_location(div7, file$i, 83, 10, 2451);
    			attr_dev(button1, "class", "btn btn-success btn-block");
    			add_location(button1, file$i, 93, 12, 2807);
    			attr_dev(div8, "class", "col-4");
    			add_location(div8, file$i, 92, 10, 2774);
    			attr_dev(div9, "class", "row");
    			add_location(div9, file$i, 82, 8, 2422);
    			attr_dev(p1, "class", "mb-1");
    			add_location(p1, file$i, 101, 8, 3036);
    			attr_dev(p2, "class", "mb-0");
    			add_location(p2, file$i, 105, 8, 3171);
    			attr_dev(div10, "class", "card-body");
    			add_location(div10, file$i, 46, 6, 1260);
    			attr_dev(div11, "class", div11_class_value = "card card-outline " + (/*error*/ ctx[4] ? 'card-danger' : 'card-success'));
    			add_location(div11, file$i, 41, 4, 1052);
    			attr_dev(div12, "class", "login-box");
    			add_location(div12, file$i, 39, 2, 996);
    			attr_dev(div13, "class", "login-page");
    			add_location(div13, file$i, 38, 0, 968);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a);
    			append_dev(a, b);
    			append_dev(a, t2);
    			append_dev(div11, t3);
    			append_dev(div11, div10);
    			append_dev(div10, p0);
    			append_dev(p0, t4);
    			append_dev(div10, t5);
    			if (if_block0) if_block0.m(div10, null);
    			append_dev(div10, t6);
    			append_dev(div10, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*user*/ ctx[1]);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div10, t8);
    			if (if_block1) if_block1.m(div10, null);
    			append_dev(div10, t9);
    			append_dev(div10, div5);
    			append_dev(div5, input1);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(button0, span1);
    			append_dev(div10, t11);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div7, div6);
    			append_dev(div6, input2);
    			input2.checked = /*rememberMe*/ ctx[3];
    			append_dev(div6, t12);
    			append_dev(div6, label);
    			append_dev(label, t13);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, button1);
    			append_dev(button1, t15);
    			append_dev(div10, t16);
    			append_dev(div10, p1);
    			mount_component(link0, p1, null);
    			append_dev(div10, t17);
    			append_dev(div10, p2);
    			mount_component(link1, p2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*getValue*/ ctx[7], false, false, false),
    					listen_dev(button0, "click", /*showHidePassword*/ ctx[6], false, false, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[10]),
    					listen_dev(button1, "click", /*login*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 32) && t4_value !== (t4_value = /*$__*/ ctx[5]("login.message") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*error*/ 16) show_if_1 = /*error*/ ctx[4].includes("email");

    			if (show_if_1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div10, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty & /*$__*/ 32 && input0_placeholder_value !== (input0_placeholder_value = /*$__*/ ctx[5]("title.email"))) {
    				attr_dev(input0, "placeholder", input0_placeholder_value);
    			}

    			if (dirty & /*user*/ 2 && input0.value !== /*user*/ ctx[1]) {
    				set_input_value(input0, /*user*/ ctx[1]);
    			}

    			if (dirty & /*error*/ 16) show_if = /*error*/ ctx[4].includes("password");

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(div10, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*type*/ 1) {
    				attr_dev(input1, "type", /*type*/ ctx[0]);
    			}

    			if (!current || dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				prop_dev(input1, "value", /*password*/ ctx[2]);
    			}

    			if (!current || dirty & /*$__*/ 32 && input1_placeholder_value !== (input1_placeholder_value = /*$__*/ ctx[5]("title.password"))) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (dirty & /*rememberMe*/ 8) {
    				input2.checked = /*rememberMe*/ ctx[3];
    			}

    			if ((!current || dirty & /*$__*/ 32) && t13_value !== (t13_value = /*$__*/ ctx[5]("login.rememberMe") + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*$__*/ 32) && t15_value !== (t15_value = /*$__*/ ctx[5]("login.signIn") + "")) set_data_dev(t15, t15_value);
    			const link0_changes = {};

    			if (dirty & /*$$scope, $__*/ 4128) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope, $__*/ 4128) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);

    			if (!current || dirty & /*error*/ 16 && div11_class_value !== (div11_class_value = "card card-outline " + (/*error*/ ctx[4] ? 'card-danger' : 'card-success'))) {
    				attr_dev(div11, "class", div11_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_component(lang);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(link0);
    			destroy_component(link1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(5, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let active = false;
    	let type = "password";
    	let user = "hsdmrsoft@gmail.com";
    	let password = "Rest135**";
    	let rememberMe = false;
    	let error = "";

    	const showHidePassword = () => {
    		active = !active;
    		$$invalidate(0, type = active ? "text" : "password");
    	};

    	const getValue = e => {
    		$$invalidate(2, password = e.target.value);
    	};

    	async function login() {
    		const response = await getUserDetails(user, password);

    		if (typeof response.access_token !== "undefined") {
    			console.log(response);
    			if (error) $$invalidate(4, error = "");
    			navigate$1(route.admin);
    		}

    		if (typeof response.message !== "undefined") {
    			$$invalidate(4, error = response.message);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user = this.value;
    		$$invalidate(1, user);
    	}

    	function input2_change_handler() {
    		rememberMe = this.checked;
    		$$invalidate(3, rememberMe);
    	}

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		navigate: navigate$1,
    		__,
    		getUserDetails,
    		Lang,
    		route,
    		active,
    		type,
    		user,
    		password,
    		rememberMe,
    		error,
    		showHidePassword,
    		getValue,
    		login,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) active = $$props.active;
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('rememberMe' in $$props) $$invalidate(3, rememberMe = $$props.rememberMe);
    		if ('error' in $$props) $$invalidate(4, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		type,
    		user,
    		password,
    		rememberMe,
    		error,
    		$__,
    		showHidePassword,
    		getValue,
    		login,
    		input0_input_handler,
    		input2_change_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\pages\auth\Register.svelte generated by Svelte v3.46.6 */

    const { console: console_1$3 } = globals;
    const file$h = "src\\pages\\auth\\Register.svelte";

    // (67:8) {#if error.includes("name")}
    function create_if_block_4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$h, 67, 10, 1887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(67:8) {#if error.includes(\\\"name\\\")}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if error.includes("email")}
    function create_if_block_3$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$h, 83, 10, 2392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(83:8) {#if error.includes(\\\"email\\\")}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {#if error.includes("password")}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$h, 99, 10, 2898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(99:8) {#if error.includes(\\\"password\\\")}",
    		ctx
    	});

    	return block;
    }

    // (121:8) {#if error.includes("match")}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$h, 121, 10, 3582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(121:8) {#if error.includes(\\\"match\\\")}",
    		ctx
    	});

    	return block;
    }

    // (143:8) {#if error.includes("terms")}
    function create_if_block$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[7]);
    			attr_dev(div, "class", "text-danger");
    			add_location(div, file$h, 143, 10, 4298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 128) set_data_dev(t, /*error*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(143:8) {#if error.includes(\\\"terms\\\")}",
    		ctx
    	});

    	return block;
    }

    // (169:8) <Link to="/{route.login}" class="text-center"            >
    function create_default_slot$5(ctx) {
    	let t_value = /*$__*/ ctx[8]("register.alreadyMember") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 256 && t_value !== (t_value = /*$__*/ ctx[8]("register.alreadyMember") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(169:8) <Link to=\\\"/{route.login}\\\" class=\\\"text-center\\\"            >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div18;
    	let div17;
    	let div16;
    	let div0;
    	let lang;
    	let t0;
    	let a0;
    	let b;
    	let t2;
    	let t3;
    	let div15;
    	let p;
    	let t4_value = /*$__*/ ctx[8]("register.message") + "";
    	let t4;
    	let t5;
    	let show_if_4 = /*error*/ ctx[7].includes("name");
    	let t6;
    	let div3;
    	let input0;
    	let input0_placeholder_value;
    	let t7;
    	let div2;
    	let div1;
    	let span0;
    	let t8;
    	let show_if_3 = /*error*/ ctx[7].includes("email");
    	let t9;
    	let div6;
    	let input1;
    	let input1_placeholder_value;
    	let t10;
    	let div5;
    	let div4;
    	let span1;
    	let t11;
    	let show_if_2 = /*error*/ ctx[7].includes("password");
    	let t12;
    	let div8;
    	let input2;
    	let input2_placeholder_value;
    	let t13;
    	let div7;
    	let button0;
    	let span2;
    	let t14;
    	let show_if_1 = /*error*/ ctx[7].includes("match");
    	let t15;
    	let div10;
    	let input3;
    	let input3_placeholder_value;
    	let t16;
    	let div9;
    	let button1;
    	let span3;
    	let t17;
    	let show_if = /*error*/ ctx[7].includes("terms");
    	let t18;
    	let div14;
    	let div12;
    	let div11;
    	let input4;
    	let t19;
    	let label;
    	let t20;
    	let a1;
    	let t22;
    	let div13;
    	let button2;
    	let t23_value = /*$__*/ ctx[8]("register.register") + "";
    	let t23;
    	let t24;
    	let link;
    	let div16_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });
    	let if_block0 = show_if_4 && create_if_block_4(ctx);
    	let if_block1 = show_if_3 && create_if_block_3$1(ctx);
    	let if_block2 = show_if_2 && create_if_block_2$1(ctx);
    	let if_block3 = show_if_1 && create_if_block_1$2(ctx);
    	let if_block4 = show_if && create_if_block$2(ctx);

    	link = new Link$1({
    			props: {
    				to: "/" + route.login,
    				class: "text-center",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div15 = element("div");
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			div6 = element("div");
    			input1 = element("input");
    			t10 = space();
    			div5 = element("div");
    			div4 = element("div");
    			span1 = element("span");
    			t11 = space();
    			if (if_block2) if_block2.c();
    			t12 = space();
    			div8 = element("div");
    			input2 = element("input");
    			t13 = space();
    			div7 = element("div");
    			button0 = element("button");
    			span2 = element("span");
    			t14 = space();
    			if (if_block3) if_block3.c();
    			t15 = space();
    			div10 = element("div");
    			input3 = element("input");
    			t16 = space();
    			div9 = element("div");
    			button1 = element("button");
    			span3 = element("span");
    			t17 = space();
    			if (if_block4) if_block4.c();
    			t18 = space();
    			div14 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			input4 = element("input");
    			t19 = space();
    			label = element("label");
    			t20 = text("I agree to the ");
    			a1 = element("a");
    			a1.textContent = "terms";
    			t22 = space();
    			div13 = element("div");
    			button2 = element("button");
    			t23 = text(t23_value);
    			t24 = space();
    			create_component(link.$$.fragment);
    			add_location(b, file$h, 61, 31, 1708);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "h1");
    			add_location(a0, file$h, 61, 8, 1685);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$h, 59, 6, 1620);
    			attr_dev(p, "class", "login-box-msg");
    			add_location(p, file$h, 64, 8, 1781);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", input0_placeholder_value = /*$__*/ ctx[8]("title.fullName"));
    			add_location(input0, file$h, 70, 10, 1992);
    			attr_dev(span0, "class", "fas fa-user");
    			add_location(span0, file$h, 78, 14, 2259);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$h, 77, 12, 2213);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$h, 76, 10, 2167);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$h, 69, 8, 1950);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = /*$__*/ ctx[8]("title.email"));
    			add_location(input1, file$h, 86, 10, 2497);
    			attr_dev(span1, "class", "fas fa-envelope");
    			add_location(span1, file$h, 94, 14, 2758);
    			attr_dev(div4, "class", "input-group-text");
    			add_location(div4, file$h, 93, 12, 2712);
    			attr_dev(div5, "class", "input-group-append");
    			add_location(div5, file$h, 92, 10, 2666);
    			attr_dev(div6, "class", "input-group mb-3");
    			add_location(div6, file$h, 85, 8, 2455);
    			input2.value = /*password*/ ctx[4];
    			attr_dev(input2, "type", /*typePassword*/ ctx[0]);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "placeholder", input2_placeholder_value = /*$__*/ ctx[8]("title.password"));
    			attr_dev(input2, "id", "password");
    			add_location(input2, file$h, 102, 10, 3003);
    			attr_dev(span2, "class", "fas fa-eye");
    			add_location(span2, file$h, 116, 14, 3447);
    			attr_dev(button0, "class", "input-group-text");
    			attr_dev(button0, "id", "password-show-hide");
    			add_location(button0, file$h, 111, 12, 3287);
    			attr_dev(div7, "class", "input-group-append");
    			add_location(div7, file$h, 110, 10, 3241);
    			attr_dev(div8, "class", "input-group mb-3");
    			add_location(div8, file$h, 101, 8, 2961);
    			input3.value = /*retypePassword*/ ctx[5];
    			attr_dev(input3, "type", /*typeRetypePassword*/ ctx[1]);
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "placeholder", input3_placeholder_value = /*$__*/ ctx[8]("title.retypePassword"));
    			attr_dev(input3, "id", "retype-password");
    			add_location(input3, file$h, 124, 10, 3687);
    			attr_dev(span3, "class", "fas fa-eye");
    			add_location(span3, file$h, 138, 14, 4163);
    			attr_dev(button1, "class", "input-group-text");
    			attr_dev(button1, "id", "retype-password-show-hide");
    			add_location(button1, file$h, 133, 12, 3996);
    			attr_dev(div9, "class", "input-group-append");
    			add_location(div9, file$h, 132, 10, 3950);
    			attr_dev(div10, "class", "input-group mb-3");
    			add_location(div10, file$h, 123, 8, 3645);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "id", "agreeTerms");
    			attr_dev(input4, "name", "terms");
    			add_location(input4, file$h, 148, 14, 4467);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$h, 155, 31, 4703);
    			attr_dev(label, "for", "agreeTerms");
    			add_location(label, file$h, 154, 14, 4646);
    			attr_dev(div11, "class", "icheck-success");
    			add_location(div11, file$h, 147, 12, 4423);
    			attr_dev(div12, "class", "col-8");
    			add_location(div12, file$h, 146, 10, 4390);
    			attr_dev(button2, "class", "btn btn-success btn-block");
    			add_location(button2, file$h, 161, 12, 4857);
    			attr_dev(div13, "class", "col-4");
    			add_location(div13, file$h, 160, 10, 4824);
    			attr_dev(div14, "class", "row");
    			add_location(div14, file$h, 145, 8, 4361);
    			attr_dev(div15, "class", "card-body");
    			add_location(div15, file$h, 63, 6, 1748);
    			attr_dev(div16, "class", div16_class_value = "card card-outline " + (/*error*/ ctx[7] ? 'card-danger' : 'card-success'));
    			add_location(div16, file$h, 58, 4, 1540);
    			attr_dev(div17, "class", "register-box");
    			add_location(div17, file$h, 57, 2, 1508);
    			attr_dev(div18, "class", "login-page");
    			add_location(div18, file$h, 56, 0, 1480);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(a0, b);
    			append_dev(a0, t2);
    			append_dev(div16, t3);
    			append_dev(div16, div15);
    			append_dev(div15, p);
    			append_dev(p, t4);
    			append_dev(div15, t5);
    			if (if_block0) if_block0.m(div15, null);
    			append_dev(div15, t6);
    			append_dev(div15, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*fullName*/ ctx[2]);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div15, t8);
    			if (if_block1) if_block1.m(div15, null);
    			append_dev(div15, t9);
    			append_dev(div15, div6);
    			append_dev(div6, input1);
    			set_input_value(input1, /*user*/ ctx[3]);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, span1);
    			append_dev(div15, t11);
    			if (if_block2) if_block2.m(div15, null);
    			append_dev(div15, t12);
    			append_dev(div15, div8);
    			append_dev(div8, input2);
    			append_dev(div8, t13);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			append_dev(button0, span2);
    			append_dev(div15, t14);
    			if (if_block3) if_block3.m(div15, null);
    			append_dev(div15, t15);
    			append_dev(div15, div10);
    			append_dev(div10, input3);
    			append_dev(div10, t16);
    			append_dev(div10, div9);
    			append_dev(div9, button1);
    			append_dev(button1, span3);
    			append_dev(div15, t17);
    			if (if_block4) if_block4.m(div15, null);
    			append_dev(div15, t18);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div12, div11);
    			append_dev(div11, input4);
    			input4.checked = /*agreeTerms*/ ctx[6];
    			append_dev(div11, t19);
    			append_dev(div11, label);
    			append_dev(label, t20);
    			append_dev(label, a1);
    			append_dev(div14, t22);
    			append_dev(div14, div13);
    			append_dev(div13, button2);
    			append_dev(button2, t23);
    			append_dev(div15, t24);
    			mount_component(link, div15, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(input2, "input", /*getValue*/ ctx[10], false, false, false),
    					listen_dev(button0, "click", /*showHidePassword*/ ctx[9], false, false, false),
    					listen_dev(input3, "input", /*getValue*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*showHidePassword*/ ctx[9], false, false, false),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[14]),
    					listen_dev(button2, "click", /*register*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 256) && t4_value !== (t4_value = /*$__*/ ctx[8]("register.message") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*error*/ 128) show_if_4 = /*error*/ ctx[7].includes("name");

    			if (show_if_4) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div15, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty & /*$__*/ 256 && input0_placeholder_value !== (input0_placeholder_value = /*$__*/ ctx[8]("title.fullName"))) {
    				attr_dev(input0, "placeholder", input0_placeholder_value);
    			}

    			if (dirty & /*fullName*/ 4 && input0.value !== /*fullName*/ ctx[2]) {
    				set_input_value(input0, /*fullName*/ ctx[2]);
    			}

    			if (dirty & /*error*/ 128) show_if_3 = /*error*/ ctx[7].includes("email");

    			if (show_if_3) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div15, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*$__*/ 256 && input1_placeholder_value !== (input1_placeholder_value = /*$__*/ ctx[8]("title.email"))) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (dirty & /*user*/ 8 && input1.value !== /*user*/ ctx[3]) {
    				set_input_value(input1, /*user*/ ctx[3]);
    			}

    			if (dirty & /*error*/ 128) show_if_2 = /*error*/ ctx[7].includes("password");

    			if (show_if_2) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					if_block2.m(div15, t12);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!current || dirty & /*password*/ 16 && input2.value !== /*password*/ ctx[4]) {
    				prop_dev(input2, "value", /*password*/ ctx[4]);
    			}

    			if (!current || dirty & /*typePassword*/ 1) {
    				attr_dev(input2, "type", /*typePassword*/ ctx[0]);
    			}

    			if (!current || dirty & /*$__*/ 256 && input2_placeholder_value !== (input2_placeholder_value = /*$__*/ ctx[8]("title.password"))) {
    				attr_dev(input2, "placeholder", input2_placeholder_value);
    			}

    			if (dirty & /*error*/ 128) show_if_1 = /*error*/ ctx[7].includes("match");

    			if (show_if_1) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$2(ctx);
    					if_block3.c();
    					if_block3.m(div15, t15);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty & /*retypePassword*/ 32 && input3.value !== /*retypePassword*/ ctx[5]) {
    				prop_dev(input3, "value", /*retypePassword*/ ctx[5]);
    			}

    			if (!current || dirty & /*typeRetypePassword*/ 2) {
    				attr_dev(input3, "type", /*typeRetypePassword*/ ctx[1]);
    			}

    			if (!current || dirty & /*$__*/ 256 && input3_placeholder_value !== (input3_placeholder_value = /*$__*/ ctx[8]("title.retypePassword"))) {
    				attr_dev(input3, "placeholder", input3_placeholder_value);
    			}

    			if (dirty & /*error*/ 128) show_if = /*error*/ ctx[7].includes("terms");

    			if (show_if) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$2(ctx);
    					if_block4.c();
    					if_block4.m(div15, t18);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty & /*agreeTerms*/ 64) {
    				input4.checked = /*agreeTerms*/ ctx[6];
    			}

    			if ((!current || dirty & /*$__*/ 256) && t23_value !== (t23_value = /*$__*/ ctx[8]("register.register") + "")) set_data_dev(t23, t23_value);
    			const link_changes = {};

    			if (dirty & /*$$scope, $__*/ 131328) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*error*/ 128 && div16_class_value !== (div16_class_value = "card card-outline " + (/*error*/ ctx[7] ? 'card-danger' : 'card-success'))) {
    				attr_dev(div16, "class", div16_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			destroy_component(lang);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			destroy_component(link);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(8, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	let activePassword = false;
    	let activeRetypePassword = false;
    	let typePassword = "password";
    	let typeRetypePassword = "password";
    	let fullName = "";
    	let user = "";
    	let password = "";
    	let retypePassword = "";
    	let agreeTerms = false;
    	let error = "";

    	const showHidePassword = e => {
    		if (e.target.id === "password-show-hide") {
    			activePassword = !activePassword;
    			$$invalidate(0, typePassword = activePassword ? "text" : "password");
    		} else {
    			activeRetypePassword = !activeRetypePassword;
    			$$invalidate(1, typeRetypePassword = activeRetypePassword ? "text" : "password");
    		}
    	};

    	const getValue = e => {
    		if (e.target.id === "password") {
    			$$invalidate(4, password = e.target.value);
    		} else {
    			$$invalidate(5, retypePassword = e.target.value);
    		}
    	};

    	async function register() {
    		if (password !== retypePassword) {
    			$$invalidate(7, error = 'Passwords does not match');
    			return;
    		}

    		const response = await registerUser(fullName, user, password, agreeTerms);

    		if (typeof response.access_token !== "undefined") {
    			console.log(response);
    			if (error) $$invalidate(7, error = "");
    			navigate(route.admin);
    		}

    		if (typeof response.message !== "undefined") {
    			$$invalidate(7, error = response.message);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fullName = this.value;
    		$$invalidate(2, fullName);
    	}

    	function input1_input_handler() {
    		user = this.value;
    		$$invalidate(3, user);
    	}

    	function input4_change_handler() {
    		agreeTerms = this.checked;
    		$$invalidate(6, agreeTerms);
    	}

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		__,
    		route,
    		Lang,
    		activePassword,
    		activeRetypePassword,
    		typePassword,
    		typeRetypePassword,
    		fullName,
    		user,
    		password,
    		retypePassword,
    		agreeTerms,
    		error,
    		showHidePassword,
    		getValue,
    		register,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('activePassword' in $$props) activePassword = $$props.activePassword;
    		if ('activeRetypePassword' in $$props) activeRetypePassword = $$props.activeRetypePassword;
    		if ('typePassword' in $$props) $$invalidate(0, typePassword = $$props.typePassword);
    		if ('typeRetypePassword' in $$props) $$invalidate(1, typeRetypePassword = $$props.typeRetypePassword);
    		if ('fullName' in $$props) $$invalidate(2, fullName = $$props.fullName);
    		if ('user' in $$props) $$invalidate(3, user = $$props.user);
    		if ('password' in $$props) $$invalidate(4, password = $$props.password);
    		if ('retypePassword' in $$props) $$invalidate(5, retypePassword = $$props.retypePassword);
    		if ('agreeTerms' in $$props) $$invalidate(6, agreeTerms = $$props.agreeTerms);
    		if ('error' in $$props) $$invalidate(7, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		typePassword,
    		typeRetypePassword,
    		fullName,
    		user,
    		password,
    		retypePassword,
    		agreeTerms,
    		error,
    		$__,
    		showHidePassword,
    		getValue,
    		register,
    		input0_input_handler,
    		input1_input_handler,
    		input4_change_handler
    	];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\pages\auth\Password.svelte generated by Svelte v3.46.6 */

    const { Error: Error_1$1, console: console_1$2 } = globals;
    const file$g = "src\\pages\\auth\\Password.svelte";

    // (61:10) <Link to="/{route.login}">
    function create_default_slot$4(ctx) {
    	let t_value = /*$__*/ ctx[0]("password.login") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t_value !== (t_value = /*$__*/ ctx[0]("password.login") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(61:10) <Link to=\\\"/{route.login}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div0;
    	let lang;
    	let t0;
    	let a;
    	let b;
    	let t2;
    	let t3;
    	let div6;
    	let p0;
    	let t4_value = /*$__*/ ctx[0]("password.message") + "";
    	let t4;
    	let t5;
    	let div3;
    	let input;
    	let input_placeholder_value;
    	let t6;
    	let div2;
    	let div1;
    	let span;
    	let t7;
    	let div5;
    	let div4;
    	let button;
    	let t8_value = /*$__*/ ctx[0]("password.requestNew") + "";
    	let t8;
    	let t9;
    	let p1;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });

    	link = new Link$1({
    			props: {
    				to: "/" + route.login,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div6 = element("div");
    			p0 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			input = element("input");
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button = element("button");
    			t8 = text(t8_value);
    			t9 = space();
    			p1 = element("p");
    			create_component(link.$$.fragment);
    			add_location(b, file$g, 29, 31, 875);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "h1");
    			add_location(a, file$g, 29, 8, 852);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$g, 27, 6, 787);
    			attr_dev(p0, "class", "login-box-msg");
    			add_location(p0, file$g, 32, 8, 948);
    			attr_dev(input, "type", "email");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$__*/ ctx[0]("title.email"));
    			add_location(input, file$g, 36, 10, 1076);
    			attr_dev(span, "class", "fas fa-envelope");
    			add_location(span, file$g, 43, 14, 1306);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$g, 42, 12, 1260);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$g, 41, 10, 1214);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$g, 35, 8, 1034);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-success btn-block");
    			add_location(button, file$g, 49, 12, 1465);
    			attr_dev(div4, "class", "col-12");
    			add_location(div4, file$g, 48, 10, 1431);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$g, 47, 8, 1402);
    			attr_dev(p1, "class", "mt-3 mb-1");
    			add_location(p1, file$g, 59, 8, 1735);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$g, 31, 6, 915);
    			attr_dev(div7, "class", "card card-outline card-success");
    			add_location(div7, file$g, 26, 4, 735);
    			attr_dev(div8, "class", "login-box");
    			add_location(div8, file$g, 25, 2, 706);
    			attr_dev(div9, "class", "login-page");
    			add_location(div9, file$g, 24, 0, 678);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a);
    			append_dev(a, b);
    			append_dev(a, t2);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, p0);
    			append_dev(p0, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, input);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button);
    			append_dev(button, t8);
    			append_dev(div6, t9);
    			append_dev(div6, p1);
    			mount_component(link, p1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*submit*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 1) && t4_value !== (t4_value = /*$__*/ ctx[0]("password.message") + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*$__*/ 1 && input_placeholder_value !== (input_placeholder_value = /*$__*/ ctx[0]("title.email"))) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if ((!current || dirty & /*$__*/ 1) && t8_value !== (t8_value = /*$__*/ ctx[0]("password.requestNew") + "")) set_data_dev(t8, t8_value);
    			const link_changes = {};

    			if (dirty & /*$$scope, $__*/ 5) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(lang);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Password', slots, []);

    	const submit = () => {
    		fetch(api.user, {
    			headers: {
    				"Content-Type": "application/json",
    				Accept: "application/json"
    			}
    		}).then(response => {
    			if (!response.ok) {
    				throw new Error(`HTTP error: ${response.status}`);
    			}

    			return response.json();
    		}).then(json => initialize(json)).catch(err => console.error(`Fetch problem: ${err.message}`));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Password> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1, __, Lang, route, api, submit, $__ });
    	return [$__, submit];
    }

    class Password extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Password",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\layouts\Nav.svelte generated by Svelte v3.46.6 */
    const file$f = "src\\layouts\\Nav.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (172:8) {#each languages as lang}
    function create_each_block$6(ctx) {
    	let a;
    	let i;
    	let t0;
    	let t1_value = /*lang*/ ctx[3].toUpperCase() + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*lang*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", "flag-icon flag-icon-" + /*lang*/ ctx[3] + " mr-2");
    			add_location(i, file$f, 173, 12, 6248);
    			attr_dev(a, "href", '#');
    			attr_dev(a, "class", "dropdown-item");
    			add_location(a, file$f, 172, 10, 6165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(172:8) {#each languages as lang}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let nav;
    	let ul0;
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let ul1;
    	let li1;
    	let a1;
    	let i1;
    	let t1;
    	let div2;
    	let form;
    	let div1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let i2;
    	let t3;
    	let button1;
    	let i3;
    	let t4;
    	let li2;
    	let a2;
    	let i4;
    	let t5;
    	let span0;
    	let t7;
    	let div12;
    	let a3;
    	let div4;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div3;
    	let h30;
    	let t9;
    	let span1;
    	let i5;
    	let t10;
    	let p0;
    	let t12;
    	let p1;
    	let i6;
    	let t13;
    	let t14;
    	let div5;
    	let t15;
    	let a4;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div6;
    	let h31;
    	let t17;
    	let span2;
    	let i7;
    	let t18;
    	let p2;
    	let t20;
    	let p3;
    	let i8;
    	let t21;
    	let t22;
    	let div8;
    	let t23;
    	let a5;
    	let div10;
    	let img2;
    	let img2_src_value;
    	let t24;
    	let div9;
    	let h32;
    	let t25;
    	let span3;
    	let i9;
    	let t26;
    	let p4;
    	let t28;
    	let p5;
    	let i10;
    	let t29;
    	let t30;
    	let div11;
    	let t31;
    	let a6;
    	let t33;
    	let li3;
    	let a7;
    	let i11;
    	let t34;
    	let span4;
    	let t36;
    	let div17;
    	let span5;
    	let t38;
    	let div13;
    	let t39;
    	let a8;
    	let i12;
    	let t40;
    	let span6;
    	let t42;
    	let div14;
    	let t43;
    	let a9;
    	let i13;
    	let t44;
    	let span7;
    	let t46;
    	let div15;
    	let t47;
    	let a10;
    	let i14;
    	let t48;
    	let span8;
    	let t50;
    	let div16;
    	let t51;
    	let a11;
    	let t53;
    	let li4;
    	let a12;
    	let i15;
    	let i15_class_value;
    	let t54;
    	let div18;
    	let t55;
    	let li5;
    	let a13;
    	let i16;
    	let t56;
    	let li6;
    	let a14;
    	let i17;
    	let each_value = languages;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			div2 = element("div");
    			form = element("form");
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			i2 = element("i");
    			t3 = space();
    			button1 = element("button");
    			i3 = element("i");
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i4 = element("i");
    			t5 = space();
    			span0 = element("span");
    			span0.textContent = "3";
    			t7 = space();
    			div12 = element("div");
    			a3 = element("a");
    			div4 = element("div");
    			img0 = element("img");
    			t8 = space();
    			div3 = element("div");
    			h30 = element("h3");
    			t9 = text("Brad Diesel\r\n                ");
    			span1 = element("span");
    			i5 = element("i");
    			t10 = space();
    			p0 = element("p");
    			p0.textContent = "Call me whenever you can...";
    			t12 = space();
    			p1 = element("p");
    			i6 = element("i");
    			t13 = text(" 4 Hours Ago");
    			t14 = space();
    			div5 = element("div");
    			t15 = space();
    			a4 = element("a");
    			div7 = element("div");
    			img1 = element("img");
    			t16 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			t17 = text("John Pierce\r\n                ");
    			span2 = element("span");
    			i7 = element("i");
    			t18 = space();
    			p2 = element("p");
    			p2.textContent = "I got your message bro";
    			t20 = space();
    			p3 = element("p");
    			i8 = element("i");
    			t21 = text(" 4 Hours Ago");
    			t22 = space();
    			div8 = element("div");
    			t23 = space();
    			a5 = element("a");
    			div10 = element("div");
    			img2 = element("img");
    			t24 = space();
    			div9 = element("div");
    			h32 = element("h3");
    			t25 = text("Nora Silvester\r\n                ");
    			span3 = element("span");
    			i9 = element("i");
    			t26 = space();
    			p4 = element("p");
    			p4.textContent = "The subject goes here";
    			t28 = space();
    			p5 = element("p");
    			i10 = element("i");
    			t29 = text(" 4 Hours Ago");
    			t30 = space();
    			div11 = element("div");
    			t31 = space();
    			a6 = element("a");
    			a6.textContent = "See All Messages";
    			t33 = space();
    			li3 = element("li");
    			a7 = element("a");
    			i11 = element("i");
    			t34 = space();
    			span4 = element("span");
    			span4.textContent = "15";
    			t36 = space();
    			div17 = element("div");
    			span5 = element("span");
    			span5.textContent = "15 Notifications";
    			t38 = space();
    			div13 = element("div");
    			t39 = space();
    			a8 = element("a");
    			i12 = element("i");
    			t40 = text(" 4 new messages\r\n          ");
    			span6 = element("span");
    			span6.textContent = "3 mins";
    			t42 = space();
    			div14 = element("div");
    			t43 = space();
    			a9 = element("a");
    			i13 = element("i");
    			t44 = text(" 8 friend requests\r\n          ");
    			span7 = element("span");
    			span7.textContent = "12 hours";
    			t46 = space();
    			div15 = element("div");
    			t47 = space();
    			a10 = element("a");
    			i14 = element("i");
    			t48 = text(" 3 new reports\r\n          ");
    			span8 = element("span");
    			span8.textContent = "2 days";
    			t50 = space();
    			div16 = element("div");
    			t51 = space();
    			a11 = element("a");
    			a11.textContent = "See All Notifications";
    			t53 = space();
    			li4 = element("li");
    			a12 = element("a");
    			i15 = element("i");
    			t54 = space();
    			div18 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t55 = space();
    			li5 = element("li");
    			a13 = element("a");
    			i16 = element("i");
    			t56 = space();
    			li6 = element("li");
    			a14 = element("a");
    			i17 = element("i");
    			attr_dev(i0, "class", "fas fa-bars");
    			add_location(i0, file$f, 13, 9, 387);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "data-widget", "pushmenu");
    			attr_dev(a0, "href", '#');
    			attr_dev(a0, "role", "button");
    			add_location(a0, file$f, 12, 6, 309);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$f, 11, 4, 280);
    			attr_dev(ul0, "class", "navbar-nav");
    			add_location(ul0, file$f, 10, 2, 251);
    			attr_dev(i1, "class", "fas fa-search");
    			add_location(i1, file$f, 24, 8, 660);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "data-widget", "navbar-search");
    			attr_dev(a1, "href", '#');
    			attr_dev(a1, "role", "button");
    			add_location(a1, file$f, 23, 6, 577);
    			attr_dev(input, "class", "form-control form-control-navbar");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$f, 29, 12, 842);
    			attr_dev(i2, "class", "fas fa-search");
    			add_location(i2, file$f, 37, 16, 1145);
    			attr_dev(button0, "class", "btn btn-navbar");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$f, 36, 14, 1082);
    			attr_dev(i3, "class", "fas fa-times");
    			add_location(i3, file$f, 44, 16, 1371);
    			attr_dev(button1, "class", "btn btn-navbar");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-widget", "navbar-search");
    			add_location(button1, file$f, 39, 14, 1213);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$f, 35, 12, 1034);
    			attr_dev(div1, "class", "input-group input-group-sm");
    			add_location(div1, file$f, 28, 10, 788);
    			attr_dev(form, "class", "form-inline");
    			add_location(form, file$f, 27, 8, 750);
    			attr_dev(div2, "class", "navbar-search-block");
    			add_location(div2, file$f, 26, 6, 707);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$f, 22, 4, 548);
    			attr_dev(i4, "class", "far fa-comments");
    			add_location(i4, file$f, 55, 8, 1649);
    			attr_dev(span0, "class", "badge badge-danger navbar-badge");
    			add_location(span0, file$f, 56, 8, 1688);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "data-toggle", "dropdown");
    			attr_dev(a2, "href", '#');
    			add_location(a2, file$f, 54, 6, 1585);
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/admin/img/user1-128x128.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "User Avatar");
    			attr_dev(img0, "class", "img-size-50 mr-3 img-circle");
    			add_location(img0, file$f, 62, 12, 1951);
    			attr_dev(i5, "class", "fas fa-star");
    			add_location(i5, file$f, 71, 19, 2311);
    			attr_dev(span1, "class", "float-right text-sm text-danger");
    			add_location(span1, file$f, 70, 16, 2245);
    			attr_dev(h30, "class", "dropdown-item-title");
    			add_location(h30, file$f, 68, 14, 2166);
    			attr_dev(p0, "class", "text-sm");
    			add_location(p0, file$f, 74, 14, 2398);
    			attr_dev(i6, "class", "far fa-clock mr-1");
    			add_location(i6, file$f, 76, 16, 2512);
    			attr_dev(p1, "class", "text-sm text-muted");
    			add_location(p1, file$f, 75, 14, 2464);
    			attr_dev(div3, "class", "media-body");
    			add_location(div3, file$f, 67, 12, 2126);
    			attr_dev(div4, "class", "media");
    			add_location(div4, file$f, 61, 10, 1918);
    			attr_dev(a3, "href", '#');
    			attr_dev(a3, "class", "dropdown-item");
    			add_location(a3, file$f, 59, 8, 1836);
    			attr_dev(div5, "class", "dropdown-divider");
    			add_location(div5, file$f, 82, 8, 2669);
    			if (!src_url_equal(img1.src, img1_src_value = "/assets/admin/img/user8-128x128.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "User Avatar");
    			attr_dev(img1, "class", "img-size-50 img-circle mr-3");
    			add_location(img1, file$f, 86, 12, 2826);
    			attr_dev(i7, "class", "fas fa-star");
    			add_location(i7, file$f, 95, 19, 3185);
    			attr_dev(span2, "class", "float-right text-sm text-muted");
    			add_location(span2, file$f, 94, 16, 3120);
    			attr_dev(h31, "class", "dropdown-item-title");
    			add_location(h31, file$f, 92, 14, 3041);
    			attr_dev(p2, "class", "text-sm");
    			add_location(p2, file$f, 98, 14, 3272);
    			attr_dev(i8, "class", "far fa-clock mr-1");
    			add_location(i8, file$f, 100, 16, 3381);
    			attr_dev(p3, "class", "text-sm text-muted");
    			add_location(p3, file$f, 99, 14, 3333);
    			attr_dev(div6, "class", "media-body");
    			add_location(div6, file$f, 91, 12, 3001);
    			attr_dev(div7, "class", "media");
    			add_location(div7, file$f, 85, 10, 2793);
    			attr_dev(a4, "href", '#');
    			attr_dev(a4, "class", "dropdown-item");
    			add_location(a4, file$f, 83, 8, 2711);
    			attr_dev(div8, "class", "dropdown-divider");
    			add_location(div8, file$f, 106, 8, 3538);
    			if (!src_url_equal(img2.src, img2_src_value = "..//assets/admin/img/user3-128x128.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "User Avatar");
    			attr_dev(img2, "class", "img-size-50 img-circle mr-3");
    			add_location(img2, file$f, 110, 12, 3695);
    			attr_dev(i9, "class", "fas fa-star");
    			add_location(i9, file$f, 119, 19, 4062);
    			attr_dev(span3, "class", "float-right text-sm text-warning");
    			add_location(span3, file$f, 118, 16, 3995);
    			attr_dev(h32, "class", "dropdown-item-title");
    			add_location(h32, file$f, 116, 14, 3913);
    			attr_dev(p4, "class", "text-sm");
    			add_location(p4, file$f, 122, 14, 4149);
    			attr_dev(i10, "class", "far fa-clock mr-1");
    			add_location(i10, file$f, 124, 16, 4257);
    			attr_dev(p5, "class", "text-sm text-muted");
    			add_location(p5, file$f, 123, 14, 4209);
    			attr_dev(div9, "class", "media-body");
    			add_location(div9, file$f, 115, 12, 3873);
    			attr_dev(div10, "class", "media");
    			add_location(div10, file$f, 109, 10, 3662);
    			attr_dev(a5, "href", '#');
    			attr_dev(a5, "class", "dropdown-item");
    			add_location(a5, file$f, 107, 8, 3580);
    			attr_dev(div11, "class", "dropdown-divider");
    			add_location(div11, file$f, 130, 8, 4414);
    			attr_dev(a6, "href", '#');
    			attr_dev(a6, "class", "dropdown-item dropdown-footer");
    			add_location(a6, file$f, 131, 8, 4456);
    			attr_dev(div12, "class", "dropdown-menu dropdown-menu-lg dropdown-menu-right");
    			add_location(div12, file$f, 58, 6, 1762);
    			attr_dev(li2, "class", "nav-item dropdown");
    			add_location(li2, file$f, 53, 4, 1547);
    			attr_dev(i11, "class", "far fa-bell");
    			add_location(i11, file$f, 137, 8, 4703);
    			attr_dev(span4, "class", "badge badge-warning navbar-badge");
    			add_location(span4, file$f, 138, 8, 4738);
    			attr_dev(a7, "class", "nav-link");
    			attr_dev(a7, "data-toggle", "dropdown");
    			attr_dev(a7, "href", '#');
    			add_location(a7, file$f, 136, 6, 4639);
    			attr_dev(span5, "class", "dropdown-header");
    			add_location(span5, file$f, 141, 8, 4888);
    			attr_dev(div13, "class", "dropdown-divider");
    			add_location(div13, file$f, 142, 8, 4951);
    			attr_dev(i12, "class", "fas fa-envelope mr-2");
    			add_location(i12, file$f, 144, 10, 5041);
    			attr_dev(span6, "class", "float-right text-muted text-sm");
    			add_location(span6, file$f, 145, 10, 5102);
    			attr_dev(a8, "href", '#');
    			attr_dev(a8, "class", "dropdown-item");
    			add_location(a8, file$f, 143, 8, 4993);
    			attr_dev(div14, "class", "dropdown-divider");
    			add_location(div14, file$f, 147, 8, 5184);
    			attr_dev(i13, "class", "fas fa-users mr-2");
    			add_location(i13, file$f, 149, 10, 5274);
    			attr_dev(span7, "class", "float-right text-muted text-sm");
    			add_location(span7, file$f, 150, 10, 5335);
    			attr_dev(a9, "href", '#');
    			attr_dev(a9, "class", "dropdown-item");
    			add_location(a9, file$f, 148, 8, 5226);
    			attr_dev(div15, "class", "dropdown-divider");
    			add_location(div15, file$f, 152, 8, 5419);
    			attr_dev(i14, "class", "fas fa-file mr-2");
    			add_location(i14, file$f, 154, 10, 5509);
    			attr_dev(span8, "class", "float-right text-muted text-sm");
    			add_location(span8, file$f, 155, 10, 5565);
    			attr_dev(a10, "href", '#');
    			attr_dev(a10, "class", "dropdown-item");
    			add_location(a10, file$f, 153, 8, 5461);
    			attr_dev(div16, "class", "dropdown-divider");
    			add_location(div16, file$f, 157, 8, 5647);
    			attr_dev(a11, "href", '#');
    			attr_dev(a11, "class", "dropdown-item dropdown-footer");
    			add_location(a11, file$f, 158, 8, 5689);
    			attr_dev(div17, "class", "dropdown-menu dropdown-menu-lg dropdown-menu-right");
    			add_location(div17, file$f, 140, 6, 4814);
    			attr_dev(li3, "class", "nav-item dropdown");
    			add_location(li3, file$f, 135, 4, 4601);
    			attr_dev(i15, "class", i15_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0]);
    			add_location(i15, file$f, 165, 8, 5943);
    			attr_dev(a12, "class", "nav-link");
    			attr_dev(a12, "data-toggle", "dropdown");
    			attr_dev(a12, "href", '#');
    			attr_dev(a12, "aria-expanded", "false");
    			add_location(a12, file$f, 164, 6, 5857);
    			attr_dev(div18, "class", "dropdown-menu dropdown-menu-right p-0");
    			set_style(div18, "left", "inherit");
    			set_style(div18, "right", "0px");
    			add_location(div18, file$f, 167, 6, 6006);
    			attr_dev(li4, "class", "nav-item dropdown");
    			add_location(li4, file$f, 163, 4, 5819);
    			attr_dev(i16, "class", "fas fa-expand-arrows-alt");
    			add_location(i16, file$f, 181, 8, 6500);
    			attr_dev(a13, "class", "nav-link");
    			attr_dev(a13, "data-widget", "fullscreen");
    			attr_dev(a13, "href", '#');
    			attr_dev(a13, "role", "button");
    			add_location(a13, file$f, 180, 6, 6420);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file$f, 179, 4, 6391);
    			attr_dev(i17, "class", "fas fa-th-large");
    			add_location(i17, file$f, 192, 8, 6752);
    			attr_dev(a14, "class", "nav-link");
    			attr_dev(a14, "data-widget", "control-sidebar");
    			attr_dev(a14, "data-slide", "true");
    			attr_dev(a14, "href", '#');
    			attr_dev(a14, "role", "button");
    			add_location(a14, file$f, 185, 6, 6596);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file$f, 184, 4, 6567);
    			attr_dev(ul1, "class", "navbar-nav ml-auto");
    			add_location(ul1, file$f, 19, 2, 481);
    			attr_dev(nav, "class", "main-header navbar navbar-expand navbar-white navbar-light");
    			add_location(nav, file$f, 8, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(nav, t0);
    			append_dev(nav, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(li1, t1);
    			append_dev(li1, div2);
    			append_dev(div2, form);
    			append_dev(form, div1);
    			append_dev(div1, input);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, i3);
    			append_dev(ul1, t4);
    			append_dev(ul1, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i4);
    			append_dev(a2, t5);
    			append_dev(a2, span0);
    			append_dev(li2, t7);
    			append_dev(li2, div12);
    			append_dev(div12, a3);
    			append_dev(a3, div4);
    			append_dev(div4, img0);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, h30);
    			append_dev(h30, t9);
    			append_dev(h30, span1);
    			append_dev(span1, i5);
    			append_dev(div3, t10);
    			append_dev(div3, p0);
    			append_dev(div3, t12);
    			append_dev(div3, p1);
    			append_dev(p1, i6);
    			append_dev(p1, t13);
    			append_dev(div12, t14);
    			append_dev(div12, div5);
    			append_dev(div12, t15);
    			append_dev(div12, a4);
    			append_dev(a4, div7);
    			append_dev(div7, img1);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, h31);
    			append_dev(h31, t17);
    			append_dev(h31, span2);
    			append_dev(span2, i7);
    			append_dev(div6, t18);
    			append_dev(div6, p2);
    			append_dev(div6, t20);
    			append_dev(div6, p3);
    			append_dev(p3, i8);
    			append_dev(p3, t21);
    			append_dev(div12, t22);
    			append_dev(div12, div8);
    			append_dev(div12, t23);
    			append_dev(div12, a5);
    			append_dev(a5, div10);
    			append_dev(div10, img2);
    			append_dev(div10, t24);
    			append_dev(div10, div9);
    			append_dev(div9, h32);
    			append_dev(h32, t25);
    			append_dev(h32, span3);
    			append_dev(span3, i9);
    			append_dev(div9, t26);
    			append_dev(div9, p4);
    			append_dev(div9, t28);
    			append_dev(div9, p5);
    			append_dev(p5, i10);
    			append_dev(p5, t29);
    			append_dev(div12, t30);
    			append_dev(div12, div11);
    			append_dev(div12, t31);
    			append_dev(div12, a6);
    			append_dev(ul1, t33);
    			append_dev(ul1, li3);
    			append_dev(li3, a7);
    			append_dev(a7, i11);
    			append_dev(a7, t34);
    			append_dev(a7, span4);
    			append_dev(li3, t36);
    			append_dev(li3, div17);
    			append_dev(div17, span5);
    			append_dev(div17, t38);
    			append_dev(div17, div13);
    			append_dev(div17, t39);
    			append_dev(div17, a8);
    			append_dev(a8, i12);
    			append_dev(a8, t40);
    			append_dev(a8, span6);
    			append_dev(div17, t42);
    			append_dev(div17, div14);
    			append_dev(div17, t43);
    			append_dev(div17, a9);
    			append_dev(a9, i13);
    			append_dev(a9, t44);
    			append_dev(a9, span7);
    			append_dev(div17, t46);
    			append_dev(div17, div15);
    			append_dev(div17, t47);
    			append_dev(div17, a10);
    			append_dev(a10, i14);
    			append_dev(a10, t48);
    			append_dev(a10, span8);
    			append_dev(div17, t50);
    			append_dev(div17, div16);
    			append_dev(div17, t51);
    			append_dev(div17, a11);
    			append_dev(ul1, t53);
    			append_dev(ul1, li4);
    			append_dev(li4, a12);
    			append_dev(a12, i15);
    			append_dev(li4, t54);
    			append_dev(li4, div18);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div18, null);
    			}

    			append_dev(ul1, t55);
    			append_dev(ul1, li5);
    			append_dev(li5, a13);
    			append_dev(a13, i16);
    			append_dev(ul1, t56);
    			append_dev(ul1, li6);
    			append_dev(li6, a14);
    			append_dev(a14, i17);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$locale*/ 1 && i15_class_value !== (i15_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0])) {
    				attr_dev(i15, "class", i15_class_value);
    			}

    			if (dirty & /*setLocale, languages*/ 2) {
    				each_value = languages;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div18, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $locale;
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(0, $locale = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);

    	function setLocale(lang) {
    		set_store_value(locale, $locale = lang, $locale);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = lang => setLocale(lang);

    	$$self.$capture_state = () => ({
    		languages,
    		locale,
    		__,
    		setLocale,
    		$locale
    	});

    	return [$locale, setLocale, click_handler];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\layouts\MainSidebar.svelte generated by Svelte v3.46.6 */

    const { console: console_1$1 } = globals;
    const file$e = "src\\layouts\\MainSidebar.svelte";

    // (87:10) <Link              to="/{route.admin}"              class="nav-link {url[1] === 'admin' && !url.hasOwnProperty(2)                ? 'active'                : ''}"            >
    function create_default_slot_2$1(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[1]("title.dashboard") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-th");
    			add_location(i, file$e, 92, 12, 2713);
    			add_location(p, file$e, 93, 12, 2759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 2 && t1_value !== (t1_value = /*$__*/ ctx[1]("title.dashboard") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(87:10) <Link              to=\\\"/{route.admin}\\\"              class=\\\"nav-link {url[1] === 'admin' && !url.hasOwnProperty(2)                ? 'active'                : ''}\\\"            >",
    		ctx
    	});

    	return block;
    }

    // (100:10) <Link              to="/{route.admin}/{route.users}"              class="nav-link {url[1] === 'admin' &&              (url[2] === 'users' || url[2] === 'user')                ? 'active'                : ''}"            >
    function create_default_slot_1$1(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[1]("title.users") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-users");
    			add_location(i, file$e, 106, 12, 3149);
    			add_location(p, file$e, 107, 12, 3198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 2 && t1_value !== (t1_value = /*$__*/ ctx[1]("title.users") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(100:10) <Link              to=\\\"/{route.admin}/{route.users}\\\"              class=\\\"nav-link {url[1] === 'admin' &&              (url[2] === 'users' || url[2] === 'user')                ? 'active'                : ''}\\\"            >",
    		ctx
    	});

    	return block;
    }

    // (132:14) <Link                  to="/{route.admin}/{route.layouts}"                  class="nav-link {url[1] === 'admin' && url[2] === 'layouts'                    ? 'active'                    : ''}"                >
    function create_default_slot$3(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[1]("title.layouts") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-table-columns");
    			add_location(i, file$e, 137, 16, 4142);
    			add_location(p, file$e, 138, 16, 4203);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 2 && t1_value !== (t1_value = /*$__*/ ctx[1]("title.layouts") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(132:14) <Link                  to=\\\"/{route.admin}/{route.layouts}\\\"                  class=\\\"nav-link {url[1] === 'admin' && url[2] === 'layouts'                    ? 'active'                    : ''}\\\"                >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let aside;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t2;
    	let div3;
    	let div2;
    	let div1;
    	let input;
    	let input_placeholder_value;
    	let t3;
    	let div0;
    	let button;
    	let i0;
    	let t4;
    	let nav;
    	let ul1;
    	let li0;
    	let link0;
    	let t5;
    	let li1;
    	let link1;
    	let t6;
    	let li3;
    	let a1;
    	let i1;
    	let t7;
    	let p0;
    	let t8_value = /*$__*/ ctx[1]("title.options") + "";
    	let t8;
    	let t9;
    	let i2;
    	let a1_class_value;
    	let t10;
    	let ul0;
    	let li2;
    	let link2;
    	let li3_class_value;
    	let t11;
    	let li4;
    	let a2;
    	let i3;
    	let t12;
    	let p1;
    	let t13_value = /*$__*/ ctx[1]("title.logout") + "";
    	let t13;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				to: "/" + route.admin,
    				class: "nav-link " + (/*url*/ ctx[0][1] === 'admin' && !/*url*/ ctx[0].hasOwnProperty(2)
    				? 'active'
    				: ''),
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/" + route.admin + "/" + route.users,
    				class: "nav-link " + (/*url*/ ctx[0][1] === 'admin' && (/*url*/ ctx[0][2] === 'users' || /*url*/ ctx[0][2] === 'user')
    				? 'active'
    				: ''),
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/" + route.admin + "/" + route.layouts,
    				class: "nav-link " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    				? 'active'
    				: ''),
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			span.textContent = "AdminLTE 3";
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t3 = space();
    			div0 = element("div");
    			button = element("button");
    			i0 = element("i");
    			t4 = space();
    			nav = element("nav");
    			ul1 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t5 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t6 = space();
    			li3 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t7 = space();
    			p0 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			i2 = element("i");
    			t10 = space();
    			ul0 = element("ul");
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t11 = space();
    			li4 = element("li");
    			a2 = element("a");
    			i3 = element("i");
    			t12 = space();
    			p1 = element("p");
    			t13 = text(t13_value);
    			if (!src_url_equal(img.src, img_src_value = "" + (APP_ROOT + "/assets/admin/img/AdminLTELogo.png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "AdminLTE Logo");
    			attr_dev(img, "class", "brand-image img-circle elevation-3");
    			set_style(img, "opacity", "0.8");
    			add_location(img, file$e, 46, 4, 1260);
    			attr_dev(span, "class", "brand-text font-weight-light");
    			add_location(span, file$e, 52, 4, 1441);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "brand-link " + /*auth*/ ctx[2].options.theme_brand_logo_bg);
    			add_location(a0, file$e, 45, 2, 1188);
    			attr_dev(input, "class", "form-control form-control-sidebar");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$__*/ ctx[1]("any.search"));
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$e, 60, 8, 1697);
    			attr_dev(i0, "class", "fas fa-search fa-fw");
    			add_location(i0, file$e, 68, 12, 1967);
    			attr_dev(button, "class", "btn btn-sidebar");
    			add_location(button, file$e, 67, 10, 1921);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$e, 66, 8, 1877);
    			attr_dev(div1, "class", "input-group");
    			attr_dev(div1, "data-widget", "sidebar-search");
    			add_location(div1, file$e, 59, 6, 1633);
    			attr_dev(div2, "class", "form-inline mt-3");
    			add_location(div2, file$e, 58, 4, 1595);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$e, 85, 8, 2474);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$e, 98, 8, 2864);
    			attr_dev(i1, "class", "nav-icon fa-solid fa-gears");
    			add_location(i1, file$e, 123, 12, 3624);
    			attr_dev(i2, "class", "right fas fa-angle-left");
    			add_location(i2, file$e, 126, 14, 3735);
    			add_location(p0, file$e, 124, 12, 3678);
    			attr_dev(a1, "href", "#");

    			attr_dev(a1, "class", a1_class_value = "nav-link " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    			? 'active'
    			: ''));

    			add_location(a1, file$e, 117, 10, 3450);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$e, 130, 12, 3861);
    			attr_dev(ul0, "class", "nav nav-treeview");
    			add_location(ul0, file$e, 129, 10, 3818);

    			attr_dev(li3, "class", li3_class_value = "nav-item " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    			? 'menu-open active'
    			: ''));

    			add_location(li3, file$e, 112, 8, 3299);
    			attr_dev(i3, "class", "nav-icon fa-solid fa-power-off text-danger");
    			add_location(i3, file$e, 147, 12, 4450);
    			attr_dev(p1, "class", "text");
    			add_location(p1, file$e, 148, 12, 4520);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "nav-link");
    			add_location(a2, file$e, 146, 10, 4387);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file$e, 145, 8, 4354);
    			attr_dev(ul1, "class", "nav nav-pills nav-sidebar flex-column " + /*auth*/ ctx[2].options.theme_main_sidebar_nav_style);
    			attr_dev(ul1, "data-widget", "treeview");
    			attr_dev(ul1, "role", "menu");
    			attr_dev(ul1, "data-accordion", "false");
    			add_location(ul1, file$e, 76, 6, 2124);
    			attr_dev(nav, "class", "mt-2");
    			add_location(nav, file$e, 75, 4, 2098);
    			attr_dev(div3, "class", "sidebar");
    			add_location(div3, file$e, 56, 2, 1535);
    			attr_dev(aside, "class", "main-sidebar elevation-4 " + /*auth*/ ctx[2].options.theme_main_sidebar_expand + " " + /*auth*/ ctx[2].options.theme_main_sidebar_bg);
    			add_location(aside, file$e, 40, 0, 1032);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, a0);
    			append_dev(a0, img);
    			append_dev(a0, t0);
    			append_dev(a0, span);
    			append_dev(aside, t2);
    			append_dev(aside, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, i0);
    			append_dev(div3, t4);
    			append_dev(div3, nav);
    			append_dev(nav, ul1);
    			append_dev(ul1, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul1, t5);
    			append_dev(ul1, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li3);
    			append_dev(li3, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t7);
    			append_dev(a1, p0);
    			append_dev(p0, t8);
    			append_dev(p0, t9);
    			append_dev(p0, i2);
    			append_dev(li3, t10);
    			append_dev(li3, ul0);
    			append_dev(ul0, li2);
    			mount_component(link2, li2, null);
    			append_dev(ul1, t11);
    			append_dev(ul1, li4);
    			append_dev(li4, a2);
    			append_dev(a2, i3);
    			append_dev(a2, t12);
    			append_dev(a2, p1);
    			append_dev(p1, t13);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*setUrl*/ ctx[3], false, false, false),
    					listen_dev(li1, "click", /*setUrl*/ ctx[3], false, false, false),
    					listen_dev(li2, "click", /*setUrl*/ ctx[3], false, false, false),
    					listen_dev(a2, "click", /*logout*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$__*/ 2 && input_placeholder_value !== (input_placeholder_value = /*$__*/ ctx[1]("any.search"))) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			const link0_changes = {};

    			if (dirty & /*url*/ 1) link0_changes.class = "nav-link " + (/*url*/ ctx[0][1] === 'admin' && !/*url*/ ctx[0].hasOwnProperty(2)
    			? 'active'
    			: '');

    			if (dirty & /*$$scope, $__*/ 66) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*url*/ 1) link1_changes.class = "nav-link " + (/*url*/ ctx[0][1] === 'admin' && (/*url*/ ctx[0][2] === 'users' || /*url*/ ctx[0][2] === 'user')
    			? 'active'
    			: '');

    			if (dirty & /*$$scope, $__*/ 66) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			if ((!current || dirty & /*$__*/ 2) && t8_value !== (t8_value = /*$__*/ ctx[1]("title.options") + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*url*/ 1 && a1_class_value !== (a1_class_value = "nav-link " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    			? 'active'
    			: ''))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			const link2_changes = {};

    			if (dirty & /*url*/ 1) link2_changes.class = "nav-link " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    			? 'active'
    			: '');

    			if (dirty & /*$$scope, $__*/ 66) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);

    			if (!current || dirty & /*url*/ 1 && li3_class_value !== (li3_class_value = "nav-item " + (/*url*/ ctx[0][1] === 'admin' && /*url*/ ctx[0][2] === 'layouts'
    			? 'menu-open active'
    			: ''))) {
    				attr_dev(li3, "class", li3_class_value);
    			}

    			if ((!current || dirty & /*$__*/ 2) && t13_value !== (t13_value = /*$__*/ ctx[1]("title.logout") + "")) set_data_dev(t13, t13_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let url;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainSidebar', slots, []);
    	const auth = getSessionItem("auth");

    	function setUrl() {
    		$$invalidate(0, url = window.location.pathname.split("/"));
    	}

    	let bodyClass = "sidebar-mini " + auth.options.theme_main_sidebar_collapsed + " " + auth.options.theme_text_size + " " + auth.options.theme_main_fixed + " " + auth.options.theme_navbar_fixed + " " + auth.options.theme_footer_fixed;
    	document.body.classList = bodyClass;

    	async function logout() {
    		const response = await deleteUserDetails(auth.access_token);

    		if (response) {
    			console.log(response);
    			navigate$1("/login");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MainSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		APP_ROOT,
    		Link: Link$1,
    		navigate: navigate$1,
    		__,
    		route,
    		getSessionItem,
    		deleteUserDetails,
    		auth,
    		setUrl,
    		bodyClass,
    		logout,
    		url,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('bodyClass' in $$props) bodyClass = $$props.bodyClass;
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, url = window.location.pathname.split("/"));
    	return [url, $__, auth, setUrl, logout];
    }

    class MainSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainSidebar",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\layouts\ControlSidebar.svelte generated by Svelte v3.46.6 */
    const file$d = "src\\layouts\\ControlSidebar.svelte";

    function create_fragment$d(ctx) {
    	let aside;
    	let div;
    	let h5;
    	let t0_value = /*$__*/ ctx[0]('any.title') + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*$__*/ ctx[0]('any.content') + "";
    	let t2;

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			add_location(h5, file$d, 7, 4, 193);
    			add_location(p, file$d, 8, 4, 226);
    			attr_dev(div, "class", "p-3");
    			add_location(div, file$d, 6, 2, 170);
    			attr_dev(aside, "class", "control-sidebar control-sidebar-dark");
    			add_location(aside, file$d, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 1 && t0_value !== (t0_value = /*$__*/ ctx[0]('any.title') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$__*/ 1 && t2_value !== (t2_value = /*$__*/ ctx[0]('any.content') + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ControlSidebar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ControlSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __, $__ });
    	return [$__];
    }

    class ControlSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ControlSidebar",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\layouts\Footer.svelte generated by Svelte v3.46.6 */
    const file$c = "src\\layouts\\Footer.svelte";

    function create_fragment$c(ctx) {
    	let footer;
    	let div;
    	let t0_value = /*$__*/ ctx[0]('footer.text') + "";
    	let t0;
    	let t1;
    	let strong;
    	let t2_value = /*$__*/ ctx[0]('footer.copyright') + "";
    	let t2;
    	let t3;
    	let a;
    	let t5;
    	let t6;
    	let t7_value = /*$__*/ ctx[0]('footer.rights') + "";
    	let t7;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			strong = element("strong");
    			t2 = text(t2_value);
    			t3 = text(" © 2014-2021 ");
    			a = element("a");
    			a.textContent = "AdminLTE.io";
    			t5 = text(".");
    			t6 = space();
    			t7 = text(t7_value);
    			attr_dev(div, "class", "float-right d-none d-sm-inline");
    			add_location(div, file$c, 6, 2, 125);
    			attr_dev(a, "href", "https://adminlte.io");
    			add_location(a, file$c, 8, 53, 282);
    			add_location(strong, file$c, 8, 2, 231);
    			attr_dev(footer, "class", "main-footer");
    			add_location(footer, file$c, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, t0);
    			append_dev(footer, t1);
    			append_dev(footer, strong);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(strong, a);
    			append_dev(strong, t5);
    			append_dev(footer, t6);
    			append_dev(footer, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 1 && t0_value !== (t0_value = /*$__*/ ctx[0]('footer.text') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$__*/ 1 && t2_value !== (t2_value = /*$__*/ ctx[0]('footer.copyright') + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$__*/ 1 && t7_value !== (t7_value = /*$__*/ ctx[0]('footer.rights') + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __, $__ });
    	return [$__];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\Breadcrump.svelte generated by Svelte v3.46.6 */
    const file$b = "src\\components\\Breadcrump.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (20:14) <Link to="/{item.pageUrl}">
    function create_default_slot$2(ctx) {
    	let t_value = /*item*/ ctx[3].pageTitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 2 && t_value !== (t_value = /*item*/ ctx[3].pageTitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(20:14) <Link to=\\\"/{item.pageUrl}\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:10) {#each links as item}
    function create_each_block$5(ctx) {
    	let li;
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: "/" + /*item*/ ctx[3].pageUrl,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			attr_dev(li, "class", "breadcrumb-item");
    			add_location(li, file$b, 18, 12, 451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*links*/ 2) link_changes.to = "/" + /*item*/ ctx[3].pageUrl;

    			if (dirty & /*$$scope, links*/ 66) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(18:10) {#each links as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let div1;
    	let ol;
    	let t2;
    	let li;
    	let t3;
    	let current;
    	let each_value = /*links*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li = element("li");
    			t3 = text(/*active*/ ctx[2]);
    			attr_dev(h1, "class", "m-0");
    			add_location(h1, file$b, 12, 8, 262);
    			attr_dev(div0, "class", "col-sm-6");
    			add_location(div0, file$b, 11, 6, 230);
    			attr_dev(li, "class", "breadcrumb-item active");
    			add_location(li, file$b, 22, 10, 595);
    			attr_dev(ol, "class", "breadcrumb float-sm-right");
    			add_location(ol, file$b, 16, 8, 366);
    			attr_dev(div1, "class", "col-sm-6");
    			add_location(div1, file$b, 15, 6, 334);
    			attr_dev(div2, "class", "row mb-2");
    			add_location(div2, file$b, 10, 4, 200);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$b, 9, 2, 165);
    			attr_dev(div4, "class", "content-header");
    			add_location(div4, file$b, 8, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append_dev(ol, t2);
    			append_dev(ol, li);
    			append_dev(li, t3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*links*/ 2) {
    				each_value = /*links*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ol, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*active*/ 4) set_data_dev(t3, /*active*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breadcrump', slots, []);
    	let { title } = $$props;
    	let { links } = $$props;
    	let { active } = $$props;
    	const writable_props = ['title', 'links', 'active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breadcrump> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ Link: Link$1, title, links, active });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, links, active];
    }

    class Breadcrump extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { title: 0, links: 1, active: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrump",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'title'");
    		}

    		if (/*links*/ ctx[1] === undefined && !('links' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'links'");
    		}

    		if (/*active*/ ctx[2] === undefined && !('active' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'active'");
    		}
    	}

    	get title() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Limit.svelte generated by Svelte v3.46.6 */
    const file$a = "src\\Components\\Limit.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (23:5) {#each limits as item}
    function create_each_block$4(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*item*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$a, 23, 6, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(23:5) {#each limits as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let p;
    	let t0_value = /*$__*/ ctx[1]("any.shownRecord") + "";
    	let t0;
    	let t1;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*limits*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(p, "width", "100px");
    			attr_dev(p, "class", "d-inline");
    			add_location(p, file$a, 16, 2, 327);
    			attr_dev(select, "class", "form-control form-control-sm d-inline mx-2");
    			set_style(select, "width", "65px");
    			if (/*limit*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$a, 17, 2, 399);
    			attr_dev(div, "class", "float-left");
    			add_location(div, file$a, 15, 0, 299);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*limit*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(select, "change", /*setLimit*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 2 && t0_value !== (t0_value = /*$__*/ ctx[1]("any.shownRecord") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*limits*/ 4) {
    				each_value = /*limits*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*limit, limits*/ 5) {
    				select_option(select, /*limit*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Limit', slots, []);
    	const dispatch = createEventDispatcher();
    	const limits = [10, 25, 50, 100];
    	let { limit } = $$props;

    	const setLimit = () => {
    		dispatch("limit", { limit });
    	};

    	const writable_props = ['limit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Limit> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		limit = select_value(this);
    		$$invalidate(0, limit);
    		$$invalidate(2, limits);
    	}

    	$$self.$$set = $$props => {
    		if ('limit' in $$props) $$invalidate(0, limit = $$props.limit);
    	};

    	$$self.$capture_state = () => ({
    		__,
    		createEventDispatcher,
    		dispatch,
    		limits,
    		limit,
    		setLimit,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('limit' in $$props) $$invalidate(0, limit = $$props.limit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [limit, $__, limits, setLimit, select_change_handler];
    }

    class Limit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { limit: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Limit",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*limit*/ ctx[0] === undefined && !('limit' in props)) {
    			console.warn("<Limit> was created without expected prop 'limit'");
    		}
    	}

    	get limit() {
    		throw new Error("<Limit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<Limit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Pagination.svelte generated by Svelte v3.46.6 */
    const file$9 = "src\\Components\\Pagination.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (28:4) {:else}
    function create_else_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "«";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			add_location(button, file$9, 28, 6, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(28:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if page === 1}
    function create_if_block_3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "«";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			set_style(button, "background-color", "whitesmoke");
    			button.disabled = true;
    			add_location(button, file$9, 21, 6, 481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(21:4) {#if page === 1}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#if i > 0}
    function create_if_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*i*/ ctx[11] === /*page*/ ctx[0]) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(39:4) {#if i > 0}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {:else}
    function create_else_block_1(ctx) {
    	let li;
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t = text(/*i*/ ctx[11]);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			add_location(button, file$9, 50, 10, 1170);
    			attr_dev(li, "class", "page-item");
    			add_location(li, file$9, 49, 8, 1136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(49:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if i === page}
    function create_if_block_2(ctx) {
    	let li;
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t = text(/*i*/ ctx[11]);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			set_style(button, "background-color", "whitesmoke");
    			button.disabled = true;
    			add_location(button, file$9, 41, 10, 933);
    			attr_dev(li, "class", "page-item");
    			add_location(li, file$9, 40, 8, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(40:6) {#if i === page}",
    		ctx
    	});

    	return block;
    }

    // (38:2) {#each Array(totalPage + 1) as _, i}
    function create_each_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[11] > 0 && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[11] > 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(38:2) {#each Array(totalPage + 1) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "»";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			add_location(button, file$9, 70, 6, 1610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(70:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if page === totalPage}
    function create_if_block$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "»";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "page-link");
    			set_style(button, "background-color", "whitesmoke");
    			button.disabled = true;
    			add_location(button, file$9, 63, 6, 1448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:4) {#if page === totalPage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let ul;
    	let li0;
    	let t0;
    	let t1;
    	let li1;

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[0] === 1) return create_if_block_3;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let each_value = Array(/*totalPage*/ ctx[1] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (/*page*/ ctx[0] === /*totalPage*/ ctx[1]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			if_block0.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			li1 = element("li");
    			if_block1.c();
    			attr_dev(li0, "class", "page-item");
    			add_location(li0, file$9, 19, 2, 429);
    			attr_dev(li1, "class", "page-item");
    			add_location(li1, file$9, 61, 2, 1388);
    			attr_dev(ul, "class", "pagination pagination-sm m-0 float-right");
    			add_location(ul, file$9, 18, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			if_block0.m(li0, null);
    			append_dev(ul, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			if_block1.m(li1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(li0, null);
    				}
    			}

    			if (dirty & /*page, setPage, totalPage*/ 7) {
    				each_value = Array(/*totalPage*/ ctx[1] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(li1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let totalPage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	const dispatch = createEventDispatcher();
    	let { page } = $$props;
    	let { total } = $$props;
    	let { limit } = $$props;

    	const setPage = number => {
    		$$invalidate(0, page = number);
    		dispatch("page", { page });
    	};

    	const writable_props = ['page', 'total', 'limit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setPage(page - 1);
    	};

    	const click_handler_1 = i => {
    		setPage(i);
    	};

    	const click_handler_2 = () => {
    		setPage(page + 1);
    	};

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('total' in $$props) $$invalidate(3, total = $$props.total);
    		if ('limit' in $$props) $$invalidate(4, limit = $$props.limit);
    	};

    	$$self.$capture_state = () => ({
    		__,
    		createEventDispatcher,
    		dispatch,
    		page,
    		total,
    		limit,
    		setPage,
    		totalPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('total' in $$props) $$invalidate(3, total = $$props.total);
    		if ('limit' in $$props) $$invalidate(4, limit = $$props.limit);
    		if ('totalPage' in $$props) $$invalidate(1, totalPage = $$props.totalPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*total, limit*/ 24) {
    			$$invalidate(1, totalPage = Math.ceil(total / limit));
    		}
    	};

    	return [
    		page,
    		totalPage,
    		setPage,
    		total,
    		limit,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { page: 0, total: 3, limit: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*page*/ ctx[0] === undefined && !('page' in props)) {
    			console.warn("<Pagination> was created without expected prop 'page'");
    		}

    		if (/*total*/ ctx[3] === undefined && !('total' in props)) {
    			console.warn("<Pagination> was created without expected prop 'total'");
    		}

    		if (/*limit*/ ctx[4] === undefined && !('limit' in props)) {
    			console.warn("<Pagination> was created without expected prop 'limit'");
    		}
    	}

    	get page() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get total() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Search.svelte generated by Svelte v3.46.6 */
    const file$8 = "src\\Components\\Search.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let input;
    	let input_placeholder_value;
    	let t;
    	let div0;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t = space();
    			div0 = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "table_search");
    			attr_dev(input, "class", "form-control float-right");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$__*/ ctx[1]("any.search"));
    			add_location(input, file$8, 14, 2, 347);
    			attr_dev(i, "class", "fas fa-search");
    			add_location(i, file$8, 24, 6, 619);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-default");
    			add_location(button, file$8, 23, 4, 545);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$8, 22, 2, 507);
    			attr_dev(div1, "class", "input-group input-group-sm m-0 float-right");
    			set_style(div1, "width", "300px");
    			add_location(div1, file$8, 13, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			set_input_value(input, /*search*/ ctx[0]);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(button, "click", /*onSearch*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 2 && input_placeholder_value !== (input_placeholder_value = /*$__*/ ctx[1]("any.search"))) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*search*/ 1 && input.value !== /*search*/ ctx[0]) {
    				set_input_value(input, /*search*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const dispatch = createEventDispatcher();
    	let { search } = $$props;

    	const onSearch = () => {
    		dispatch("search", { search });
    	};

    	const writable_props = ['search'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(0, search);
    	}

    	$$self.$$set = $$props => {
    		if ('search' in $$props) $$invalidate(0, search = $$props.search);
    	};

    	$$self.$capture_state = () => ({
    		__,
    		createEventDispatcher,
    		dispatch,
    		search,
    		onSearch,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('search' in $$props) $$invalidate(0, search = $$props.search);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [search, $__, onSearch, input_input_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { search: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*search*/ ctx[0] === undefined && !('search' in props)) {
    			console.warn("<Search> was created without expected prop 'search'");
    		}
    	}

    	get search() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Tbody.svelte generated by Svelte v3.46.6 */

    const file$7 = "src\\Components\\Tbody.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (10:6) {#each keys as key}
    function create_each_block_1(ctx) {
    	let td;
    	let t_value = /*row*/ ctx[2][/*key*/ ctx[5]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$7, 10, 8, 154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows, keys*/ 3 && t_value !== (t_value = /*row*/ ctx[2][/*key*/ ctx[5]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(10:6) {#each keys as key}",
    		ctx
    	});

    	return block;
    }

    // (8:2) {#each JSON.parse(rows) as row}
    function create_each_block$2(ctx) {
    	let tr;
    	let t0;
    	let td;
    	let a0;
    	let i0;
    	let t1;
    	let a1;
    	let i1;
    	let t2;
    	let each_value_1 = /*keys*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			td = element("td");
    			a0 = element("a");
    			i0 = element("i");
    			t1 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t2 = space();
    			attr_dev(i0, "class", "fa-solid fa-pen ");
    			add_location(i0, file$7, 14, 11, 267);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "btn btn-primary btn-xs");
    			add_location(a0, file$7, 13, 8, 210);
    			attr_dev(i1, "class", "fa-solid fa-xmark fa-lg");
    			add_location(i1, file$7, 20, 11, 442);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "btn btn-danger btn-xs");
    			set_style(a1, "padding", ".125rem .4rem");
    			add_location(a1, file$7, 16, 8, 321);
    			add_location(td, file$7, 12, 6, 196);
    			add_location(tr, file$7, 8, 4, 113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t0);
    			append_dev(tr, td);
    			append_dev(td, a0);
    			append_dev(a0, i0);
    			append_dev(td, t1);
    			append_dev(td, a1);
    			append_dev(a1, i1);
    			append_dev(tr, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*JSON, rows, keys*/ 3) {
    				each_value_1 = /*keys*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:2) {#each JSON.parse(rows) as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let tbody;
    	let each_value = JSON.parse(/*rows*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$7, 6, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*keys, JSON, rows*/ 3) {
    				each_value = JSON.parse(/*rows*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tbody', slots, []);
    	let { rows } = $$props;
    	let { keys } = $$props;
    	const writable_props = ['rows', 'keys'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tbody> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('rows' in $$props) $$invalidate(0, rows = $$props.rows);
    		if ('keys' in $$props) $$invalidate(1, keys = $$props.keys);
    	};

    	$$self.$capture_state = () => ({ rows, keys });

    	$$self.$inject_state = $$props => {
    		if ('rows' in $$props) $$invalidate(0, rows = $$props.rows);
    		if ('keys' in $$props) $$invalidate(1, keys = $$props.keys);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [rows, keys];
    }

    class Tbody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { rows: 0, keys: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tbody",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rows*/ ctx[0] === undefined && !('rows' in props)) {
    			console.warn("<Tbody> was created without expected prop 'rows'");
    		}

    		if (/*keys*/ ctx[1] === undefined && !('keys' in props)) {
    			console.warn("<Tbody> was created without expected prop 'keys'");
    		}
    	}

    	get rows() {
    		throw new Error("<Tbody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Tbody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keys() {
    		throw new Error("<Tbody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<Tbody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Thead.svelte generated by Svelte v3.46.6 */
    const file$6 = "src\\Components\\Thead.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (56:10) {:else}
    function create_else_block(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[3].unsorted.html + "";

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", /*labels*/ ctx[3].unsorted.title);
    			add_location(span, file$6, 56, 12, 1247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(56:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:34) 
    function create_if_block_1(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[3].desc.html + "";

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", /*labels*/ ctx[3].desc.title);
    			add_location(span, file$6, 52, 12, 1121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(52:34) ",
    		ctx
    	});

    	return block;
    }

    // (48:10) {#if by === "asc"}
    function create_if_block(ctx) {
    	let span;
    	let raw_value = /*labels*/ ctx[3].asc.html + "";

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "title", /*labels*/ ctx[3].asc.title);
    			add_location(span, file$6, 48, 12, 980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(48:10) {#if by === \\\"asc\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#each titles as title, i}
    function create_each_block$1(ctx) {
    	let th;
    	let t0_value = /*title*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let span;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*by*/ ctx[0] === "asc") return create_if_block;
    		if (/*by*/ ctx[0] === "desc") return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "class", "sort svelte-1o51gj7");
    			add_location(span, file$6, 41, 8, 821);
    			attr_dev(th, "class", "svelte-1o51gj7");
    			add_location(th, file$6, 39, 6, 790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			append_dev(th, span);
    			if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*titles*/ 2 && t0_value !== (t0_value = /*title*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:4) {#each titles as title, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let thead;
    	let tr;
    	let t;
    	let th;
    	let each_value = /*titles*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			th = element("th");
    			set_style(th, "width", "100px");
    			attr_dev(th, "class", "svelte-1o51gj7");
    			add_location(th, file$6, 63, 4, 1414);
    			add_location(tr, file$6, 37, 2, 746);
    			add_location(thead, file$6, 36, 0, 735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			append_dev(tr, th);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*setOrder, keys, labels, by, titles*/ 31) {
    				each_value = /*titles*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Thead', slots, []);
    	const dispatch = createEventDispatcher();
    	let { titles } = $$props;
    	let { keys } = $$props;
    	let { order } = $$props;
    	let { by } = $$props;

    	let labels = {
    		asc: { title: "Ascending", html: "&#8593;" },
    		desc: { title: "Desceding", html: "&#8595;" },
    		unsorted: { title: "Unsorted", html: "&#8645;" }
    	};

    	const setOrder = key => {
    		$$invalidate(0, by = by === "asc" ? "desc" : "asc");
    		$$invalidate(5, order = key);
    		dispatch("order", { order, by });
    	};

    	const writable_props = ['titles', 'keys', 'order', 'by'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thead> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => {
    		setOrder(keys[i]);
    	};

    	$$self.$$set = $$props => {
    		if ('titles' in $$props) $$invalidate(1, titles = $$props.titles);
    		if ('keys' in $$props) $$invalidate(2, keys = $$props.keys);
    		if ('order' in $$props) $$invalidate(5, order = $$props.order);
    		if ('by' in $$props) $$invalidate(0, by = $$props.by);
    	};

    	$$self.$capture_state = () => ({
    		__,
    		createEventDispatcher,
    		dispatch,
    		titles,
    		keys,
    		order,
    		by,
    		labels,
    		setOrder
    	});

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(1, titles = $$props.titles);
    		if ('keys' in $$props) $$invalidate(2, keys = $$props.keys);
    		if ('order' in $$props) $$invalidate(5, order = $$props.order);
    		if ('by' in $$props) $$invalidate(0, by = $$props.by);
    		if ('labels' in $$props) $$invalidate(3, labels = $$props.labels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [by, titles, keys, labels, setOrder, order, click_handler];
    }

    class Thead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { titles: 1, keys: 2, order: 5, by: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thead",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*titles*/ ctx[1] === undefined && !('titles' in props)) {
    			console.warn("<Thead> was created without expected prop 'titles'");
    		}

    		if (/*keys*/ ctx[2] === undefined && !('keys' in props)) {
    			console.warn("<Thead> was created without expected prop 'keys'");
    		}

    		if (/*order*/ ctx[5] === undefined && !('order' in props)) {
    			console.warn("<Thead> was created without expected prop 'order'");
    		}

    		if (/*by*/ ctx[0] === undefined && !('by' in props)) {
    			console.warn("<Thead> was created without expected prop 'by'");
    		}
    	}

    	get titles() {
    		throw new Error("<Thead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titles(value) {
    		throw new Error("<Thead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keys() {
    		throw new Error("<Thead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<Thead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get order() {
    		throw new Error("<Thead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set order(value) {
    		throw new Error("<Thead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get by() {
    		throw new Error("<Thead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set by(value) {
    		throw new Error("<Thead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Table.svelte generated by Svelte v3.46.6 */

    const { Error: Error_1, console: console_1 } = globals;
    const file$5 = "src\\components\\Table.svelte";

    // (1:0) <script>    import { __ }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>    import { __ }",
    		ctx
    	});

    	return block;
    }

    // (100:6) {:then datas}
    function create_then_block$1(ctx) {
    	let tbody;
    	let current;

    	tbody = new Tbody({
    			props: {
    				keys: /*keys*/ ctx[1],
    				rows: /*datas*/ ctx[15]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tbody_changes = {};
    			if (dirty & /*keys*/ 2) tbody_changes.keys = /*keys*/ ctx[1];
    			if (dirty & /*promise*/ 4) tbody_changes.rows = /*datas*/ ctx[15];
    			tbody.$set(tbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(100:6) {:then datas}",
    		ctx
    	});

    	return block;
    }

    // (90:22)           <div class="loading">            <div class="absolute">              <img                style="height:100px;"                src="{APP_ROOT}
    function create_pending_block$1(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			set_style(img, "height", "100px");
    			if (!src_url_equal(img.src, img_src_value = "" + (APP_ROOT + "/assets/admin/img/loading.gif"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1clq1mh");
    			add_location(img, file$5, 92, 12, 2390);
    			attr_dev(div0, "class", "absolute svelte-1clq1mh");
    			add_location(div0, file$5, 91, 10, 2354);
    			attr_dev(div1, "class", "loading svelte-1clq1mh");
    			add_location(div1, file$5, 90, 8, 2321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(90:22)           <div class=\\\"loading\\\">            <div class=\\\"absolute\\\">              <img                style=\\\"height:100px;\\\"                src=\\\"{APP_ROOT}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let limit_1;
    	let t0;
    	let search_1;
    	let t1;
    	let div1;
    	let table;
    	let thead;
    	let t2;
    	let promise_1;
    	let t3;
    	let div2;
    	let pagination;
    	let current;

    	limit_1 = new Limit({
    			props: { limit: /*limit*/ ctx[4] },
    			$$inline: true
    		});

    	limit_1.$on("limit", /*setLimit*/ ctx[11]);

    	search_1 = new Search({
    			props: { search: /*search*/ ctx[5] },
    			$$inline: true
    		});

    	search_1.$on("search", /*setSearch*/ ctx[10]);

    	thead = new Thead({
    			props: {
    				keys: /*keys*/ ctx[1],
    				titles: /*titles*/ ctx[0],
    				order: /*order*/ ctx[7],
    				by: /*by*/ ctx[6]
    			},
    			$$inline: true
    		});

    	thead.$on("order", /*setOrder*/ ctx[9]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 15,
    		blocks: [,,,]
    	};

    	handle_promise(promise_1 = /*promise*/ ctx[2], info);

    	pagination = new Pagination({
    			props: {
    				page: /*page*/ ctx[3],
    				total: /*total*/ ctx[8],
    				limit: /*limit*/ ctx[4]
    			},
    			$$inline: true
    		});

    	pagination.$on("page", /*setPage*/ ctx[12]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(limit_1.$$.fragment);
    			t0 = space();
    			create_component(search_1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			table = element("table");
    			create_component(thead.$$.fragment);
    			t2 = space();
    			info.block.c();
    			t3 = space();
    			div2 = element("div");
    			create_component(pagination.$$.fragment);
    			attr_dev(div0, "class", "card-header");
    			add_location(div0, file$5, 80, 2, 1924);
    			attr_dev(table, "class", "table table-sm table-hover table-striped");
    			add_location(table, file$5, 87, 4, 2165);
    			attr_dev(div1, "class", "card-body p-0");
    			add_location(div1, file$5, 85, 2, 2079);
    			attr_dev(div2, "class", "card-footer clearfix svelte-1clq1mh");
    			add_location(div2, file$5, 104, 2, 2668);
    			attr_dev(div3, "class", "card");
    			add_location(div3, file$5, 79, 0, 1902);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(limit_1, div0, null);
    			append_dev(div0, t0);
    			mount_component(search_1, div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, table);
    			mount_component(thead, table, null);
    			append_dev(table, t2);
    			info.block.m(table, info.anchor = null);
    			info.mount = () => table;
    			info.anchor = null;
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(pagination, div2, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const limit_1_changes = {};
    			if (dirty & /*limit*/ 16) limit_1_changes.limit = /*limit*/ ctx[4];
    			limit_1.$set(limit_1_changes);
    			const search_1_changes = {};
    			if (dirty & /*search*/ 32) search_1_changes.search = /*search*/ ctx[5];
    			search_1.$set(search_1_changes);
    			const thead_changes = {};
    			if (dirty & /*keys*/ 2) thead_changes.keys = /*keys*/ ctx[1];
    			if (dirty & /*titles*/ 1) thead_changes.titles = /*titles*/ ctx[0];
    			if (dirty & /*order*/ 128) thead_changes.order = /*order*/ ctx[7];
    			if (dirty & /*by*/ 64) thead_changes.by = /*by*/ ctx[6];
    			thead.$set(thead_changes);
    			info.ctx = ctx;

    			if (dirty & /*promise*/ 4 && promise_1 !== (promise_1 = /*promise*/ ctx[2]) && handle_promise(promise_1, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const pagination_changes = {};
    			if (dirty & /*page*/ 8) pagination_changes.page = /*page*/ ctx[3];
    			if (dirty & /*total*/ 256) pagination_changes.total = /*total*/ ctx[8];
    			if (dirty & /*limit*/ 16) pagination_changes.limit = /*limit*/ ctx[4];
    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(limit_1.$$.fragment, local);
    			transition_in(search_1.$$.fragment, local);
    			transition_in(thead.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(limit_1.$$.fragment, local);
    			transition_out(search_1.$$.fragment, local);
    			transition_out(thead.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(limit_1);
    			destroy_component(search_1);
    			destroy_component(thead);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let search;
    	let total;
    	let limit;
    	let page;
    	let order;
    	let by;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { titles } = $$props;
    	let { keys } = $$props;
    	let { apiUrl } = $$props;
    	let promise;

    	async function getData() {
    		await checkAuth();
    		const auth = getSessionItem("auth");

    		const res = await fetch(apiUrl + `?search=${search}&page=${page}&limit=${limit}&order=${order}&by=${by}`, {
    			method: "GET",
    			headers: {
    				"Content-Type": "application/json",
    				Accept: "application/json",
    				Authorization: auth.access_token
    			}
    		});

    		const response = await res.text();
    		$$invalidate(8, total = res.headers.get("Total-Row"));

    		if (res.ok) {
    			return response;
    		} else {
    			throw new Error(response);
    		}
    	}

    	promise = getData();

    	const setOrder = event => {
    		$$invalidate(6, by = event.detail.by);
    		$$invalidate(7, order = event.detail.order);
    		console.log(order);
    		console.log(by);
    		$$invalidate(2, promise = getData());
    	};

    	const setSearch = event => {
    		$$invalidate(5, search = event.detail.search);
    		console.log(search);
    		$$invalidate(2, promise = getData());
    	};

    	const setLimit = event => {
    		$$invalidate(4, limit = event.detail.limit);
    		console.log(limit);
    		$$invalidate(2, promise = getData());
    	};

    	const setPage = event => {
    		$$invalidate(3, page = event.detail.page);
    		console.log(page);
    		$$invalidate(2, promise = getData());
    	};

    	const writable_props = ['titles', 'keys', 'apiUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    		if ('keys' in $$props) $$invalidate(1, keys = $$props.keys);
    		if ('apiUrl' in $$props) $$invalidate(13, apiUrl = $$props.apiUrl);
    	};

    	$$self.$capture_state = () => ({
    		__,
    		getSessionItem,
    		checkAuth,
    		Limit,
    		Pagination,
    		Search,
    		Tbody,
    		Thead,
    		APP_ROOT,
    		titles,
    		keys,
    		apiUrl,
    		promise,
    		getData,
    		setOrder,
    		setSearch,
    		setLimit,
    		setPage,
    		page,
    		limit,
    		search,
    		by,
    		order,
    		total
    	});

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(0, titles = $$props.titles);
    		if ('keys' in $$props) $$invalidate(1, keys = $$props.keys);
    		if ('apiUrl' in $$props) $$invalidate(13, apiUrl = $$props.apiUrl);
    		if ('promise' in $$props) $$invalidate(2, promise = $$props.promise);
    		if ('page' in $$props) $$invalidate(3, page = $$props.page);
    		if ('limit' in $$props) $$invalidate(4, limit = $$props.limit);
    		if ('search' in $$props) $$invalidate(5, search = $$props.search);
    		if ('by' in $$props) $$invalidate(6, by = $$props.by);
    		if ('order' in $$props) $$invalidate(7, order = $$props.order);
    		if ('total' in $$props) $$invalidate(8, total = $$props.total);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(5, search = "");
    	$$invalidate(8, total = 0);
    	$$invalidate(4, limit = 10);
    	$$invalidate(3, page = 1);
    	$$invalidate(7, order = "id");
    	$$invalidate(6, by = "asc");

    	return [
    		titles,
    		keys,
    		promise,
    		page,
    		limit,
    		search,
    		by,
    		order,
    		total,
    		setOrder,
    		setSearch,
    		setLimit,
    		setPage,
    		apiUrl
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { titles: 0, keys: 1, apiUrl: 13 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*titles*/ ctx[0] === undefined && !('titles' in props)) {
    			console_1.warn("<Table> was created without expected prop 'titles'");
    		}

    		if (/*keys*/ ctx[1] === undefined && !('keys' in props)) {
    			console_1.warn("<Table> was created without expected prop 'keys'");
    		}

    		if (/*apiUrl*/ ctx[13] === undefined && !('apiUrl' in props)) {
    			console_1.warn("<Table> was created without expected prop 'apiUrl'");
    		}
    	}

    	get titles() {
    		throw new Error_1("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titles(value) {
    		throw new Error_1("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keys() {
    		throw new Error_1("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error_1("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get apiUrl() {
    		throw new Error_1("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set apiUrl(value) {
    		throw new Error_1("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\users\index.svelte generated by Svelte v3.46.6 */
    const file$4 = "src\\pages\\users\\index.svelte";

    // (36:6) <Link to="/{route.admin}/{route.user}/" class="btn btn-success">
    function create_default_slot$1(ctx) {
    	let t_value = /*$__*/ ctx[1]("any.addNew") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 2 && t_value !== (t_value = /*$__*/ ctx[1]("any.addNew") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(36:6) <Link to=\\\"/{route.admin}/{route.user}/\\\" class=\\\"btn btn-success\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let breadcrump;
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let link;
    	let t1;
    	let table;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[4],
    				links: /*links*/ ctx[3]
    			},
    			$$inline: true
    		});

    	link = new Link$1({
    			props: {
    				to: "/" + route.admin + "/" + route.user + "/",
    				class: "btn btn-success",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				titles: /*titles*/ ctx[2],
    				keys: /*keys*/ ctx[5],
    				apiUrl: api.user
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t1 = space();
    			create_component(table.$$.fragment);
    			attr_dev(div0, "class", "card-header");
    			add_location(div0, file$4, 34, 4, 868);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file$4, 33, 2, 844);
    			attr_dev(div2, "class", "container-fluid users");
    			add_location(div2, file$4, 32, 0, 805);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(link, div0, null);
    			append_dev(div2, t1);
    			mount_component(table, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 16) breadcrump_changes.active = /*active*/ ctx[4];
    			if (dirty & /*links*/ 8) breadcrump_changes.links = /*links*/ ctx[3];
    			breadcrump.$set(breadcrump_changes);
    			const link_changes = {};

    			if (dirty & /*$$scope, $__*/ 66) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const table_changes = {};
    			if (dirty & /*titles*/ 4) table_changes.titles = /*titles*/ ctx[2];
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(link);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let titles;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Users', slots, []);
    	const keys = ["first_name", "last_name", "role", "email", "username", "nickname"];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Users> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__,
    		Breadcrump,
    		Table,
    		api,
    		Link: Link$1,
    		route,
    		keys,
    		titles,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(2, titles = $$props.titles);
    		if ('links' in $$props) $$invalidate(3, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.users"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(4, active = title);
    		}

    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(3, links = [
    				{
    					pageUrl: "admin",
    					pageTitle: $__("title.dashboard")
    				}
    			]);
    		}

    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(2, titles = [
    				$__("title.firstName"),
    				$__("title.lastName"),
    				$__("title.role"),
    				$__("title.email"),
    				$__("title.username"),
    				$__("title.nickname")
    			]);
    		}
    	};

    	return [title, $__, titles, links, active, keys];
    }

    class Users extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Users",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const create = async (apiUrl, body) => {
      await checkAuth();
      const auth = getSessionItem("auth");

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: auth.access_token,
        },
        body: JSON.stringify(body),
      }
      );
      const response = await res.text();

      if (res.ok) {
        return response;
      } else {
        throw new Error(response);
      }
    };

    const read = async (apiUrl, id) => {
      await checkAuth();
      const auth = getSessionItem("auth");

      const res = await fetch(apiUrl + `/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: auth.access_token,
        },
      }
      );
      const response = await res.text();

      if (res.ok) {
        return response;
      } else {
        throw new Error(response);
      }
    };

    const update = async (apiUrl, id, body) => {
      await checkAuth();
      const auth = getSessionItem("auth");

      const res = await fetch(apiUrl + `/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: auth.access_token,
        },
        body: JSON.stringify(body),
      }
      );
      const response = await res.text();

      if (res.ok) {
        return response;
      } else {
        throw new Error(response);
      }
    };

    /* src\pages\users\create.svelte generated by Svelte v3.46.6 */
    const file$3 = "src\\pages\\users\\create.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    // (156:14) {#each roles as item}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*item*/ ctx[53] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*item*/ ctx[53];
    			option.value = option.__value;
    			add_location(option, file$3, 156, 16, 4844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(156:14) {#each roles as item}",
    		ctx
    	});

    	return block;
    }

    // (177:10) {:catch error}
    function create_catch_block(ctx) {
    	let t_value = toastr.error(/*error*/ ctx[52].message) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*promise*/ 2097152 && t_value !== (t_value = toastr.error(/*error*/ ctx[52].message) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(177:10) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (171:10) {:then value}
    function create_then_block(ctx) {
    	let button;
    	let t_value = /*$__*/ ctx[1]("any.save") + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-success float-right");
    			add_location(button, file$3, 171, 12, 5277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*submit*/ ctx[25], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$__*/ 2 && t_value !== (t_value = /*$__*/ ctx[1]("any.save") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(171:10) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (167:26)               <button type="button" class="btn btn-success float-right" disabled                >{$__("any.save")}
    function create_pending_block(ctx) {
    	let button;
    	let t_value = /*$__*/ ctx[1]("any.save") + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-success float-right");
    			button.disabled = true;
    			add_location(button, file$3, 167, 12, 5115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$__*/ 2 && t_value !== (t_value = /*$__*/ ctx[1]("any.save") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(167:26)               <button type=\\\"button\\\" class=\\\"btn btn-success float-right\\\" disabled                >{$__(\\\"any.save\\\")}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let breadcrump;
    	let t0;
    	let div32;
    	let div31;
    	let div10;
    	let div9;
    	let div8;
    	let div0;
    	let label0;
    	let t1_value = /*$__*/ ctx[1]("title.firstName") + "";
    	let t1;
    	let t2;
    	let input0;
    	let t3;
    	let div1;
    	let label1;
    	let t4_value = /*$__*/ ctx[1]("title.lastName") + "";
    	let t4;
    	let t5;
    	let input1;
    	let t6;
    	let div2;
    	let label2;
    	let t7_value = /*$__*/ ctx[1]("title.email") + "";
    	let t7;
    	let t8;
    	let input2;
    	let t9;
    	let div3;
    	let label3;
    	let t10_value = /*$__*/ ctx[1]("title.username") + "";
    	let t10;
    	let t11;
    	let input3;
    	let t12;
    	let div4;
    	let label4;
    	let t13_value = /*$__*/ ctx[1]("title.nickname") + "";
    	let t13;
    	let t14;
    	let input4;
    	let t15;
    	let div5;
    	let label5;
    	let t16_value = /*$__*/ ctx[1]("title.password") + "";
    	let t16;
    	let t17;
    	let input5;
    	let t18;
    	let div6;
    	let label6;
    	let t19_value = /*$__*/ ctx[1]("title.retypePassword") + "";
    	let t19;
    	let t20;
    	let input6;
    	let t21;
    	let div7;
    	let label7;
    	let t22_value = /*$__*/ ctx[1]("title.role") + "";
    	let t22;
    	let t23;
    	let select0;
    	let t24;
    	let div30;
    	let div12;
    	let div11;
    	let promise_1;
    	let t25;
    	let div29;
    	let div28;
    	let h5;
    	let t26_value = /*$__*/ ctx[1]("any.customize") + "";
    	let t26;
    	let t27;
    	let hr;
    	let t28;
    	let div13;
    	let input7;
    	let label8;
    	let t29_value = /*$__*/ ctx[1]("any.darkMode") + "";
    	let t29;
    	let t30;
    	let h60;
    	let t31_value = /*$__*/ ctx[1]("any.headerOptions") + "";
    	let t31;
    	let t32;
    	let div14;
    	let input8;
    	let label9;
    	let t33_value = /*$__*/ ctx[1]("any.fixed") + "";
    	let t33;
    	let t34;
    	let h61;
    	let t35_value = /*$__*/ ctx[1]("any.sidebarOptions") + "";
    	let t35;
    	let t36;
    	let div15;
    	let input9;
    	let label10;
    	let t37_value = /*$__*/ ctx[1]("any.collapsed") + "";
    	let t37;
    	let t38;
    	let div16;
    	let input10;
    	let label11;
    	let t39_value = /*$__*/ ctx[1]("any.fixed") + "";
    	let t39;
    	let t40;
    	let div17;
    	let input11;
    	let label12;
    	let t41_value = /*$__*/ ctx[1]("any.navFlat") + "";
    	let t41;
    	let t42;
    	let div18;
    	let input12;
    	let label13;
    	let t43_value = /*$__*/ ctx[1]("any.navLegacy") + "";
    	let t43;
    	let t44;
    	let div19;
    	let input13;
    	let label14;
    	let t45_value = /*$__*/ ctx[1]("any.navCompact") + "";
    	let t45;
    	let t46;
    	let div20;
    	let input14;
    	let label15;
    	let t47_value = /*$__*/ ctx[1]("any.navChildIndent") + "";
    	let t47;
    	let t48;
    	let div21;
    	let input15;
    	let label16;
    	let t49_value = /*$__*/ ctx[1]("any.navChildHideOnCollapse") + "";
    	let t49;
    	let t50;
    	let div22;
    	let input16;
    	let label17;
    	let t51_value = /*$__*/ ctx[1]("any.disableHoverFocusAutoExpand") + "";
    	let t51;
    	let t52;
    	let h62;
    	let t53_value = /*$__*/ ctx[1]("any.footerOptions") + "";
    	let t53;
    	let t54;
    	let div23;
    	let input17;
    	let label18;
    	let t55_value = /*$__*/ ctx[1]("any.fixed") + "";
    	let t55;
    	let t56;
    	let h63;
    	let t57_value = /*$__*/ ctx[1]("any.smallTextOption") + "";
    	let t57;
    	let t58;
    	let div24;
    	let input18;
    	let label19;
    	let t59_value = /*$__*/ ctx[1]("any.body") + "";
    	let t59;
    	let t60;
    	let h64;
    	let t61_value = /*$__*/ ctx[1]("any.navbarVariants") + "";
    	let t61;
    	let t62;
    	let div25;
    	let select1;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let t82;
    	let h65;
    	let t83_value = /*$__*/ ctx[1]("any.sidebarVariants") + "";
    	let t83;
    	let t84;
    	let div26;
    	let t85;
    	let select2;
    	let option19;
    	let t86_value = /*$__*/ ctx[1]("any.noneSelected") + "";
    	let t86;
    	let option19_value_value;
    	let option20;
    	let t87_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t87;
    	let t88;
    	let t89_value = /*$__*/ ctx[1]("any.primary") + "";
    	let t89;
    	let option21;
    	let t90_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t90;
    	let t91;
    	let t92_value = /*$__*/ ctx[1]("any.warning") + "";
    	let t92;
    	let option22;
    	let t93_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t93;
    	let t94;
    	let t95_value = /*$__*/ ctx[1]("any.info") + "";
    	let t95;
    	let option23;
    	let t96_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t96;
    	let t97;
    	let t98_value = /*$__*/ ctx[1]("any.danger") + "";
    	let t98;
    	let option24;
    	let t99_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t99;
    	let t100;
    	let t101_value = /*$__*/ ctx[1]("any.success") + "";
    	let t101;
    	let option25;
    	let t102_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t102;
    	let t103;
    	let t104_value = /*$__*/ ctx[1]("any.indigo") + "";
    	let t104;
    	let option26;
    	let t105_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t105;
    	let t106;
    	let t107_value = /*$__*/ ctx[1]("any.lightblue") + "";
    	let t107;
    	let option27;
    	let t108_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t108;
    	let t109;
    	let t110_value = /*$__*/ ctx[1]("any.navy") + "";
    	let t110;
    	let option28;
    	let t111_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t111;
    	let t112;
    	let t113_value = /*$__*/ ctx[1]("any.purple") + "";
    	let t113;
    	let option29;
    	let t114_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t114;
    	let t115;
    	let t116_value = /*$__*/ ctx[1]("any.fuchsia") + "";
    	let t116;
    	let option30;
    	let t117_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t117;
    	let t118;
    	let t119_value = /*$__*/ ctx[1]("any.pink") + "";
    	let t119;
    	let option31;
    	let t120_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t120;
    	let t121;
    	let t122_value = /*$__*/ ctx[1]("any.maroon") + "";
    	let t122;
    	let option32;
    	let t123_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t123;
    	let t124;
    	let t125_value = /*$__*/ ctx[1]("any.orange") + "";
    	let t125;
    	let option33;
    	let t126_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t126;
    	let t127;
    	let t128_value = /*$__*/ ctx[1]("any.lime") + "";
    	let t128;
    	let option34;
    	let t129_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t129;
    	let t130;
    	let t131_value = /*$__*/ ctx[1]("any.teal") + "";
    	let t131;
    	let option35;
    	let t132_value = /*$__*/ ctx[1]("any.dark") + "";
    	let t132;
    	let t133;
    	let t134_value = /*$__*/ ctx[1]("any.olive") + "";
    	let t134;
    	let option36;
    	let t135_value = /*$__*/ ctx[1]("any.light") + "";
    	let t135;
    	let t136;
    	let t137_value = /*$__*/ ctx[1]("any.primary") + "";
    	let t137;
    	let option37;
    	let t138_value = /*$__*/ ctx[1]("any.light") + "";
    	let t138;
    	let t139;
    	let t140_value = /*$__*/ ctx[1]("any.warning") + "";
    	let t140;
    	let option38;
    	let t141_value = /*$__*/ ctx[1]("any.light") + "";
    	let t141;
    	let t142;
    	let t143_value = /*$__*/ ctx[1]("any.info") + "";
    	let t143;
    	let option39;
    	let t144_value = /*$__*/ ctx[1]("any.light") + "";
    	let t144;
    	let t145;
    	let t146_value = /*$__*/ ctx[1]("any.danger") + "";
    	let t146;
    	let option40;
    	let t147_value = /*$__*/ ctx[1]("any.light") + "";
    	let t147;
    	let t148;
    	let t149_value = /*$__*/ ctx[1]("any.success") + "";
    	let t149;
    	let option41;
    	let t150_value = /*$__*/ ctx[1]("any.light") + "";
    	let t150;
    	let t151;
    	let t152_value = /*$__*/ ctx[1]("any.indigo") + "";
    	let t152;
    	let option42;
    	let t153_value = /*$__*/ ctx[1]("any.light") + "";
    	let t153;
    	let t154;
    	let t155_value = /*$__*/ ctx[1]("any.lightblue") + "";
    	let t155;
    	let option43;
    	let t156_value = /*$__*/ ctx[1]("any.light") + "";
    	let t156;
    	let t157;
    	let t158_value = /*$__*/ ctx[1]("any.navy") + "";
    	let t158;
    	let option44;
    	let t159_value = /*$__*/ ctx[1]("any.light") + "";
    	let t159;
    	let t160;
    	let t161_value = /*$__*/ ctx[1]("any.purple") + "";
    	let t161;
    	let option45;
    	let t162_value = /*$__*/ ctx[1]("any.light") + "";
    	let t162;
    	let t163;
    	let t164_value = /*$__*/ ctx[1]("any.fuchsia") + "";
    	let t164;
    	let option46;
    	let t165_value = /*$__*/ ctx[1]("any.light") + "";
    	let t165;
    	let t166;
    	let t167_value = /*$__*/ ctx[1]("any.pink") + "";
    	let t167;
    	let option47;
    	let t168_value = /*$__*/ ctx[1]("any.light") + "";
    	let t168;
    	let t169;
    	let t170_value = /*$__*/ ctx[1]("any.maroon") + "";
    	let t170;
    	let option48;
    	let t171_value = /*$__*/ ctx[1]("any.light") + "";
    	let t171;
    	let t172;
    	let t173_value = /*$__*/ ctx[1]("any.orange") + "";
    	let t173;
    	let option49;
    	let t174_value = /*$__*/ ctx[1]("any.light") + "";
    	let t174;
    	let t175;
    	let t176_value = /*$__*/ ctx[1]("any.lime") + "";
    	let t176;
    	let option50;
    	let t177_value = /*$__*/ ctx[1]("any.light") + "";
    	let t177;
    	let t178;
    	let t179_value = /*$__*/ ctx[1]("any.teal") + "";
    	let t179;
    	let option51;
    	let t180_value = /*$__*/ ctx[1]("any.light") + "";
    	let t180;
    	let t181;
    	let t182_value = /*$__*/ ctx[1]("any.olive") + "";
    	let t182;
    	let t183;
    	let h66;
    	let t184_value = /*$__*/ ctx[1]("any.brandLogoVariants") + "";
    	let t184;
    	let t185;
    	let div27;
    	let t186;
    	let select3;
    	let option52;
    	let t187_value = /*$__*/ ctx[1]("any.noneSelected") + "";
    	let t187;
    	let option52_value_value;
    	let option53;
    	let option54;
    	let option55;
    	let option56;
    	let option57;
    	let option58;
    	let option59;
    	let option60;
    	let option61;
    	let option62;
    	let option63;
    	let option64;
    	let option65;
    	let option66;
    	let option67;
    	let option68;
    	let option69;
    	let option70;
    	let option71;
    	let current;
    	let mounted;
    	let dispose;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[23],
    				links: /*links*/ ctx[22]
    			},
    			$$inline: true
    		});

    	let each_value = /*roles*/ ctx[24];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 51,
    		error: 52
    	};

    	handle_promise(promise_1 = /*promise*/ ctx[21], info);

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div32 = element("div");
    			div31 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			t4 = text(t4_value);
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label2 = element("label");
    			t7 = text(t7_value);
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			div3 = element("div");
    			label3 = element("label");
    			t10 = text(t10_value);
    			t11 = space();
    			input3 = element("input");
    			t12 = space();
    			div4 = element("div");
    			label4 = element("label");
    			t13 = text(t13_value);
    			t14 = space();
    			input4 = element("input");
    			t15 = space();
    			div5 = element("div");
    			label5 = element("label");
    			t16 = text(t16_value);
    			t17 = space();
    			input5 = element("input");
    			t18 = space();
    			div6 = element("div");
    			label6 = element("label");
    			t19 = text(t19_value);
    			t20 = space();
    			input6 = element("input");
    			t21 = space();
    			div7 = element("div");
    			label7 = element("label");
    			t22 = text(t22_value);
    			t23 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t24 = space();
    			div30 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			info.block.c();
    			t25 = space();
    			div29 = element("div");
    			div28 = element("div");
    			h5 = element("h5");
    			t26 = text(t26_value);
    			t27 = space();
    			hr = element("hr");
    			t28 = space();
    			div13 = element("div");
    			input7 = element("input");
    			label8 = element("label");
    			t29 = text(t29_value);
    			t30 = space();
    			h60 = element("h6");
    			t31 = text(t31_value);
    			t32 = space();
    			div14 = element("div");
    			input8 = element("input");
    			label9 = element("label");
    			t33 = text(t33_value);
    			t34 = space();
    			h61 = element("h6");
    			t35 = text(t35_value);
    			t36 = space();
    			div15 = element("div");
    			input9 = element("input");
    			label10 = element("label");
    			t37 = text(t37_value);
    			t38 = space();
    			div16 = element("div");
    			input10 = element("input");
    			label11 = element("label");
    			t39 = text(t39_value);
    			t40 = space();
    			div17 = element("div");
    			input11 = element("input");
    			label12 = element("label");
    			t41 = text(t41_value);
    			t42 = space();
    			div18 = element("div");
    			input12 = element("input");
    			label13 = element("label");
    			t43 = text(t43_value);
    			t44 = space();
    			div19 = element("div");
    			input13 = element("input");
    			label14 = element("label");
    			t45 = text(t45_value);
    			t46 = space();
    			div20 = element("div");
    			input14 = element("input");
    			label15 = element("label");
    			t47 = text(t47_value);
    			t48 = space();
    			div21 = element("div");
    			input15 = element("input");
    			label16 = element("label");
    			t49 = text(t49_value);
    			t50 = space();
    			div22 = element("div");
    			input16 = element("input");
    			label17 = element("label");
    			t51 = text(t51_value);
    			t52 = space();
    			h62 = element("h6");
    			t53 = text(t53_value);
    			t54 = space();
    			div23 = element("div");
    			input17 = element("input");
    			label18 = element("label");
    			t55 = text(t55_value);
    			t56 = space();
    			h63 = element("h6");
    			t57 = text(t57_value);
    			t58 = space();
    			div24 = element("div");
    			input18 = element("input");
    			label19 = element("label");
    			t59 = text(t59_value);
    			t60 = space();
    			h64 = element("h6");
    			t61 = text(t61_value);
    			t62 = space();
    			div25 = element("div");
    			select1 = element("select");
    			option0 = element("option");
    			option0.textContent = "Primary";
    			option1 = element("option");
    			option1.textContent = "Secondary";
    			option2 = element("option");
    			option2.textContent = "Info";
    			option3 = element("option");
    			option3.textContent = "Success";
    			option4 = element("option");
    			option4.textContent = "Danger";
    			option5 = element("option");
    			option5.textContent = "Indigo";
    			option6 = element("option");
    			option6.textContent = "Purple";
    			option7 = element("option");
    			option7.textContent = "Pink";
    			option8 = element("option");
    			option8.textContent = "Navy";
    			option9 = element("option");
    			option9.textContent = "Lightblue";
    			option10 = element("option");
    			option10.textContent = "Teal";
    			option11 = element("option");
    			option11.textContent = "Cyan";
    			option12 = element("option");
    			option12.textContent = "Dark";
    			option13 = element("option");
    			option13.textContent = "Gray dark";
    			option14 = element("option");
    			option14.textContent = "Gray";
    			option15 = element("option");
    			option15.textContent = "Light";
    			option16 = element("option");
    			option16.textContent = "Warning";
    			option17 = element("option");
    			option17.textContent = "White";
    			option18 = element("option");
    			option18.textContent = "Orange";
    			t82 = space();
    			h65 = element("h6");
    			t83 = text(t83_value);
    			t84 = space();
    			div26 = element("div");
    			t85 = space();
    			select2 = element("select");
    			option19 = element("option");
    			t86 = text(t86_value);
    			option20 = element("option");
    			t87 = text(t87_value);
    			t88 = text(" - ");
    			t89 = text(t89_value);
    			option21 = element("option");
    			t90 = text(t90_value);
    			t91 = text(" - ");
    			t92 = text(t92_value);
    			option22 = element("option");
    			t93 = text(t93_value);
    			t94 = text(" - ");
    			t95 = text(t95_value);
    			option23 = element("option");
    			t96 = text(t96_value);
    			t97 = text(" - ");
    			t98 = text(t98_value);
    			option24 = element("option");
    			t99 = text(t99_value);
    			t100 = text(" - ");
    			t101 = text(t101_value);
    			option25 = element("option");
    			t102 = text(t102_value);
    			t103 = text(" - ");
    			t104 = text(t104_value);
    			option26 = element("option");
    			t105 = text(t105_value);
    			t106 = text(" - ");
    			t107 = text(t107_value);
    			option27 = element("option");
    			t108 = text(t108_value);
    			t109 = text(" - ");
    			t110 = text(t110_value);
    			option28 = element("option");
    			t111 = text(t111_value);
    			t112 = text(" - ");
    			t113 = text(t113_value);
    			option29 = element("option");
    			t114 = text(t114_value);
    			t115 = text(" - ");
    			t116 = text(t116_value);
    			option30 = element("option");
    			t117 = text(t117_value);
    			t118 = text(" - ");
    			t119 = text(t119_value);
    			option31 = element("option");
    			t120 = text(t120_value);
    			t121 = text(" - ");
    			t122 = text(t122_value);
    			option32 = element("option");
    			t123 = text(t123_value);
    			t124 = text(" - ");
    			t125 = text(t125_value);
    			option33 = element("option");
    			t126 = text(t126_value);
    			t127 = text(" - ");
    			t128 = text(t128_value);
    			option34 = element("option");
    			t129 = text(t129_value);
    			t130 = text(" - ");
    			t131 = text(t131_value);
    			option35 = element("option");
    			t132 = text(t132_value);
    			t133 = text(" - ");
    			t134 = text(t134_value);
    			option36 = element("option");
    			t135 = text(t135_value);
    			t136 = text(" - ");
    			t137 = text(t137_value);
    			option37 = element("option");
    			t138 = text(t138_value);
    			t139 = text(" - ");
    			t140 = text(t140_value);
    			option38 = element("option");
    			t141 = text(t141_value);
    			t142 = text(" - ");
    			t143 = text(t143_value);
    			option39 = element("option");
    			t144 = text(t144_value);
    			t145 = text(" - ");
    			t146 = text(t146_value);
    			option40 = element("option");
    			t147 = text(t147_value);
    			t148 = text(" - ");
    			t149 = text(t149_value);
    			option41 = element("option");
    			t150 = text(t150_value);
    			t151 = text(" - ");
    			t152 = text(t152_value);
    			option42 = element("option");
    			t153 = text(t153_value);
    			t154 = text(" - ");
    			t155 = text(t155_value);
    			option43 = element("option");
    			t156 = text(t156_value);
    			t157 = text(" - ");
    			t158 = text(t158_value);
    			option44 = element("option");
    			t159 = text(t159_value);
    			t160 = text(" - ");
    			t161 = text(t161_value);
    			option45 = element("option");
    			t162 = text(t162_value);
    			t163 = text(" - ");
    			t164 = text(t164_value);
    			option46 = element("option");
    			t165 = text(t165_value);
    			t166 = text(" - ");
    			t167 = text(t167_value);
    			option47 = element("option");
    			t168 = text(t168_value);
    			t169 = text(" - ");
    			t170 = text(t170_value);
    			option48 = element("option");
    			t171 = text(t171_value);
    			t172 = text(" - ");
    			t173 = text(t173_value);
    			option49 = element("option");
    			t174 = text(t174_value);
    			t175 = text(" - ");
    			t176 = text(t176_value);
    			option50 = element("option");
    			t177 = text(t177_value);
    			t178 = text(" - ");
    			t179 = text(t179_value);
    			option51 = element("option");
    			t180 = text(t180_value);
    			t181 = text(" - ");
    			t182 = text(t182_value);
    			t183 = space();
    			h66 = element("h6");
    			t184 = text(t184_value);
    			t185 = space();
    			div27 = element("div");
    			t186 = space();
    			select3 = element("select");
    			option52 = element("option");
    			t187 = text(t187_value);
    			option53 = element("option");
    			option53.textContent = "Primary";
    			option54 = element("option");
    			option54.textContent = "Secondary";
    			option55 = element("option");
    			option55.textContent = "Info";
    			option56 = element("option");
    			option56.textContent = "Success";
    			option57 = element("option");
    			option57.textContent = "Danger";
    			option58 = element("option");
    			option58.textContent = "Indigo";
    			option59 = element("option");
    			option59.textContent = "Purple";
    			option60 = element("option");
    			option60.textContent = "Pink";
    			option61 = element("option");
    			option61.textContent = "Navy";
    			option62 = element("option");
    			option62.textContent = "Lightblue";
    			option63 = element("option");
    			option63.textContent = "Teal";
    			option64 = element("option");
    			option64.textContent = "Cyan";
    			option65 = element("option");
    			option65.textContent = "Dark";
    			option66 = element("option");
    			option66.textContent = "Gray dark";
    			option67 = element("option");
    			option67.textContent = "Gray";
    			option68 = element("option");
    			option68.textContent = "Light";
    			option69 = element("option");
    			option69.textContent = "Warning";
    			option70 = element("option");
    			option70.textContent = "White";
    			option71 = element("option");
    			option71.textContent = "Orange";
    			attr_dev(label0, "class", "col-form-label");
    			attr_dev(label0, "for", "first_name");
    			add_location(label0, file$3, 76, 12, 2255);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "first_name");
    			add_location(input0, file$3, 79, 12, 2378);
    			attr_dev(div0, "class", "form-group");
    			add_location(div0, file$3, 75, 10, 2217);
    			attr_dev(label1, "class", "col-form-label");
    			attr_dev(label1, "for", "last_name");
    			add_location(label1, file$3, 87, 12, 2601);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "last_name");
    			add_location(input1, file$3, 90, 12, 2722);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$3, 86, 10, 2563);
    			attr_dev(label2, "class", "col-form-label");
    			attr_dev(label2, "for", "email");
    			add_location(label2, file$3, 98, 12, 2943);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "email");
    			add_location(input2, file$3, 101, 12, 3057);
    			attr_dev(div2, "class", "form-group");
    			add_location(div2, file$3, 97, 10, 2905);
    			attr_dev(label3, "class", "col-form-label");
    			attr_dev(label3, "for", "username");
    			add_location(label3, file$3, 109, 12, 3270);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "username");
    			add_location(input3, file$3, 112, 12, 3390);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$3, 108, 10, 3232);
    			attr_dev(label4, "class", "col-form-label");
    			attr_dev(label4, "for", "nickname");
    			add_location(label4, file$3, 120, 12, 3609);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "form-control");
    			attr_dev(input4, "id", "nickname");
    			add_location(input4, file$3, 123, 12, 3729);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file$3, 119, 10, 3571);
    			attr_dev(label5, "class", "col-form-label");
    			attr_dev(label5, "for", "password");
    			add_location(label5, file$3, 131, 12, 3948);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "class", "form-control");
    			attr_dev(input5, "id", "password");
    			add_location(input5, file$3, 134, 12, 4068);
    			attr_dev(div5, "class", "form-group");
    			add_location(div5, file$3, 130, 10, 3910);
    			attr_dev(label6, "class", "col-form-label");
    			attr_dev(label6, "for", "retypePassword");
    			add_location(label6, file$3, 142, 12, 4287);
    			attr_dev(input6, "type", "text");
    			attr_dev(input6, "class", "form-control");
    			attr_dev(input6, "id", "retypePassword");
    			add_location(input6, file$3, 145, 12, 4419);
    			attr_dev(div6, "class", "form-group");
    			add_location(div6, file$3, 141, 10, 4249);
    			attr_dev(label7, "class", "col-form-label");
    			attr_dev(label7, "for", "role");
    			add_location(label7, file$3, 153, 12, 4650);
    			attr_dev(select0, "class", "form-control");
    			attr_dev(select0, "id", "role");
    			if (/*role*/ ctx[7] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[33].call(select0));
    			add_location(select0, file$3, 154, 12, 4732);
    			attr_dev(div7, "class", "form-group");
    			add_location(div7, file$3, 152, 10, 4612);
    			attr_dev(div8, "class", "card-body");
    			add_location(div8, file$3, 74, 8, 2182);
    			attr_dev(div9, "class", "card");
    			add_location(div9, file$3, 73, 6, 2154);
    			attr_dev(div10, "class", "col-md-9");
    			add_location(div10, file$3, 72, 4, 2124);
    			attr_dev(div11, "class", "card-body");
    			add_location(div11, file$3, 165, 8, 5050);
    			attr_dev(div12, "class", "card");
    			add_location(div12, file$3, 164, 6, 5022);
    			add_location(h5, file$3, 183, 10, 5628);
    			attr_dev(hr, "class", "mb-2");
    			add_location(hr, file$3, 184, 10, 5671);
    			attr_dev(input7, "id", "darkMode");
    			attr_dev(input7, "type", "checkbox");
    			input7.__value = "dark-mode";
    			input7.value = input7.__value;
    			attr_dev(input7, "class", "mr-1");
    			add_location(input7, file$3, 186, 12, 5734);
    			attr_dev(label8, "for", "darkMode");
    			add_location(label8, file$3, 192, 14, 5917);
    			attr_dev(div13, "class", "mb-4");
    			add_location(div13, file$3, 185, 10, 5702);
    			add_location(h60, file$3, 194, 10, 5998);
    			attr_dev(input8, "id", "fixed1");
    			attr_dev(input8, "type", "checkbox");
    			input8.__value = "layout-navbar-fixed";
    			input8.value = input8.__value;
    			attr_dev(input8, "class", "mr-1");
    			add_location(input8, file$3, 196, 12, 6077);
    			attr_dev(label9, "for", "fixed1");
    			add_location(label9, file$3, 202, 14, 6271);
    			attr_dev(div14, "class", "mb-4");
    			add_location(div14, file$3, 195, 10, 6045);
    			add_location(h61, file$3, 204, 10, 6347);
    			attr_dev(input9, "id", "collapsed");
    			attr_dev(input9, "type", "checkbox");
    			input9.__value = "collapsed";
    			input9.value = input9.__value;
    			attr_dev(input9, "class", "mr-1");
    			add_location(input9, file$3, 206, 12, 6427);
    			attr_dev(label10, "for", "collapsed");
    			add_location(label10, file$3, 212, 14, 6624);
    			attr_dev(div15, "class", "mb-1");
    			add_location(div15, file$3, 205, 10, 6395);
    			attr_dev(input10, "id", "fixed2");
    			attr_dev(input10, "type", "checkbox");
    			input10.__value = "layout-fixed";
    			input10.value = input10.__value;
    			attr_dev(input10, "class", "mr-1");
    			add_location(input10, file$3, 215, 12, 6739);
    			attr_dev(label11, "for", "fixed2");
    			add_location(label11, file$3, 221, 14, 6924);
    			attr_dev(div16, "class", "mb-1");
    			add_location(div16, file$3, 214, 10, 6707);
    			attr_dev(input11, "id", "navFlat");
    			attr_dev(input11, "type", "checkbox");
    			input11.__value = "nav-flat";
    			input11.value = input11.__value;
    			attr_dev(input11, "class", "mr-1");
    			/*$$binding_groups*/ ctx[39][0].push(input11);
    			add_location(input11, file$3, 224, 12, 7032);
    			attr_dev(label12, "for", "navFlat");
    			add_location(label12, file$3, 230, 14, 7224);
    			attr_dev(div17, "class", "mb-1");
    			add_location(div17, file$3, 223, 10, 7000);
    			attr_dev(input12, "id", "navLegacy");
    			attr_dev(input12, "type", "checkbox");
    			input12.__value = "nav-legacy";
    			input12.value = input12.__value;
    			attr_dev(input12, "class", "mr-1");
    			/*$$binding_groups*/ ctx[39][0].push(input12);
    			add_location(input12, file$3, 233, 12, 7335);
    			attr_dev(label13, "for", "navLegacy");
    			add_location(label13, file$3, 239, 14, 7531);
    			attr_dev(div18, "class", "mb-1");
    			add_location(div18, file$3, 232, 10, 7303);
    			attr_dev(input13, "id", "navCompact");
    			attr_dev(input13, "type", "checkbox");
    			input13.__value = "nav-compact";
    			input13.value = input13.__value;
    			attr_dev(input13, "class", "mr-1");
    			/*$$binding_groups*/ ctx[39][0].push(input13);
    			add_location(input13, file$3, 242, 12, 7646);
    			attr_dev(label14, "for", "navCompact");
    			add_location(label14, file$3, 248, 14, 7844);
    			attr_dev(div19, "class", "mb-1");
    			add_location(div19, file$3, 241, 10, 7614);
    			attr_dev(input14, "id", "navChildIndent");
    			attr_dev(input14, "type", "checkbox");
    			input14.__value = "nav-child-indent";
    			input14.value = input14.__value;
    			attr_dev(input14, "class", "mr-1");
    			/*$$binding_groups*/ ctx[39][0].push(input14);
    			add_location(input14, file$3, 251, 12, 7961);
    			attr_dev(label15, "for", "navChildIndent");
    			add_location(label15, file$3, 257, 14, 8168);
    			attr_dev(div20, "class", "mb-1");
    			add_location(div20, file$3, 250, 10, 7929);
    			attr_dev(input15, "id", "navChildHideOnCollapse");
    			attr_dev(input15, "type", "checkbox");
    			input15.__value = "nav-collapse-hide-child";
    			input15.value = input15.__value;
    			attr_dev(input15, "class", "mr-1");
    			/*$$binding_groups*/ ctx[39][0].push(input15);
    			add_location(input15, file$3, 260, 12, 8293);
    			attr_dev(label16, "for", "navChildHideOnCollapse");
    			add_location(label16, file$3, 266, 14, 8515);
    			attr_dev(div21, "class", "mb-1");
    			add_location(div21, file$3, 259, 10, 8261);
    			attr_dev(input16, "id", "disableHoverFocusAutoExpand");
    			attr_dev(input16, "type", "checkbox");
    			input16.__value = "sidebar-no-expand";
    			input16.value = input16.__value;
    			attr_dev(input16, "class", "mr-1");
    			add_location(input16, file$3, 271, 12, 8686);
    			attr_dev(label17, "for", "disableHoverFocusAutoExpand");
    			add_location(label17, file$3, 277, 14, 8906);
    			attr_dev(div22, "class", "mb-4");
    			add_location(div22, file$3, 270, 10, 8654);
    			add_location(h62, file$3, 281, 10, 9055);
    			attr_dev(input17, "id", "fixed3");
    			attr_dev(input17, "type", "checkbox");
    			input17.__value = "layout-footer-fixed";
    			input17.value = input17.__value;
    			attr_dev(input17, "class", "mr-1");
    			add_location(input17, file$3, 283, 12, 9134);
    			attr_dev(label18, "for", "fixed3");
    			add_location(label18, file$3, 289, 14, 9328);
    			attr_dev(div23, "class", "mb-4");
    			add_location(div23, file$3, 282, 10, 9102);
    			add_location(h63, file$3, 291, 10, 9404);
    			attr_dev(input18, "id", "body1");
    			attr_dev(input18, "type", "checkbox");
    			input18.__value = "text-sm";
    			input18.value = input18.__value;
    			attr_dev(input18, "class", "mr-1");
    			add_location(input18, file$3, 293, 12, 9485);
    			attr_dev(label19, "for", "body1");
    			add_location(label19, file$3, 299, 14, 9663);
    			attr_dev(div24, "class", "mb-4");
    			add_location(div24, file$3, 292, 10, 9453);
    			add_location(h64, file$3, 301, 10, 9737);
    			attr_dev(option0, "class", "bg-primary");
    			option0.__value = "navbar-dark bg-primary";
    			option0.value = option0.__value;
    			add_location(option0, file$3, 307, 14, 9966);
    			attr_dev(option1, "class", "bg-secondary");
    			option1.__value = "navbar-dark bg-secondary";
    			option1.value = option1.__value;
    			add_location(option1, file$3, 310, 14, 10090);
    			attr_dev(option2, "class", "bg-info");
    			option2.__value = "navbar-dark bg-info";
    			option2.value = option2.__value;
    			add_location(option2, file$3, 313, 14, 10220);
    			attr_dev(option3, "class", "bg-success");
    			option3.__value = "navbar-dark bg-success";
    			option3.value = option3.__value;
    			add_location(option3, file$3, 314, 14, 10301);
    			attr_dev(option4, "class", "bg-danger");
    			option4.__value = "navbar-dark bg-danger";
    			option4.value = option4.__value;
    			add_location(option4, file$3, 317, 14, 10425);
    			attr_dev(option5, "class", "bg-indigo");
    			option5.__value = "navbar-dark bg-indigo";
    			option5.value = option5.__value;
    			add_location(option5, file$3, 320, 14, 10546);
    			attr_dev(option6, "class", "bg-purple");
    			option6.__value = "navbar-dark bg-purple";
    			option6.value = option6.__value;
    			add_location(option6, file$3, 323, 14, 10667);
    			attr_dev(option7, "class", "bg-pink");
    			option7.__value = "navbar-dark bg-pink";
    			option7.value = option7.__value;
    			add_location(option7, file$3, 326, 14, 10788);
    			attr_dev(option8, "class", "bg-navy");
    			option8.__value = "navbar-dark bg-navy";
    			option8.value = option8.__value;
    			add_location(option8, file$3, 327, 14, 10869);
    			attr_dev(option9, "class", "bg-lightblue");
    			option9.__value = "navbar-dark bg-lightblue";
    			option9.value = option9.__value;
    			add_location(option9, file$3, 328, 14, 10950);
    			attr_dev(option10, "class", "bg-teal");
    			option10.__value = "navbar-dark bg-teal";
    			option10.value = option10.__value;
    			add_location(option10, file$3, 331, 14, 11080);
    			attr_dev(option11, "class", "bg-cyan");
    			option11.__value = "navbar-dark bg-cyan";
    			option11.value = option11.__value;
    			add_location(option11, file$3, 332, 14, 11161);
    			attr_dev(option12, "class", "bg-dark");
    			option12.__value = "navbar-dark bg-dark";
    			option12.value = option12.__value;
    			add_location(option12, file$3, 333, 14, 11242);
    			attr_dev(option13, "class", "bg-gray-dark");
    			option13.__value = "navbar-dark bg-gray-dark";
    			option13.value = option13.__value;
    			add_location(option13, file$3, 334, 14, 11323);
    			attr_dev(option14, "class", "bg-gray");
    			option14.__value = "navbar-dark bg-gray";
    			option14.value = option14.__value;
    			add_location(option14, file$3, 337, 14, 11453);
    			attr_dev(option15, "class", "bg-light");
    			option15.__value = "navbar-dark bg-light";
    			option15.value = option15.__value;
    			add_location(option15, file$3, 338, 14, 11534);
    			attr_dev(option16, "class", "bg-warning");
    			option16.__value = "navbar-light bg-warning";
    			option16.value = option16.__value;
    			add_location(option16, file$3, 341, 14, 11652);
    			attr_dev(option17, "class", "bg-white");
    			option17.__value = "navbar-light bg-white";
    			option17.value = option17.__value;
    			add_location(option17, file$3, 344, 14, 11777);
    			attr_dev(option18, "class", "bg-orange");
    			option18.__value = "navbar-light bg-orange";
    			option18.value = option18.__value;
    			add_location(option18, file$3, 347, 14, 11896);
    			attr_dev(select1, "class", "custom-select mb-3 text-light border-0 bg-white");
    			if (/*navbar_bg*/ ctx[11] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[47].call(select1));
    			add_location(select1, file$3, 303, 12, 9819);
    			attr_dev(div25, "class", "d-flex");
    			add_location(div25, file$3, 302, 10, 9785);
    			add_location(h65, file$3, 352, 10, 12055);
    			attr_dev(div26, "class", "d-flex");
    			add_location(div26, file$3, 353, 10, 12104);
    			option19.__value = option19_value_value = /*$__*/ ctx[1]("any.noneSelected");
    			option19.value = option19.__value;
    			add_location(option19, file$3, 358, 12, 12263);
    			option20.__value = "sidebar-dark-primary";
    			option20.value = option20.__value;
    			add_location(option20, file$3, 359, 12, 12319);
    			option21.__value = "sidebar-dark-warning";
    			option21.value = option21.__value;
    			add_location(option21, file$3, 362, 12, 12449);
    			option22.__value = "sidebar-dark-info";
    			option22.value = option22.__value;
    			add_location(option22, file$3, 365, 12, 12579);
    			option23.__value = "sidebar-dark-danger";
    			option23.value = option23.__value;
    			add_location(option23, file$3, 368, 12, 12703);
    			option24.__value = "sidebar-dark-success";
    			option24.value = option24.__value;
    			add_location(option24, file$3, 371, 12, 12831);
    			option25.__value = "sidebar-dark-indigo";
    			option25.value = option25.__value;
    			add_location(option25, file$3, 374, 12, 12961);
    			option26.__value = "sidebar-dark-lightblue";
    			option26.value = option26.__value;
    			add_location(option26, file$3, 377, 12, 13089);
    			option27.__value = "sidebar-dark-navy";
    			option27.value = option27.__value;
    			add_location(option27, file$3, 380, 12, 13223);
    			option28.__value = "sidebar-dark-purple";
    			option28.value = option28.__value;
    			add_location(option28, file$3, 383, 12, 13347);
    			option29.__value = "sidebar-dark-fuchsia";
    			option29.value = option29.__value;
    			add_location(option29, file$3, 386, 12, 13475);
    			option30.__value = "sidebar-dark-pink";
    			option30.value = option30.__value;
    			add_location(option30, file$3, 389, 12, 13605);
    			option31.__value = "sidebar-dark-maroon";
    			option31.value = option31.__value;
    			add_location(option31, file$3, 392, 12, 13729);
    			option32.__value = "sidebar-dark-orange";
    			option32.value = option32.__value;
    			add_location(option32, file$3, 395, 12, 13857);
    			option33.__value = "sidebar-dark-lime";
    			option33.value = option33.__value;
    			add_location(option33, file$3, 398, 12, 13985);
    			option34.__value = "sidebar-dark-teal";
    			option34.value = option34.__value;
    			add_location(option34, file$3, 401, 12, 14109);
    			option35.__value = "sidebar-dark-olive";
    			option35.value = option35.__value;
    			add_location(option35, file$3, 404, 12, 14233);
    			option36.__value = "sidebar-light-primary";
    			option36.value = option36.__value;
    			add_location(option36, file$3, 407, 12, 14359);
    			option37.__value = "sidebar-light-warning";
    			option37.value = option37.__value;
    			add_location(option37, file$3, 410, 12, 14491);
    			option38.__value = "sidebar-light-info";
    			option38.value = option38.__value;
    			add_location(option38, file$3, 413, 12, 14623);
    			option39.__value = "sidebar-light-danger";
    			option39.value = option39.__value;
    			add_location(option39, file$3, 416, 12, 14749);
    			option40.__value = "sidebar-light-success";
    			option40.value = option40.__value;
    			add_location(option40, file$3, 419, 12, 14879);
    			option41.__value = "sidebar-light-indigo";
    			option41.value = option41.__value;
    			add_location(option41, file$3, 422, 12, 15011);
    			option42.__value = "sidebar-light-lightblue";
    			option42.value = option42.__value;
    			add_location(option42, file$3, 425, 12, 15141);
    			option43.__value = "sidebar-light-navy";
    			option43.value = option43.__value;
    			add_location(option43, file$3, 428, 12, 15277);
    			option44.__value = "sidebar-light-purple";
    			option44.value = option44.__value;
    			add_location(option44, file$3, 431, 12, 15403);
    			option45.__value = "sidebar-light-fuchsia";
    			option45.value = option45.__value;
    			add_location(option45, file$3, 434, 12, 15533);
    			option46.__value = "sidebar-light-pink";
    			option46.value = option46.__value;
    			add_location(option46, file$3, 437, 12, 15665);
    			option47.__value = "sidebar-light-maroon";
    			option47.value = option47.__value;
    			add_location(option47, file$3, 440, 12, 15791);
    			option48.__value = "sidebar-light-orange";
    			option48.value = option48.__value;
    			add_location(option48, file$3, 443, 12, 15921);
    			option49.__value = "sidebar-light-lime";
    			option49.value = option49.__value;
    			add_location(option49, file$3, 446, 12, 16051);
    			option50.__value = "sidebar-light-teal";
    			option50.value = option50.__value;
    			add_location(option50, file$3, 449, 12, 16177);
    			option51.__value = "sidebar-light-olive";
    			option51.value = option51.__value;
    			add_location(option51, file$3, 452, 12, 16303);
    			attr_dev(select2, "class", "custom-select mb-3 border-0");
    			if (/*main_sidebar_bg*/ ctx[12] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[48].call(select2));
    			add_location(select2, file$3, 354, 10, 12138);
    			add_location(h66, file$3, 456, 10, 16450);
    			attr_dev(div27, "class", "d-flex");
    			add_location(div27, file$3, 457, 10, 16501);
    			option52.__value = option52_value_value = /*$__*/ ctx[1]("any.noneSelected");
    			option52.value = option52.__value;
    			add_location(option52, file$3, 462, 12, 16658);
    			attr_dev(option53, "class", "bg-primary");
    			option53.__value = "Primary";
    			option53.value = option53.__value;
    			add_location(option53, file$3, 463, 12, 16714);
    			attr_dev(option54, "class", "bg-secondary");
    			option54.__value = "Secondary";
    			option54.value = option54.__value;
    			add_location(option54, file$3, 464, 12, 16771);
    			attr_dev(option55, "class", "bg-info");
    			option55.__value = "Info";
    			option55.value = option55.__value;
    			add_location(option55, file$3, 465, 12, 16832);
    			attr_dev(option56, "class", "bg-success");
    			option56.__value = "Success";
    			option56.value = option56.__value;
    			add_location(option56, file$3, 466, 12, 16883);
    			attr_dev(option57, "class", "bg-danger");
    			option57.__value = "Danger";
    			option57.value = option57.__value;
    			add_location(option57, file$3, 467, 12, 16940);
    			attr_dev(option58, "class", "bg-indigo");
    			option58.__value = "Indigo";
    			option58.value = option58.__value;
    			add_location(option58, file$3, 468, 12, 16995);
    			attr_dev(option59, "class", "bg-purple");
    			option59.__value = "Purple";
    			option59.value = option59.__value;
    			add_location(option59, file$3, 469, 12, 17050);
    			attr_dev(option60, "class", "bg-pink");
    			option60.__value = "Pink";
    			option60.value = option60.__value;
    			add_location(option60, file$3, 470, 12, 17105);
    			attr_dev(option61, "class", "bg-navy");
    			option61.__value = "Navy";
    			option61.value = option61.__value;
    			add_location(option61, file$3, 471, 12, 17156);
    			attr_dev(option62, "class", "bg-lightblue");
    			option62.__value = "Lightblue";
    			option62.value = option62.__value;
    			add_location(option62, file$3, 472, 12, 17207);
    			attr_dev(option63, "class", "bg-teal");
    			option63.__value = "Teal";
    			option63.value = option63.__value;
    			add_location(option63, file$3, 473, 12, 17268);
    			attr_dev(option64, "class", "bg-cyan");
    			option64.__value = "Cyan";
    			option64.value = option64.__value;
    			add_location(option64, file$3, 474, 12, 17319);
    			attr_dev(option65, "class", "bg-dark");
    			option65.__value = "Dark";
    			option65.value = option65.__value;
    			add_location(option65, file$3, 475, 12, 17370);
    			attr_dev(option66, "class", "bg-gray-dark");
    			option66.__value = "Gray dark";
    			option66.value = option66.__value;
    			add_location(option66, file$3, 476, 12, 17421);
    			attr_dev(option67, "class", "bg-gray");
    			option67.__value = "Gray";
    			option67.value = option67.__value;
    			add_location(option67, file$3, 477, 12, 17482);
    			attr_dev(option68, "class", "bg-light");
    			option68.__value = "Light";
    			option68.value = option68.__value;
    			add_location(option68, file$3, 478, 12, 17533);
    			attr_dev(option69, "class", "bg-warning");
    			option69.__value = "Warning";
    			option69.value = option69.__value;
    			add_location(option69, file$3, 479, 12, 17586);
    			attr_dev(option70, "class", "bg-white");
    			option70.__value = "White";
    			option70.value = option70.__value;
    			add_location(option70, file$3, 480, 12, 17643);
    			attr_dev(option71, "class", "bg-orange");
    			option71.__value = "Orange";
    			option71.value = option71.__value;
    			add_location(option71, file$3, 481, 12, 17696);
    			attr_dev(select3, "class", "custom-select mb-3 border-0");
    			if (/*brand_logo_bg*/ ctx[10] === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[49].call(select3));
    			add_location(select3, file$3, 458, 10, 16535);
    			attr_dev(div28, "class", "card-body");
    			add_location(div28, file$3, 182, 8, 5593);
    			attr_dev(div29, "class", "card");
    			add_location(div29, file$3, 181, 6, 5565);
    			attr_dev(div30, "class", "col-md-3");
    			add_location(div30, file$3, 163, 4, 4992);
    			attr_dev(div31, "class", "row");
    			add_location(div31, file$3, 71, 2, 2101);
    			attr_dev(div32, "class", "container-fluid users");
    			add_location(div32, file$3, 70, 0, 2062);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div32, anchor);
    			append_dev(div32, div31);
    			append_dev(div31, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, input0);
    			set_input_value(input0, /*first_name*/ ctx[2]);
    			append_dev(div8, t3);
    			append_dev(div8, div1);
    			append_dev(div1, label1);
    			append_dev(label1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, input1);
    			set_input_value(input1, /*last_name*/ ctx[3]);
    			append_dev(div8, t6);
    			append_dev(div8, div2);
    			append_dev(div2, label2);
    			append_dev(label2, t7);
    			append_dev(div2, t8);
    			append_dev(div2, input2);
    			set_input_value(input2, /*email*/ ctx[4]);
    			append_dev(div8, t9);
    			append_dev(div8, div3);
    			append_dev(div3, label3);
    			append_dev(label3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, input3);
    			set_input_value(input3, /*username*/ ctx[5]);
    			append_dev(div8, t12);
    			append_dev(div8, div4);
    			append_dev(div4, label4);
    			append_dev(label4, t13);
    			append_dev(div4, t14);
    			append_dev(div4, input4);
    			set_input_value(input4, /*nickname*/ ctx[6]);
    			append_dev(div8, t15);
    			append_dev(div8, div5);
    			append_dev(div5, label5);
    			append_dev(label5, t16);
    			append_dev(div5, t17);
    			append_dev(div5, input5);
    			set_input_value(input5, /*password*/ ctx[8]);
    			append_dev(div8, t18);
    			append_dev(div8, div6);
    			append_dev(div6, label6);
    			append_dev(label6, t19);
    			append_dev(div6, t20);
    			append_dev(div6, input6);
    			set_input_value(input6, /*retypePassword*/ ctx[9]);
    			append_dev(div8, t21);
    			append_dev(div8, div7);
    			append_dev(div7, label7);
    			append_dev(label7, t22);
    			append_dev(div7, t23);
    			append_dev(div7, select0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select0, null);
    			}

    			select_option(select0, /*role*/ ctx[7]);
    			append_dev(div31, t24);
    			append_dev(div31, div30);
    			append_dev(div30, div12);
    			append_dev(div12, div11);
    			info.block.m(div11, info.anchor = null);
    			info.mount = () => div11;
    			info.anchor = null;
    			append_dev(div30, t25);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, h5);
    			append_dev(h5, t26);
    			append_dev(div28, t27);
    			append_dev(div28, hr);
    			append_dev(div28, t28);
    			append_dev(div28, div13);
    			append_dev(div13, input7);
    			input7.checked = /*dark_mode*/ ctx[20];
    			append_dev(div13, label8);
    			append_dev(label8, t29);
    			append_dev(div28, t30);
    			append_dev(div28, h60);
    			append_dev(h60, t31);
    			append_dev(div28, t32);
    			append_dev(div28, div14);
    			append_dev(div14, input8);
    			input8.checked = /*navbar_fixed*/ ctx[17];
    			append_dev(div14, label9);
    			append_dev(label9, t33);
    			append_dev(div28, t34);
    			append_dev(div28, h61);
    			append_dev(h61, t35);
    			append_dev(div28, t36);
    			append_dev(div28, div15);
    			append_dev(div15, input9);
    			input9.checked = /*main_sidebar_collapsed*/ ctx[14];
    			append_dev(div15, label10);
    			append_dev(label10, t37);
    			append_dev(div28, t38);
    			append_dev(div28, div16);
    			append_dev(div16, input10);
    			input10.checked = /*main_fixed*/ ctx[15];
    			append_dev(div16, label11);
    			append_dev(label11, t39);
    			append_dev(div28, t40);
    			append_dev(div28, div17);
    			append_dev(div17, input11);
    			input11.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input11.__value);
    			append_dev(div17, label12);
    			append_dev(label12, t41);
    			append_dev(div28, t42);
    			append_dev(div28, div18);
    			append_dev(div18, input12);
    			input12.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input12.__value);
    			append_dev(div18, label13);
    			append_dev(label13, t43);
    			append_dev(div28, t44);
    			append_dev(div28, div19);
    			append_dev(div19, input13);
    			input13.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input13.__value);
    			append_dev(div19, label14);
    			append_dev(label14, t45);
    			append_dev(div28, t46);
    			append_dev(div28, div20);
    			append_dev(div20, input14);
    			input14.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input14.__value);
    			append_dev(div20, label15);
    			append_dev(label15, t47);
    			append_dev(div28, t48);
    			append_dev(div28, div21);
    			append_dev(div21, input15);
    			input15.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input15.__value);
    			append_dev(div21, label16);
    			append_dev(label16, t49);
    			append_dev(div28, t50);
    			append_dev(div28, div22);
    			append_dev(div22, input16);
    			input16.checked = /*main_sidebar_expand*/ ctx[16];
    			append_dev(div22, label17);
    			append_dev(label17, t51);
    			append_dev(div28, t52);
    			append_dev(div28, h62);
    			append_dev(h62, t53);
    			append_dev(div28, t54);
    			append_dev(div28, div23);
    			append_dev(div23, input17);
    			input17.checked = /*footer_fixed*/ ctx[18];
    			append_dev(div23, label18);
    			append_dev(label18, t55);
    			append_dev(div28, t56);
    			append_dev(div28, h63);
    			append_dev(h63, t57);
    			append_dev(div28, t58);
    			append_dev(div28, div24);
    			append_dev(div24, input18);
    			input18.checked = /*text_size*/ ctx[19];
    			append_dev(div24, label19);
    			append_dev(label19, t59);
    			append_dev(div28, t60);
    			append_dev(div28, h64);
    			append_dev(h64, t61);
    			append_dev(div28, t62);
    			append_dev(div28, div25);
    			append_dev(div25, select1);
    			append_dev(select1, option0);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(select1, option6);
    			append_dev(select1, option7);
    			append_dev(select1, option8);
    			append_dev(select1, option9);
    			append_dev(select1, option10);
    			append_dev(select1, option11);
    			append_dev(select1, option12);
    			append_dev(select1, option13);
    			append_dev(select1, option14);
    			append_dev(select1, option15);
    			append_dev(select1, option16);
    			append_dev(select1, option17);
    			append_dev(select1, option18);
    			select_option(select1, /*navbar_bg*/ ctx[11]);
    			append_dev(div28, t82);
    			append_dev(div28, h65);
    			append_dev(h65, t83);
    			append_dev(div28, t84);
    			append_dev(div28, div26);
    			append_dev(div28, t85);
    			append_dev(div28, select2);
    			append_dev(select2, option19);
    			append_dev(option19, t86);
    			append_dev(select2, option20);
    			append_dev(option20, t87);
    			append_dev(option20, t88);
    			append_dev(option20, t89);
    			append_dev(select2, option21);
    			append_dev(option21, t90);
    			append_dev(option21, t91);
    			append_dev(option21, t92);
    			append_dev(select2, option22);
    			append_dev(option22, t93);
    			append_dev(option22, t94);
    			append_dev(option22, t95);
    			append_dev(select2, option23);
    			append_dev(option23, t96);
    			append_dev(option23, t97);
    			append_dev(option23, t98);
    			append_dev(select2, option24);
    			append_dev(option24, t99);
    			append_dev(option24, t100);
    			append_dev(option24, t101);
    			append_dev(select2, option25);
    			append_dev(option25, t102);
    			append_dev(option25, t103);
    			append_dev(option25, t104);
    			append_dev(select2, option26);
    			append_dev(option26, t105);
    			append_dev(option26, t106);
    			append_dev(option26, t107);
    			append_dev(select2, option27);
    			append_dev(option27, t108);
    			append_dev(option27, t109);
    			append_dev(option27, t110);
    			append_dev(select2, option28);
    			append_dev(option28, t111);
    			append_dev(option28, t112);
    			append_dev(option28, t113);
    			append_dev(select2, option29);
    			append_dev(option29, t114);
    			append_dev(option29, t115);
    			append_dev(option29, t116);
    			append_dev(select2, option30);
    			append_dev(option30, t117);
    			append_dev(option30, t118);
    			append_dev(option30, t119);
    			append_dev(select2, option31);
    			append_dev(option31, t120);
    			append_dev(option31, t121);
    			append_dev(option31, t122);
    			append_dev(select2, option32);
    			append_dev(option32, t123);
    			append_dev(option32, t124);
    			append_dev(option32, t125);
    			append_dev(select2, option33);
    			append_dev(option33, t126);
    			append_dev(option33, t127);
    			append_dev(option33, t128);
    			append_dev(select2, option34);
    			append_dev(option34, t129);
    			append_dev(option34, t130);
    			append_dev(option34, t131);
    			append_dev(select2, option35);
    			append_dev(option35, t132);
    			append_dev(option35, t133);
    			append_dev(option35, t134);
    			append_dev(select2, option36);
    			append_dev(option36, t135);
    			append_dev(option36, t136);
    			append_dev(option36, t137);
    			append_dev(select2, option37);
    			append_dev(option37, t138);
    			append_dev(option37, t139);
    			append_dev(option37, t140);
    			append_dev(select2, option38);
    			append_dev(option38, t141);
    			append_dev(option38, t142);
    			append_dev(option38, t143);
    			append_dev(select2, option39);
    			append_dev(option39, t144);
    			append_dev(option39, t145);
    			append_dev(option39, t146);
    			append_dev(select2, option40);
    			append_dev(option40, t147);
    			append_dev(option40, t148);
    			append_dev(option40, t149);
    			append_dev(select2, option41);
    			append_dev(option41, t150);
    			append_dev(option41, t151);
    			append_dev(option41, t152);
    			append_dev(select2, option42);
    			append_dev(option42, t153);
    			append_dev(option42, t154);
    			append_dev(option42, t155);
    			append_dev(select2, option43);
    			append_dev(option43, t156);
    			append_dev(option43, t157);
    			append_dev(option43, t158);
    			append_dev(select2, option44);
    			append_dev(option44, t159);
    			append_dev(option44, t160);
    			append_dev(option44, t161);
    			append_dev(select2, option45);
    			append_dev(option45, t162);
    			append_dev(option45, t163);
    			append_dev(option45, t164);
    			append_dev(select2, option46);
    			append_dev(option46, t165);
    			append_dev(option46, t166);
    			append_dev(option46, t167);
    			append_dev(select2, option47);
    			append_dev(option47, t168);
    			append_dev(option47, t169);
    			append_dev(option47, t170);
    			append_dev(select2, option48);
    			append_dev(option48, t171);
    			append_dev(option48, t172);
    			append_dev(option48, t173);
    			append_dev(select2, option49);
    			append_dev(option49, t174);
    			append_dev(option49, t175);
    			append_dev(option49, t176);
    			append_dev(select2, option50);
    			append_dev(option50, t177);
    			append_dev(option50, t178);
    			append_dev(option50, t179);
    			append_dev(select2, option51);
    			append_dev(option51, t180);
    			append_dev(option51, t181);
    			append_dev(option51, t182);
    			select_option(select2, /*main_sidebar_bg*/ ctx[12]);
    			append_dev(div28, t183);
    			append_dev(div28, h66);
    			append_dev(h66, t184);
    			append_dev(div28, t185);
    			append_dev(div28, div27);
    			append_dev(div28, t186);
    			append_dev(div28, select3);
    			append_dev(select3, option52);
    			append_dev(option52, t187);
    			append_dev(select3, option53);
    			append_dev(select3, option54);
    			append_dev(select3, option55);
    			append_dev(select3, option56);
    			append_dev(select3, option57);
    			append_dev(select3, option58);
    			append_dev(select3, option59);
    			append_dev(select3, option60);
    			append_dev(select3, option61);
    			append_dev(select3, option62);
    			append_dev(select3, option63);
    			append_dev(select3, option64);
    			append_dev(select3, option65);
    			append_dev(select3, option66);
    			append_dev(select3, option67);
    			append_dev(select3, option68);
    			append_dev(select3, option69);
    			append_dev(select3, option70);
    			append_dev(select3, option71);
    			select_option(select3, /*brand_logo_bg*/ ctx[10]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[26]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[27]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[28]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[29]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[30]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[31]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[32]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[33]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[34]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[35]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[36]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[37]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[38]),
    					listen_dev(input12, "change", /*input12_change_handler*/ ctx[40]),
    					listen_dev(input13, "change", /*input13_change_handler*/ ctx[41]),
    					listen_dev(input14, "change", /*input14_change_handler*/ ctx[42]),
    					listen_dev(input15, "change", /*input15_change_handler*/ ctx[43]),
    					listen_dev(input16, "change", /*input16_change_handler*/ ctx[44]),
    					listen_dev(input17, "change", /*input17_change_handler*/ ctx[45]),
    					listen_dev(input18, "change", /*input18_change_handler*/ ctx[46]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[47]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[48]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[49])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const breadcrump_changes = {};
    			if (dirty[0] & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty[0] & /*active*/ 8388608) breadcrump_changes.active = /*active*/ ctx[23];
    			if (dirty[0] & /*links*/ 4194304) breadcrump_changes.links = /*links*/ ctx[22];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty[0] & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.firstName") + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*first_name*/ 4 && input0.value !== /*first_name*/ ctx[2]) {
    				set_input_value(input0, /*first_name*/ ctx[2]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t4_value !== (t4_value = /*$__*/ ctx[1]("title.lastName") + "")) set_data_dev(t4, t4_value);

    			if (dirty[0] & /*last_name*/ 8 && input1.value !== /*last_name*/ ctx[3]) {
    				set_input_value(input1, /*last_name*/ ctx[3]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t7_value !== (t7_value = /*$__*/ ctx[1]("title.email") + "")) set_data_dev(t7, t7_value);

    			if (dirty[0] & /*email*/ 16 && input2.value !== /*email*/ ctx[4]) {
    				set_input_value(input2, /*email*/ ctx[4]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t10_value !== (t10_value = /*$__*/ ctx[1]("title.username") + "")) set_data_dev(t10, t10_value);

    			if (dirty[0] & /*username*/ 32 && input3.value !== /*username*/ ctx[5]) {
    				set_input_value(input3, /*username*/ ctx[5]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t13_value !== (t13_value = /*$__*/ ctx[1]("title.nickname") + "")) set_data_dev(t13, t13_value);

    			if (dirty[0] & /*nickname*/ 64 && input4.value !== /*nickname*/ ctx[6]) {
    				set_input_value(input4, /*nickname*/ ctx[6]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t16_value !== (t16_value = /*$__*/ ctx[1]("title.password") + "")) set_data_dev(t16, t16_value);

    			if (dirty[0] & /*password*/ 256 && input5.value !== /*password*/ ctx[8]) {
    				set_input_value(input5, /*password*/ ctx[8]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t19_value !== (t19_value = /*$__*/ ctx[1]("title.retypePassword") + "")) set_data_dev(t19, t19_value);

    			if (dirty[0] & /*retypePassword*/ 512 && input6.value !== /*retypePassword*/ ctx[9]) {
    				set_input_value(input6, /*retypePassword*/ ctx[9]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t22_value !== (t22_value = /*$__*/ ctx[1]("title.role") + "")) set_data_dev(t22, t22_value);

    			if (dirty[0] & /*roles*/ 16777216) {
    				each_value = /*roles*/ ctx[24];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*role, roles*/ 16777344) {
    				select_option(select0, /*role*/ ctx[7]);
    			}

    			info.ctx = ctx;

    			if (dirty[0] & /*promise*/ 2097152 && promise_1 !== (promise_1 = /*promise*/ ctx[21]) && handle_promise(promise_1, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t26_value !== (t26_value = /*$__*/ ctx[1]("any.customize") + "")) set_data_dev(t26, t26_value);

    			if (dirty[0] & /*dark_mode*/ 1048576) {
    				input7.checked = /*dark_mode*/ ctx[20];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t29_value !== (t29_value = /*$__*/ ctx[1]("any.darkMode") + "")) set_data_dev(t29, t29_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t31_value !== (t31_value = /*$__*/ ctx[1]("any.headerOptions") + "")) set_data_dev(t31, t31_value);

    			if (dirty[0] & /*navbar_fixed*/ 131072) {
    				input8.checked = /*navbar_fixed*/ ctx[17];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t33_value !== (t33_value = /*$__*/ ctx[1]("any.fixed") + "")) set_data_dev(t33, t33_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t35_value !== (t35_value = /*$__*/ ctx[1]("any.sidebarOptions") + "")) set_data_dev(t35, t35_value);

    			if (dirty[0] & /*main_sidebar_collapsed*/ 16384) {
    				input9.checked = /*main_sidebar_collapsed*/ ctx[14];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t37_value !== (t37_value = /*$__*/ ctx[1]("any.collapsed") + "")) set_data_dev(t37, t37_value);

    			if (dirty[0] & /*main_fixed*/ 32768) {
    				input10.checked = /*main_fixed*/ ctx[15];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t39_value !== (t39_value = /*$__*/ ctx[1]("any.fixed") + "")) set_data_dev(t39, t39_value);

    			if (dirty[0] & /*main_sidebar_nav_style*/ 8192) {
    				input11.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input11.__value);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t41_value !== (t41_value = /*$__*/ ctx[1]("any.navFlat") + "")) set_data_dev(t41, t41_value);

    			if (dirty[0] & /*main_sidebar_nav_style*/ 8192) {
    				input12.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input12.__value);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t43_value !== (t43_value = /*$__*/ ctx[1]("any.navLegacy") + "")) set_data_dev(t43, t43_value);

    			if (dirty[0] & /*main_sidebar_nav_style*/ 8192) {
    				input13.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input13.__value);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t45_value !== (t45_value = /*$__*/ ctx[1]("any.navCompact") + "")) set_data_dev(t45, t45_value);

    			if (dirty[0] & /*main_sidebar_nav_style*/ 8192) {
    				input14.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input14.__value);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t47_value !== (t47_value = /*$__*/ ctx[1]("any.navChildIndent") + "")) set_data_dev(t47, t47_value);

    			if (dirty[0] & /*main_sidebar_nav_style*/ 8192) {
    				input15.checked = ~/*main_sidebar_nav_style*/ ctx[13].indexOf(input15.__value);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t49_value !== (t49_value = /*$__*/ ctx[1]("any.navChildHideOnCollapse") + "")) set_data_dev(t49, t49_value);

    			if (dirty[0] & /*main_sidebar_expand*/ 65536) {
    				input16.checked = /*main_sidebar_expand*/ ctx[16];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t51_value !== (t51_value = /*$__*/ ctx[1]("any.disableHoverFocusAutoExpand") + "")) set_data_dev(t51, t51_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t53_value !== (t53_value = /*$__*/ ctx[1]("any.footerOptions") + "")) set_data_dev(t53, t53_value);

    			if (dirty[0] & /*footer_fixed*/ 262144) {
    				input17.checked = /*footer_fixed*/ ctx[18];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t55_value !== (t55_value = /*$__*/ ctx[1]("any.fixed") + "")) set_data_dev(t55, t55_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t57_value !== (t57_value = /*$__*/ ctx[1]("any.smallTextOption") + "")) set_data_dev(t57, t57_value);

    			if (dirty[0] & /*text_size*/ 524288) {
    				input18.checked = /*text_size*/ ctx[19];
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t59_value !== (t59_value = /*$__*/ ctx[1]("any.body") + "")) set_data_dev(t59, t59_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t61_value !== (t61_value = /*$__*/ ctx[1]("any.navbarVariants") + "")) set_data_dev(t61, t61_value);

    			if (dirty[0] & /*navbar_bg*/ 2048) {
    				select_option(select1, /*navbar_bg*/ ctx[11]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t83_value !== (t83_value = /*$__*/ ctx[1]("any.sidebarVariants") + "")) set_data_dev(t83, t83_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t86_value !== (t86_value = /*$__*/ ctx[1]("any.noneSelected") + "")) set_data_dev(t86, t86_value);

    			if (!current || dirty[0] & /*$__*/ 2 && option19_value_value !== (option19_value_value = /*$__*/ ctx[1]("any.noneSelected"))) {
    				prop_dev(option19, "__value", option19_value_value);
    				option19.value = option19.__value;
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t87_value !== (t87_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t87, t87_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t89_value !== (t89_value = /*$__*/ ctx[1]("any.primary") + "")) set_data_dev(t89, t89_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t90_value !== (t90_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t90, t90_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t92_value !== (t92_value = /*$__*/ ctx[1]("any.warning") + "")) set_data_dev(t92, t92_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t93_value !== (t93_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t93, t93_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t95_value !== (t95_value = /*$__*/ ctx[1]("any.info") + "")) set_data_dev(t95, t95_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t96_value !== (t96_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t96, t96_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t98_value !== (t98_value = /*$__*/ ctx[1]("any.danger") + "")) set_data_dev(t98, t98_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t99_value !== (t99_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t99, t99_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t101_value !== (t101_value = /*$__*/ ctx[1]("any.success") + "")) set_data_dev(t101, t101_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t102_value !== (t102_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t102, t102_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t104_value !== (t104_value = /*$__*/ ctx[1]("any.indigo") + "")) set_data_dev(t104, t104_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t105_value !== (t105_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t105, t105_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t107_value !== (t107_value = /*$__*/ ctx[1]("any.lightblue") + "")) set_data_dev(t107, t107_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t108_value !== (t108_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t108, t108_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t110_value !== (t110_value = /*$__*/ ctx[1]("any.navy") + "")) set_data_dev(t110, t110_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t111_value !== (t111_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t111, t111_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t113_value !== (t113_value = /*$__*/ ctx[1]("any.purple") + "")) set_data_dev(t113, t113_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t114_value !== (t114_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t114, t114_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t116_value !== (t116_value = /*$__*/ ctx[1]("any.fuchsia") + "")) set_data_dev(t116, t116_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t117_value !== (t117_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t117, t117_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t119_value !== (t119_value = /*$__*/ ctx[1]("any.pink") + "")) set_data_dev(t119, t119_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t120_value !== (t120_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t120, t120_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t122_value !== (t122_value = /*$__*/ ctx[1]("any.maroon") + "")) set_data_dev(t122, t122_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t123_value !== (t123_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t123, t123_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t125_value !== (t125_value = /*$__*/ ctx[1]("any.orange") + "")) set_data_dev(t125, t125_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t126_value !== (t126_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t126, t126_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t128_value !== (t128_value = /*$__*/ ctx[1]("any.lime") + "")) set_data_dev(t128, t128_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t129_value !== (t129_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t129, t129_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t131_value !== (t131_value = /*$__*/ ctx[1]("any.teal") + "")) set_data_dev(t131, t131_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t132_value !== (t132_value = /*$__*/ ctx[1]("any.dark") + "")) set_data_dev(t132, t132_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t134_value !== (t134_value = /*$__*/ ctx[1]("any.olive") + "")) set_data_dev(t134, t134_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t135_value !== (t135_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t135, t135_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t137_value !== (t137_value = /*$__*/ ctx[1]("any.primary") + "")) set_data_dev(t137, t137_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t138_value !== (t138_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t138, t138_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t140_value !== (t140_value = /*$__*/ ctx[1]("any.warning") + "")) set_data_dev(t140, t140_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t141_value !== (t141_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t141, t141_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t143_value !== (t143_value = /*$__*/ ctx[1]("any.info") + "")) set_data_dev(t143, t143_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t144_value !== (t144_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t144, t144_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t146_value !== (t146_value = /*$__*/ ctx[1]("any.danger") + "")) set_data_dev(t146, t146_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t147_value !== (t147_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t147, t147_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t149_value !== (t149_value = /*$__*/ ctx[1]("any.success") + "")) set_data_dev(t149, t149_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t150_value !== (t150_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t150, t150_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t152_value !== (t152_value = /*$__*/ ctx[1]("any.indigo") + "")) set_data_dev(t152, t152_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t153_value !== (t153_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t153, t153_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t155_value !== (t155_value = /*$__*/ ctx[1]("any.lightblue") + "")) set_data_dev(t155, t155_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t156_value !== (t156_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t156, t156_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t158_value !== (t158_value = /*$__*/ ctx[1]("any.navy") + "")) set_data_dev(t158, t158_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t159_value !== (t159_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t159, t159_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t161_value !== (t161_value = /*$__*/ ctx[1]("any.purple") + "")) set_data_dev(t161, t161_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t162_value !== (t162_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t162, t162_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t164_value !== (t164_value = /*$__*/ ctx[1]("any.fuchsia") + "")) set_data_dev(t164, t164_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t165_value !== (t165_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t165, t165_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t167_value !== (t167_value = /*$__*/ ctx[1]("any.pink") + "")) set_data_dev(t167, t167_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t168_value !== (t168_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t168, t168_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t170_value !== (t170_value = /*$__*/ ctx[1]("any.maroon") + "")) set_data_dev(t170, t170_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t171_value !== (t171_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t171, t171_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t173_value !== (t173_value = /*$__*/ ctx[1]("any.orange") + "")) set_data_dev(t173, t173_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t174_value !== (t174_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t174, t174_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t176_value !== (t176_value = /*$__*/ ctx[1]("any.lime") + "")) set_data_dev(t176, t176_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t177_value !== (t177_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t177, t177_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t179_value !== (t179_value = /*$__*/ ctx[1]("any.teal") + "")) set_data_dev(t179, t179_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t180_value !== (t180_value = /*$__*/ ctx[1]("any.light") + "")) set_data_dev(t180, t180_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t182_value !== (t182_value = /*$__*/ ctx[1]("any.olive") + "")) set_data_dev(t182, t182_value);

    			if (dirty[0] & /*main_sidebar_bg, $__*/ 4098) {
    				select_option(select2, /*main_sidebar_bg*/ ctx[12]);
    			}

    			if ((!current || dirty[0] & /*$__*/ 2) && t184_value !== (t184_value = /*$__*/ ctx[1]("any.brandLogoVariants") + "")) set_data_dev(t184, t184_value);
    			if ((!current || dirty[0] & /*$__*/ 2) && t187_value !== (t187_value = /*$__*/ ctx[1]("any.noneSelected") + "")) set_data_dev(t187, t187_value);

    			if (!current || dirty[0] & /*$__*/ 2 && option52_value_value !== (option52_value_value = /*$__*/ ctx[1]("any.noneSelected"))) {
    				prop_dev(option52, "__value", option52_value_value);
    				option52.value = option52.__value;
    			}

    			if (dirty[0] & /*brand_logo_bg, $__*/ 1026) {
    				select_option(select3, /*brand_logo_bg*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div32);
    			destroy_each(each_blocks, detaching);
    			info.block.d();
    			info.token = null;
    			info = null;
    			/*$$binding_groups*/ ctx[39][0].splice(/*$$binding_groups*/ ctx[39][0].indexOf(input11), 1);
    			/*$$binding_groups*/ ctx[39][0].splice(/*$$binding_groups*/ ctx[39][0].indexOf(input12), 1);
    			/*$$binding_groups*/ ctx[39][0].splice(/*$$binding_groups*/ ctx[39][0].indexOf(input13), 1);
    			/*$$binding_groups*/ ctx[39][0].splice(/*$$binding_groups*/ ctx[39][0].indexOf(input14), 1);
    			/*$$binding_groups*/ ctx[39][0].splice(/*$$binding_groups*/ ctx[39][0].indexOf(input15), 1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create', slots, []);
    	let first_name = 'Murat';
    	let last_name = 'Hasdemir';
    	let email = 'q@c.c';
    	let username = 'hs';
    	let nickname = 'hs';
    	let role = 'admin';
    	let password = '1';
    	let retypePassword = '1';
    	let brand_logo_bg;
    	let navbar_bg;
    	let main_sidebar_bg;
    	let main_sidebar_nav_style = [];
    	let main_sidebar_collapsed;
    	let main_fixed;
    	let main_sidebar_expand;
    	let navbar_fixed;
    	let footer_fixed;
    	let text_size;
    	let dark_mode;
    	let roles = ["admin", "editor"];
    	let promise;
    	let options;

    	async function submit() {
    		options = {
    			theme_brand_logo_bg: brand_logo_bg,
    			theme_navbar_bg: navbar_bg,
    			theme_main_sidebar_bg: main_sidebar_bg,
    			theme_main_sidebar_nav_style: main_sidebar_nav_style.join(" "),
    			theme_main_sidebar_collapsed: main_sidebar_collapsed == "true"
    			? "sidebar-collapse"
    			: "",
    			theme_main_fixed: main_fixed == "true" ? "layout-fixed" : "",
    			theme_main_sidebar_expand: main_sidebar_expand == "true" ? "sidebar-no-expand" : "",
    			theme_navbar_fixed: navbar_fixed == "true" ? "layout-navbar-fixed" : "",
    			theme_footer_fixed: footer_fixed == "true" ? "layout-footer-fixed" : "",
    			theme_text_size: text_size == "true" ? "text-sm" : "",
    			theme_dark_mode: dark_mode == "true" ? "dark-mode" : ""
    		};

    		if (password == retypePassword) {
    			$$invalidate(21, promise = await create(api.user, {
    				first_name,
    				last_name,
    				email,
    				username,
    				nickname,
    				role,
    				password,
    				password_verified: retypePassword,
    				options
    			}));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		first_name = this.value;
    		$$invalidate(2, first_name);
    	}

    	function input1_input_handler() {
    		last_name = this.value;
    		$$invalidate(3, last_name);
    	}

    	function input2_input_handler() {
    		email = this.value;
    		$$invalidate(4, email);
    	}

    	function input3_input_handler() {
    		username = this.value;
    		$$invalidate(5, username);
    	}

    	function input4_input_handler() {
    		nickname = this.value;
    		$$invalidate(6, nickname);
    	}

    	function input5_input_handler() {
    		password = this.value;
    		$$invalidate(8, password);
    	}

    	function input6_input_handler() {
    		retypePassword = this.value;
    		$$invalidate(9, retypePassword);
    	}

    	function select0_change_handler() {
    		role = select_value(this);
    		$$invalidate(7, role);
    		$$invalidate(24, roles);
    	}

    	function input7_change_handler() {
    		dark_mode = this.checked;
    		$$invalidate(20, dark_mode);
    	}

    	function input8_change_handler() {
    		navbar_fixed = this.checked;
    		$$invalidate(17, navbar_fixed);
    	}

    	function input9_change_handler() {
    		main_sidebar_collapsed = this.checked;
    		$$invalidate(14, main_sidebar_collapsed);
    	}

    	function input10_change_handler() {
    		main_fixed = this.checked;
    		$$invalidate(15, main_fixed);
    	}

    	function input11_change_handler() {
    		main_sidebar_nav_style = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(13, main_sidebar_nav_style);
    	}

    	function input12_change_handler() {
    		main_sidebar_nav_style = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(13, main_sidebar_nav_style);
    	}

    	function input13_change_handler() {
    		main_sidebar_nav_style = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(13, main_sidebar_nav_style);
    	}

    	function input14_change_handler() {
    		main_sidebar_nav_style = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(13, main_sidebar_nav_style);
    	}

    	function input15_change_handler() {
    		main_sidebar_nav_style = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(13, main_sidebar_nav_style);
    	}

    	function input16_change_handler() {
    		main_sidebar_expand = this.checked;
    		$$invalidate(16, main_sidebar_expand);
    	}

    	function input17_change_handler() {
    		footer_fixed = this.checked;
    		$$invalidate(18, footer_fixed);
    	}

    	function input18_change_handler() {
    		text_size = this.checked;
    		$$invalidate(19, text_size);
    	}

    	function select1_change_handler() {
    		navbar_bg = select_value(this);
    		$$invalidate(11, navbar_bg);
    	}

    	function select2_change_handler() {
    		main_sidebar_bg = select_value(this);
    		$$invalidate(12, main_sidebar_bg);
    	}

    	function select3_change_handler() {
    		brand_logo_bg = select_value(this);
    		$$invalidate(10, brand_logo_bg);
    	}

    	$$self.$capture_state = () => ({
    		__,
    		Breadcrump,
    		create,
    		update,
    		read,
    		api,
    		first_name,
    		last_name,
    		email,
    		username,
    		nickname,
    		role,
    		password,
    		retypePassword,
    		brand_logo_bg,
    		navbar_bg,
    		main_sidebar_bg,
    		main_sidebar_nav_style,
    		main_sidebar_collapsed,
    		main_fixed,
    		main_sidebar_expand,
    		navbar_fixed,
    		footer_fixed,
    		text_size,
    		dark_mode,
    		roles,
    		promise,
    		options,
    		submit,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('first_name' in $$props) $$invalidate(2, first_name = $$props.first_name);
    		if ('last_name' in $$props) $$invalidate(3, last_name = $$props.last_name);
    		if ('email' in $$props) $$invalidate(4, email = $$props.email);
    		if ('username' in $$props) $$invalidate(5, username = $$props.username);
    		if ('nickname' in $$props) $$invalidate(6, nickname = $$props.nickname);
    		if ('role' in $$props) $$invalidate(7, role = $$props.role);
    		if ('password' in $$props) $$invalidate(8, password = $$props.password);
    		if ('retypePassword' in $$props) $$invalidate(9, retypePassword = $$props.retypePassword);
    		if ('brand_logo_bg' in $$props) $$invalidate(10, brand_logo_bg = $$props.brand_logo_bg);
    		if ('navbar_bg' in $$props) $$invalidate(11, navbar_bg = $$props.navbar_bg);
    		if ('main_sidebar_bg' in $$props) $$invalidate(12, main_sidebar_bg = $$props.main_sidebar_bg);
    		if ('main_sidebar_nav_style' in $$props) $$invalidate(13, main_sidebar_nav_style = $$props.main_sidebar_nav_style);
    		if ('main_sidebar_collapsed' in $$props) $$invalidate(14, main_sidebar_collapsed = $$props.main_sidebar_collapsed);
    		if ('main_fixed' in $$props) $$invalidate(15, main_fixed = $$props.main_fixed);
    		if ('main_sidebar_expand' in $$props) $$invalidate(16, main_sidebar_expand = $$props.main_sidebar_expand);
    		if ('navbar_fixed' in $$props) $$invalidate(17, navbar_fixed = $$props.navbar_fixed);
    		if ('footer_fixed' in $$props) $$invalidate(18, footer_fixed = $$props.footer_fixed);
    		if ('text_size' in $$props) $$invalidate(19, text_size = $$props.text_size);
    		if ('dark_mode' in $$props) $$invalidate(20, dark_mode = $$props.dark_mode);
    		if ('roles' in $$props) $$invalidate(24, roles = $$props.roles);
    		if ('promise' in $$props) $$invalidate(21, promise = $$props.promise);
    		if ('options' in $$props) options = $$props.options;
    		if ('links' in $$props) $$invalidate(22, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(23, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.users"));
    		}

    		if ($$self.$$.dirty[0] & /*title*/ 1) {
    			$$invalidate(23, active = title);
    		}

    		if ($$self.$$.dirty[0] & /*$__*/ 2) {
    			$$invalidate(22, links = [
    				{
    					pageUrl: "admin",
    					pageTitle: $__("title.dashboard")
    				}
    			]);
    		}
    	};

    	return [
    		title,
    		$__,
    		first_name,
    		last_name,
    		email,
    		username,
    		nickname,
    		role,
    		password,
    		retypePassword,
    		brand_logo_bg,
    		navbar_bg,
    		main_sidebar_bg,
    		main_sidebar_nav_style,
    		main_sidebar_collapsed,
    		main_fixed,
    		main_sidebar_expand,
    		navbar_fixed,
    		footer_fixed,
    		text_size,
    		dark_mode,
    		promise,
    		links,
    		active,
    		roles,
    		submit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		select0_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		input10_change_handler,
    		input11_change_handler,
    		$$binding_groups,
    		input12_change_handler,
    		input13_change_handler,
    		input14_change_handler,
    		input15_change_handler,
    		input16_change_handler,
    		input17_change_handler,
    		input18_change_handler,
    		select1_change_handler,
    		select2_change_handler,
    		select3_change_handler
    	];
    }

    class Create extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\layouts\index.svelte generated by Svelte v3.46.6 */
    const file$2 = "src\\pages\\layouts\\index.svelte";

    function create_fragment$2(ctx) {
    	let breadcrump;
    	let t0;
    	let div;
    	let t1_value = /*$__*/ ctx[1]("title.layouts") + "";
    	let t1;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[3],
    				links: /*links*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "container-fluid layouts");
    			add_location(div, file$2, 13, 0, 416);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 8) breadcrump_changes.active = /*active*/ ctx[3];
    			if (dirty & /*links*/ 4) breadcrump_changes.links = /*links*/ ctx[2];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.layouts") + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layouts', slots, []);
    	onMount(checkAuth);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layouts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__,
    		Breadcrump,
    		checkAuth,
    		onMount,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.layouts"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(3, active = title);
    		}

    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(2, links = [
    				{
    					pageUrl: "admin",
    					pageTitle: $__("title.dashboard")
    				}
    			]);
    		}
    	};

    	return [title, $__, links, active];
    }

    class Layouts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layouts",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Dashboard.svelte generated by Svelte v3.46.6 */
    const file$1 = "src\\pages\\Dashboard.svelte";

    function create_fragment$1(ctx) {
    	let breadcrump;
    	let t0;
    	let div;
    	let t1_value = /*$__*/ ctx[1]("title.dashboard") + "";
    	let t1;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[3],
    				links: /*links*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "container-fluid dashboard");
    			add_location(div, file$1, 13, 0, 365);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 8) breadcrump_changes.active = /*active*/ ctx[3];
    			if (dirty & /*links*/ 4) breadcrump_changes.links = /*links*/ ctx[2];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.dashboard") + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	onMount(checkAuth);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__,
    		Breadcrump,
    		onMount,
    		checkAuth,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.dashboard"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(3, active = title);
    		}
    	};

    	$$invalidate(2, links = []);
    	return [title, $__, links, active];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.6 */
    const file = "src\\App.svelte";

    // (23:6) <Route path={route.login} primary={false}>
    function create_default_slot_9(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(23:6) <Route path={route.login} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (24:6) <Route path={route.register} primary={false}>
    function create_default_slot_8(ctx) {
    	let register;
    	let current;
    	register = new Register({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(register.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(register, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(register.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(register.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(register, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(24:6) <Route path={route.register} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Route path={route.forgetPassword} primary={false}>
    function create_default_slot_7(ctx) {
    	let password;
    	let current;
    	password = new Password({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(password.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(password, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(password.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(password.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(password, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(25:6) <Route path={route.forgetPassword} primary={false}>",
    		ctx
    	});

    	return block;
    }

    // (38:14) <Route path={route.home}>
    function create_default_slot_6(ctx) {
    	let dashboard;
    	let current;
    	dashboard = new Dashboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(38:14) <Route path={route.home}>",
    		ctx
    	});

    	return block;
    }

    // (41:14) <Route path={route.users}>
    function create_default_slot_5(ctx) {
    	let users;
    	let current;
    	users = new Users({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(users.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(users, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(users.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(users.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(users, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(41:14) <Route path={route.users}>",
    		ctx
    	});

    	return block;
    }

    // (44:14) <Route path={route.user}>
    function create_default_slot_4(ctx) {
    	let usercreate;
    	let current;
    	usercreate = new Create({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usercreate.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usercreate, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usercreate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usercreate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usercreate, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(44:14) <Route path={route.user}>",
    		ctx
    	});

    	return block;
    }

    // (47:14) <Route path={route.layouts}>
    function create_default_slot_3(ctx) {
    	let layouts;
    	let current;
    	layouts = new Layouts({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(layouts.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layouts, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layouts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layouts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layouts, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(47:14) <Route path={route.layouts}>",
    		ctx
    	});

    	return block;
    }

    // (26:6) <Route path="{route.admin}/*" meta={{ name: "admin" }}>
    function create_default_slot_2(ctx) {
    	let div2;
    	let nav;
    	let t0;
    	let mainsidebar;
    	let t1;
    	let div1;
    	let div0;
    	let route0;
    	let t2;
    	let route1;
    	let t3;
    	let route2;
    	let t4;
    	let route3;
    	let t5;
    	let controlsidebar;
    	let t6;
    	let footer;
    	let current;
    	nav = new Nav({ $$inline: true });
    	mainsidebar = new MainSidebar({ $$inline: true });

    	route0 = new Route$1({
    			props: {
    				path: route.home,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: route.users,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: route.user,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: route.layouts,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	controlsidebar = new ControlSidebar({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(mainsidebar.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(route0.$$.fragment);
    			t2 = space();
    			create_component(route1.$$.fragment);
    			t3 = space();
    			create_component(route2.$$.fragment);
    			t4 = space();
    			create_component(route3.$$.fragment);
    			t5 = space();
    			create_component(controlsidebar.$$.fragment);
    			t6 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file, 36, 12, 1479);
    			attr_dev(div1, "class", "content-wrapper");
    			add_location(div1, file, 35, 10, 1436);
    			attr_dev(div2, "class", "wrapper");
    			add_location(div2, file, 26, 8, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(nav, div2, null);
    			append_dev(div2, t0);
    			mount_component(mainsidebar, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(route0, div0, null);
    			append_dev(div0, t2);
    			mount_component(route1, div0, null);
    			append_dev(div0, t3);
    			mount_component(route2, div0, null);
    			append_dev(div0, t4);
    			mount_component(route3, div0, null);
    			append_dev(div2, t5);
    			mount_component(controlsidebar, div2, null);
    			append_dev(div2, t6);
    			mount_component(footer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(mainsidebar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(controlsidebar.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(mainsidebar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(controlsidebar.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(nav);
    			destroy_component(mainsidebar);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(controlsidebar);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(26:6) <Route path=\\\"{route.admin}/*\\\" meta={{ name: \\\"admin\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (21:2) <Router>
    function create_default_slot_1(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: route.login,
    				primary: false,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: route.register,
    				primary: false,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: route.forgetPassword,
    				primary: false,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "" + (route.admin + "/*"),
    				meta: { name: "admin" },
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(div, "class", "sidebar-mini");
    			add_location(div, file, 21, 4, 877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(21:2) <Router>",
    		ctx
    	});

    	return block;
    }

    // (20:0) <Translator>
    function create_default_slot(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(20:0) <Translator>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let translator;
    	let current;

    	translator = new Translator({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(translator.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(translator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const translator_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				translator_changes.$$scope = { dirty, ctx };
    			}

    			translator.$set(translator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(translator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(translator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(translator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Translator,
    		__,
    		Route: Route$1,
    		Router: Router$1,
    		Login,
    		Register,
    		Password,
    		Nav,
    		MainSidebar,
    		ControlSidebar,
    		Footer,
    		Users,
    		UserCreate: Create,
    		Layouts,
    		Dashboard,
    		route
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
