window.functionFlows = (() => {
    const o_function_flows_global = [];

    /**
     * この変数で指定した名前を持つオブジェクトが関数フローの先の関数(s_to)として使用された場合、関数フローの対象外にする。
     * new で呼び出した場合も関数フローの対象外にする。
     * 変数 s_ignore_objectNames_global は既定値であり、既定値をもとに設定画面で設定でき、設定値が変数 s_ignore_objectNames に入る。
     */
    const s_ignore_objectNames_global = ["console", "JSON", "Array", "Object", "GM", "Math", "localStorage", "String", "Number", "document", "trustedTypes", "classList", "speechSynthesis", "history", "Promise", "FileReader", "Map", "navigator", "Date", "fs", "process", "Map", "Error", "path"];
    let s_ignore_objectNames;

    /**
     * この変数で指定した関数名が関数フローの先の関数(s_to)として使用された場合、関数フローの対象にする。
     * この変数は他の変数より優先度が高い。
     * この変数で指定した関数名が任意の呼び出し元関数の引数名と一致した場合も関数フローの対象にする（特別ルール）。
     */
    const s_include_functionNames_global = ["addEventListener"];
    let s_include_functionNames;

    /**
     * この変数で指定した関数名が関数フローの先の関数(s_to)として使用された場合、関数フローの対象外にする。
     */
    const s_ignore_functionNames_global = ["String", "BigInt", "Number", "Symbol", "parseInt", "parseFloat", "push", "pop", "set", "get", "closest", "matches", "add", "join", "preventDefault", "querySelectorAll", "querySelector", "insertAdjacentHTML", "insertAdjacentElement", "contains", "scrollIntoView", "getElementById", "setAttribute", "getAttribute", "click", "setTimeout", "clearTimeout", "now", "stopImmediatePropagation", "append", "createElement", "getBoundingClientRect", "remove", "find", "filter", "map", "forEach", "reduce", "every", "some", "checkVisibility", "stopPropagation", "encodeURIComponent", "decodeURIComponent", "splice", "getSelection", "scrollTo", "replaceChildren", "setStartBefore", "setEndBefore", "setStartAfter", "setEndAfter", "setStart", "setEnd", "addRange", "removeAllRanges", "removeRange", "collapseToStart", "collapseToEnd", "empty", "getRangeAt", "compareBoundaryPoints", "selectNode", "surroundContents", "extractContents", "has", "keys", "next", "nextNode", "alert", "prompt", "exec", "after", "before", "createHTML", "removeEventListener", "bind", "getComputedStyle", "at", "charAt", "charCodeAt", "codePointAt", "concat", "endsWith", "includes", "indexOf", "lastIndexOf", "match", "matchAll", "normalize", "padEnd", "padStart", "repeat", "replace", "replaceAll", "search", "slice", "split", "startsWith", "substring", "toLocaleLowerCase", "toLocaleUpperCase", "toLowerCase", "toString", "toUpperCase", "trim", "trimEnd", "trimLeft", "trimRight", "trimStart", "$"];
    let s_ignore_functionNames;

    const concat_s_from_property = (s_from, s_add) => {
        if (s_add === void 0) {
            s_add = "?";
        }

        if (s_from === void 0) {
            return s_add;
        }

        return `${s_from}.${s_add}`;
    };

    /**
     * 関数名を返す。
     * 関数フローにおける先の関数名(s_to)をチェックする。元の関数名(s_from)はチェックしない。
     * ignore 条件と include 条件をチェックする。
     * ignore になった場合、 void 0 を返す。
     * { "b_ignoreCheck": true } で呼び出した場合、チェックを行わない。
     * analyze_NewExpression から呼び出した場合のみ { "b_new": true } で呼び出す。
     */
    const get_functionName = (node_base, { b_ignoreCheck = false, b_new = false } = {}) => {
        let n_include_global = 0;
        let n_ignore_global = 0;

        const check_name = (s_name, o_arg) => {
            if (b_ignoreCheck) {
                return;
            }

            if (o_arg.b_newTop) {
                /**
                 * new hoge における hoge の場合。
                 */
                if (s_ignore_objectNames.includes(s_name)) {
                    n_ignore_global++;
                }
            } else if (o_arg.b_Call) {
                /**
                 * hoge() の場合。
                 */
                if (s_include_functionNames.includes(s_name)) {
                    n_include_global++;
                }

                if (s_ignore_functionNames.includes(s_name)) {
                    n_ignore_global++;
                }
            } else if (o_arg.b_MemberObject) {
                /**
                 * hoge.fuga における hoge の場合。
                 */
                if (s_ignore_objectNames.includes(s_name)) {
                    n_ignore_global++;
                }
            } else if (o_arg.b_MemberProperty) {
                if (o_arg.b_CallMemberProperty) {
                    /**
                     * hoge.fuga.piyo における右端の piyo の場合と hoge.fuga().piyo における fuga の場合。
                     */
                    if (s_include_functionNames.includes(s_name)) {
                        n_include_global++;
                    }

                    if (s_ignore_functionNames.includes(s_name)) {
                        n_ignore_global++;
                    }

                } else if (s_ignore_objectNames.includes(s_name)) {
                    /**
                     * hoge.fuga.piyo における右端の fuga の場合。
                     */
                    n_ignore_global++;
                }
            } else if (o_arg.b_this) {
                console.assert(s_name === "this");

                if (s_ignore_objectNames.includes(s_name)) {
                    /**
                     * this.hoge における this の場合。
                     */
                    n_ignore_global++;
                }
            }
        };

        const get_name_sub = (node, o_arg) => {
            let s_name;

            if (!node) {
                return "";
            }

            switch (node.type) {
                case "MemberExpression": {
                    const s_name_object = get_name_sub(node.object, {
                        "b_MemberObject": true
                    });
                    const s_name_property = get_name_sub(node.property, {
                        "b_MemberProperty": true,
                        "b_CallMemberProperty": o_arg.b_Call
                    });

                    if (s_name_property === "[?]") {
                        return s_name_object + s_name_property;
                    }

                    if (s_name_property.includes(".")) {
                        return `${s_name_object}[${s_name_property}]`;
                    }

                    return `${s_name_object}.${s_name_property}`;
                }

                case "ThisExpression":
                    s_name = "this";
                    check_name(s_name, { "b_this": true });
                    break;

                case "Identifier":
                    s_name = node.name;
                    check_name(s_name, o_arg);
                    break;

                case "PrivateIdentifier":
                    s_name = node.name;
                    check_name(s_name, o_arg);
                    break;

                case "PrivateName":
                    s_name = get_name_sub(node.id, o_arg);
                    break;

                case "Literal":
                case "NumericLiteral":
                case "StringLiteral":
                case "BooleanLiteral":
                    s_name = String(node.value);
                    check_name(s_name, o_arg);
                    if (o_arg.b_MemberProperty && Number.isInteger(node.value)) {
                        s_name = "[?]";
                    }
                    break;

                case "NullLiteral":
                    s_name = "null";
                    check_name(s_name, o_arg);
                    break;

                case "RegExpLiteral":
                    s_name = node.extra.raw;
                    check_name(s_name, o_arg);
                    break;

                case "BigIntLiteral":
                    s_name = node.extra.raw;
                    check_name(s_name, o_arg);
                    break;

                case "CallExpression":
                    s_name = `${get_name_sub(node.callee, {
                        "b_Call": true
                    })}()`;
                    break;

                case "ArrowFunctionExpression":
                    s_name = "()=>{}";
                    break;

                case "FunctionExpression": {
                    const s_temp = get_name_sub(node.id, o_arg);
                    if (s_temp) {
                        s_name = s_temp;
                    } else {
                        s_name = "function(){}";
                    }
                    break;
                }

                case "UnaryExpression":
                    if (o_arg.b_MemberProperty && Number.isInteger(node.argument.value)) {
                        s_name = "[?]";
                    } else {
                        s_name = "?";
                    }
                    break;

                default:
                    s_name = "?";
                    break;
            }

            return s_name;
        };

        if (node_base == void 0) {
            return void 0;
        }

        let s_name = get_name_sub(node_base, {
            "b_Call": true,
            "b_newTop": b_new
        });

        if (s_name === void 0) {
            s_name = "?";
        }

        if (n_include_global > 0
            || n_ignore_global === 0) {
            return s_name;
        }

        console.log(`Function "${s_name}" was excluded from function flows.`);

        /**
         * 非表示判定された場合、 undefined を返す。
         */
        return void 0;
    };

    const add_functionFlow = (s_from, s_to) => {

        if (!s_to) {
            return;
        }

        if (s_to === "?") {
            return;
        }

        if (s_from == void 0) {
            s_from = "START";
        }

        if (!s_include_functionNames.includes(s_to)) {
            if (s_ignore_functionNames.includes(s_to)) {
                return;
            }
        }

        const o_flow = o_function_flows_global.find((a) => a.s_from === s_from && a.s_to === s_to);

        if (o_flow) {
            o_flow.n_count++;
            return;
        }

        o_function_flows_global.push({
            s_from,
            s_to,
            "n_count": 1
        });
    };

    /**
     * ASTを辿る。
     */
    const walk_tree = (o_option) => {
        const { node, c_node } = o_option;

        if (!node) {
            return;
        }

        if (typeof node !== "object") {
            return;
        }

        if (Array.isArray(node)) {
            const o_items = node;
            for (let j = 0; j < o_items.length; j++) {
                const o_item = o_items[j];

                walk_tree({
                    ...o_option,
                    "node": o_item,
                    "parent_node": node
                });
            }
        } else if (Object.hasOwnProperty.call(node, "type")) {
            const b_return = c_node(o_option);
            if (b_return) {
                return;
            }

            const s_PropertyNames = Object.getOwnPropertyNames(node);
            for (let index = 0; index < s_PropertyNames.length; index++) {
                const s_PropertyName = s_PropertyNames[index];

                if (["start", "end", "type", "comments", "errors", "loc"].includes(s_PropertyName)) {
                    continue;
                }

                const PropertyValue = node[s_PropertyName];

                walk_tree({
                    ...o_option,
                    "node": PropertyValue,
                    "parent_node": node
                });
            }
        }
    };

    const analyze_CallExpression = (o_option) => {
        const { node, s_from } = o_option;

        const add_functionFlow_setTimeout = (s_from2, callee, argument) => {
            if (callee.type === "Identifier") {
                if (callee.name === "setTimeout") {
                    const s_to = get_functionName(argument);
                    add_functionFlow(s_from2, s_to);
                }
            }
        };

        const add_functionFlow_addEventListener = (s_from2, callee, argument_items) => {
            if (callee.type === "MemberExpression") {
                if (callee.property.type === "Identifier") {
                    if (callee.property.name === "addEventListener") {
                        const s_to = get_functionName(argument_items[1]);
                        add_functionFlow(s_from2, s_to);
                    }
                }
            }
        };

        const add_functionFlow_arguments = (s_from2, argument_items) => {
            for (let index = 0; index < argument_items.length; index++) {
                const argument_item = argument_items[index];

                if (argument_item.type === "Identifier") {
                    if (s_include_functionNames.includes(argument_item.name)) {
                        const s_to = argument_item.name;
                        add_functionFlow(s_from2, s_to);
                    }
                }
            }
        };

        const { callee } = node;
        const argument_items = node.arguments;

        /**
         * CallExpression > Super は analyze_Super で担当する。
         */
        if (callee.type === "Super") {
            return;
        }

        const s_callee_name = get_functionName(callee);

        add_functionFlow(s_from, s_callee_name);

        add_functionFlow_setTimeout(s_from, callee, argument_items[0]);
        add_functionFlow_addEventListener(s_from, callee, argument_items);
        add_functionFlow_arguments(s_from, argument_items);
    };

    const analyze_NewExpression = (o_option) => {
        const { node, s_from } = o_option;

        const add_functionFlow_MutationObserver = (s_from2, s_new_to, argument_items) => {
            if (s_new_to === "MutationObserver.constructor") {
                const s_to = get_functionName(argument_items[0]);
                add_functionFlow(s_from2, s_to);
            }
        };

        const { callee } = node;
        const argument_items = node.arguments;

        let s_to = get_functionName(callee, { "b_new": true });

        if (s_to === void 0) {
            return;
        }

        s_to = `${s_to}.constructor`;

        add_functionFlow(s_from, s_to);

        add_functionFlow_MutationObserver(s_from, s_to, argument_items);
    };

    const analyze_FunctionExpression = (o_option) => {
        const { node, parent_node } = o_option;
        let s_from;

        switch (parent_node.type) {
            case "VariableDeclarator": {
                const { id } = parent_node;
                s_from = id.name;
                break;
            }

            case "AssignmentExpression": {
                const { left } = parent_node;
                s_from = get_functionName(left, { "b_ignoreCheck": true });
                break;
            }

            case "ObjectProperty": {
                const { key } = parent_node;

                const s_temp = get_functionName(key, { "b_ignoreCheck": true });
                if (s_temp !== void 0) {
                    s_from = concat_s_from_property(o_option.s_from_obj, s_temp);
                }

                break;
            }

            default: {
                /**
                 * function hoge() {}における名前hogeを取得する。
                 */
                s_from = get_functionName(node, { "b_ignoreCheck": true });

                /**
                 * 同じ関数ノードになることを避けたいので無名関数をスキップする。
                 */
                if (["()=>{}", "function(){}"].includes(s_from)) {
                    s_from = void 0;
                } else if (node.type !== "FunctionExpression") {
                    throw new Error("unexpected at analyze_FunctionExpression().");
                }

                break;
            }
        }

        s_from = s_from ?? o_option.s_from;

        const { body, params } = node;

        walk_tree({
            ...o_option,
            "node": params,
            s_from,
            "parent_node": node
        });
        walk_tree({
            ...o_option,
            "node": body,
            s_from,
            "parent_node": node
        });

        return true;
    };

    const analyze_FunctionDeclaration = (o_option) => {
        const { node } = o_option;
        const { id, body, params } = node;

        if (id.type !== "Identifier") {
            throw new Error('id.type !== "Identifier" at analyze_FunctionDeclaration');
        }

        const s_from = id.name ?? o_option.s_from;

        walk_tree({
            ...o_option,
            "node": params,
            s_from,
            "parent_node": node
        });
        walk_tree({
            ...o_option,
            "node": body,
            s_from,
            "parent_node": node
        });

        return true;
    };

    const sub_analyze_class = (o_option, s_from) => {
        const { node } = o_option;
        const { body, superClass } = node;

        let s_super;
        const s_temp = get_functionName(superClass, { "b_ignoreCheck": true });

        if (s_temp === void 0) {
            ({ s_super } = o_option);
        } else {
            s_super = `${s_temp}.constructor`;
        }

        walk_tree({
            ...o_option,
            "node": superClass,
            s_from,
            s_super,
            "parent_node": node
        });
        walk_tree({
            ...o_option,
            "node": body,
            s_from,
            s_super,
            "parent_node": node
        });
    };

    const analyze_ClassDeclaration = (o_option) => {
        const { node } = o_option;
        const { id } = node;

        const s_from = id.name ?? o_option.s_from;

        sub_analyze_class(o_option, s_from);

        return true;
    };

    const analyze_ClassExpression = (o_option) => {
        const { parent_node } = o_option;
        let s_from;

        switch (parent_node.type) {
            case "VariableDeclarator": {
                const { id } = parent_node;
                s_from = id.name;
                break;
            }

            case "AssignmentExpression": {
                const { left } = parent_node;
                s_from = get_functionName(left, { "b_ignoreCheck": true });
                break;
            }

            case "ObjectProperty": {
                const { key } = parent_node;

                const s_temp = get_functionName(key, { "b_ignoreCheck": true });
                if (s_temp !== void 0) {
                    s_from = concat_s_from_property(o_option.s_from_obj, s_temp);
                }

                break;
            }

            default: {
                const { node } = o_option;
                const { id } = node;

                const s_temp = get_functionName(id, { "b_ignoreCheck": true });
                if (s_temp !== void 0) {
                    s_from = concat_s_from_property(o_option.s_from, s_temp);
                }

                break;
            }
        }

        s_from = s_from ?? o_option.s_from;

        sub_analyze_class(o_option, s_from);

        return true;
    };

    const analyze_ClassMethod = (o_option) => {
        const { node } = o_option;
        const s_from_arg = o_option.s_from;

        const { key, params, body } = node;

        const s_from = concat_s_from_property(node.type === "ObjectMethod" ? o_option.s_from_obj : s_from_arg,
            get_functionName(key, { "b_ignoreCheck": true }));

        walk_tree({
            ...o_option,
            "node": key,
            "s_from": s_from_arg,
            "parent_node": node
        });
        walk_tree({
            ...o_option,
            "node": params,
            s_from,
            "parent_node": node
        });
        walk_tree({
            ...o_option,
            "node": body,
            s_from,
            "parent_node": node
        });

        return true;
    };

    const analyze_ObjectExpression = (o_option) => {
        const { parent_node, node } = o_option;
        let s_from_obj;

        switch (parent_node.type) {
            case "VariableDeclarator": {
                const { id } = parent_node;
                s_from_obj = id.name;
                break;
            }

            case "AssignmentExpression": {
                const { left } = parent_node;
                s_from_obj = get_functionName(left, { "b_ignoreCheck": true });
                break;
            }

            case "ObjectProperty": {
                const { key } = parent_node;

                const s_temp = get_functionName(key, { "b_ignoreCheck": true });
                if (s_temp !== void 0) {
                    s_from_obj = concat_s_from_property(o_option.s_from_obj, s_temp);
                }

                break;
            }

            default:
                break;
        }

        const { properties } = node;

        walk_tree({
            ...o_option,
            "node": properties,
            s_from_obj,
            "parent_node": node
        });

        return true;
    };

    const analyze_StaticBlock = (o_option) => {
        const { node } = o_option;
        const { body } = node;

        const s_from = concat_s_from_property(o_option.s_from, "static");

        walk_tree({
            ...o_option,
            "node": body,
            s_from,
            "parent_node": node
        });

        return true;
    };

    const analyze_Super = (o_option) => {
        const { s_from, s_super } = o_option;

        if (s_super === void 0) {
            throw new Error("the value of s_super is unexpected at analyze_Super().");
        }

        add_functionFlow(s_from, s_super);
    };

    const get_functionFlows = (s_code, o_options) => {
        let s_error;

        if (o_options.s_ignore_objectNames === null) {
            s_ignore_objectNames = s_ignore_objectNames_global;
        } else {
            s_ignore_objectNames = o_options.s_ignore_objectNames.split(/\n/u);
        }

        if (o_options.s_ignore_functionNames === null) {
            s_include_functionNames = s_include_functionNames_global;
        } else {
            s_include_functionNames = o_options.s_include_functionNames.split(/\n/u);
        }

        if (o_options.s_ignore_functionNames === null) {
            s_ignore_functionNames = s_ignore_functionNames_global;
        } else {
            s_ignore_functionNames = o_options.s_ignore_functionNames.split(/\n/u);
        }

        o_function_flows_global.length = 0;

        let ast;
        try {
            /**
             * @babel/parser
             */
            ast = exports.parse(s_code, {
                "plugins": ["typescript", "jsx"],
                "attachComment": false,
                "sourceType": "module"
            });
        } catch (error) {
            s_error = error.message;

            console.log(error);

            return {
                s_error
            };
        }

        window.s_code = s_code;
        window.s = (node) => window.s_code.substring(node.start, node.end);
        window.r = JSON.stringify(ast, (key, value) => {
            if (!["comments", "start", "end", "errors", "loc", "directives", "extra"].includes(key)) {
                return value;
            }
        }, 2);

        /**
         * walk_tree 関数の type ノードで実行するコールバック関数。
         * この関数が true を返した場合、子ノードに対して walk_tree を継続しない。
         */
        const c_node = (o_option) => {
            const { node } = o_option;

            if (Array.isArray(node)) {
                throw new Error("array is unexpected at c_node().");
            }

            switch (node.type) {
                case "CallExpression":
                    analyze_CallExpression(o_option);
                    break;

                case "NewExpression":
                    return analyze_NewExpression(o_option);

                case "ArrowFunctionExpression":
                case "FunctionExpression":
                    return analyze_FunctionExpression(o_option);

                case "FunctionDeclaration":
                    return analyze_FunctionDeclaration(o_option);

                case "ClassDeclaration":
                    return analyze_ClassDeclaration(o_option);

                case "ClassExpression":
                    return analyze_ClassExpression(o_option);

                case "ClassMethod":
                case "ClassPrivateMethod":
                case "MethodDefinition":
                case "ObjectMethod":
                    return analyze_ClassMethod(o_option);

                case "ObjectExpression":
                    return analyze_ObjectExpression(o_option);

                case "StaticBlock":
                    return analyze_StaticBlock(o_option);

                case "Super":
                    return analyze_Super(o_option);

                default:
                    break;
            }
        };

        walk_tree({
            "node": ast,
            "s_from": void 0,
            "s_from_obj": void 0,
            "s_super": void 0,
            c_node,
            "parent_node": void 0
        });

        console.log("List of function flows:");
        console.dir(o_function_flows_global, { "maxArrayLength": null });

        return {
            "o_function_flows": o_function_flows_global
        };
    };

    return {
        get_functionFlows,
        "s_ignore_objectNames": s_ignore_objectNames_global,
        "s_include_functionNames": s_include_functionNames_global,
        "s_ignore_functionNames": s_ignore_functionNames_global
    };
})();
