(() => {
    let s_code_global;
    let s_filename_global;
    let l_previous_click_diagram_global;
    let initialize_Maps_global;

    /**
     * 初期状態でURLからsearchとhashを除く。
     */
    const s_initial_url_global = location.href.match(/\/([^/#?]*)(?:[#?][^/]*)?$/u)[1];

    const s_START_color_global = "#ffcaea";

    const e_input_screen_global = document.getElementById("input_screen");
    const e_output_screen_global = document.getElementById("output_screen");
    const e_functions_table_global = document.getElementById("functions_table");
    const e_diagram_global = document.getElementById("diagram");
    const e_mermaid_code_global = document.getElementById("mermaid_code");

    history.replaceState({ "number": 0 }, "", s_initial_url_global);

    const escape_code = (s_mermaid_code) => s_mermaid_code.replaceAll(/\\/gu, "\\\\").replaceAll(/[_@*]/gu, "\\$&");

    const get_mermaid_code = (o_function_flows) => {
        let n_alphabet_global = 0;

        /**
         * n_alphabet_global に対応する Mermaidノード名を作る。
         * n_alphabet_global は1ずつ増えていく連番。
         */
        const get_new_alphabet = () => {

            const get_adjusted_number = (v) => {
                let i = 1;
                const n_radix = 26;

                // eslint-disable-next-line no-constant-condition
                while (1) {
                    if (v < n_radix ** i) {
                        return [v, i];
                    }
                    v -= n_radix ** i;
                    i++;
                }
            };

            /**
             * A→Z,AA→ZZ,AAA→ZZZとするために調整する。
             */
            const [v, digit] = get_adjusted_number(n_alphabet_global);

            const s_alphabet = [...v.toString(26).padStart(digit, "0")].map((a) => parseInt(a, 26)).map((a) => String.fromCodePoint(a + 65)).
                join("");

            n_alphabet_global++;
            return s_alphabet;
        };

        /**
         * 関数名からノード名への Map 変数。
         */
        const M_texts = new Map();

        const s_codes = [];
        let s_node_START;

        for (let index = 0; index < o_function_flows.length; index++) {
            const o_function_flow = o_function_flows[index];
            const { s_from } = o_function_flow;
            const { s_to } = o_function_flow;

            let s_from_alphabet = M_texts.get(s_from);
            let s_to_alphabet = M_texts.get(s_to);

            const s_has_from_alphabet = s_from_alphabet;
            const s_has_to_alphabet = s_to_alphabet;

            if (!s_from_alphabet) {
                s_from_alphabet = get_new_alphabet();
                M_texts.set(s_from, s_from_alphabet);
            }

            if (!s_to_alphabet) {
                s_to_alphabet = get_new_alphabet();
                M_texts.set(s_to, s_to_alphabet);
            }

            if (s_from === "START") {
                s_node_START = s_from_alphabet;
            }

            s_codes.push(`${s_from_alphabet}${s_has_from_alphabet ? "" : `["${s_from}"]`} --> |${o_function_flow.n_count}|${s_to_alphabet}${s_has_to_alphabet ? "" : `["${s_to}"]`}`);
        }

        const s_code = `flowchart LR\n${s_codes.map((a) => `    ${a}`).join("\n")}${s_node_START ? `\n    style ${s_node_START} fill:${s_START_color_global}` : ""}`;
        return s_code;
    };

    const update_functions_table = (o_function_flows) => {

        /**
         * Object.create(null) としたのは o_functions={} なら if 条件の判定 o_functions[o_function_flow.s_to] でエラーになる場合があるため。
         * o_function_flow.s_to がプロトタイプ名と被ったときプロパティ名が最初から存在すると判定されてしまう。
         * if 条件判定のほうも Object.hasOwnProperty.call に変更した。
         */
        const o_functions = Object.create(null);

        for (let index = 0; index < o_function_flows.length; index++) {
            const o_function_flow = o_function_flows[index];

            if (Object.hasOwnProperty.call(o_functions, o_function_flow.s_to)) {
                o_functions[o_function_flow.s_to].s_from_functions.push(o_function_flow.s_from);
                o_functions[o_function_flow.s_to].n_count += o_function_flow.n_count;
            } else {
                o_functions[o_function_flow.s_to] = {
                    "s_from_functions": [o_function_flow.s_from],
                    "n_count": o_function_flow.n_count
                };
            }
        }

        e_functions_table_global.querySelector("tbody")?.remove();

        const e_tbody = e_functions_table_global.createTBody();

        const a_entries = Object.entries(o_functions).sort((a, b) => a[1].n_count - b[1].n_count);

        for (let index = 0; index < a_entries.length; index++) {
            const a_entry = a_entries[index];

            const e_row = e_tbody.insertRow(-1);

            e_row.insertCell(0).textContent = a_entry[0];
            e_row.insertCell(1).textContent = a_entry[1].n_count;
            e_row.insertCell(2).textContent = a_entry[1].s_from_functions.join("\n");

            e_row.cells[1].style.textAlign = "center";
        }
    };

    const color_diagram_onClicks = (o_function_flows_global) => {
        /**
         * span.nodeLabel>p から rect.label-container へのMap変数。
         */
        const M_nodeLabels_global = new Map();

        /**
         * rect.label-container から span.nodeLabel>p へのMap変数。
         */
        const M_labelContainers_global = new Map();

        /**
         * span.nodeLabel>p.textContent から span.nodeLabel>p へのMap変数。
         */
        const M_nodeLabelsText_global = new Map();

        /**
         * アルファベットから .edgePaths>path へのMap変数。
         */
        const M_alphabetEdge_global = new Map();

        /**
         * 前回のクリックイベントで色付けされた .label-container 要素の配列。
         */
        const e_colored_labelContainers_global = [];

        /**
         * 前回のクリックイベントで色を付けたときの e_label_container の値。
         */
        let e_previous_labelContainers_global;

        const initialize_PopupTexts = (e_nodeLabels) => {
            const sub_initialize_PopupTexts = (e_nodeLabel_base) => {
                const s_nodeLabel_base = e_nodeLabel_base.textContent;
                const s_from_texts = [];
                const s_to_texts = [];

                for (let index = 0; index < o_function_flows_global.length; index++) {
                    const o_function_flow = o_function_flows_global[index];

                    if (o_function_flow.s_from === s_nodeLabel_base) {
                        const e_nodeLabel = M_nodeLabelsText_global.get(o_function_flow.s_to);
                        const s_nodeLabel = e_nodeLabel.textContent;

                        s_to_texts.push(` ${s_nodeLabel} (${o_function_flow.n_count})`);
                    }

                    if (o_function_flow.s_to === s_nodeLabel_base) {
                        const e_nodeLabel = M_nodeLabelsText_global.get(o_function_flow.s_from);
                        const s_nodeLabel = e_nodeLabel.textContent;

                        s_from_texts.push(` ${s_nodeLabel} (${o_function_flow.n_count})`);
                    }
                }

                const s_text = ["IN:", ...s_from_texts, "", "TO:", ...s_to_texts].join("\n");

                e_nodeLabel_base.title = s_text;
            };

            for (let index = 0; index < e_nodeLabels.length; index++) {
                const e_nodeLabel = e_nodeLabels[index];

                sub_initialize_PopupTexts(e_nodeLabel);
            }
        };

        const initialize_Maps = () => {
            /**
             * initialize_PopupTextsに渡すためだけの配列変数。
             */
            const e_nodeLabels = [];

            const e_label_containers = e_diagram_global.querySelectorAll(".label-container");

            for (let index = 0; index < e_label_containers.length; index++) {
                const e_label_container = e_label_containers[index];
                const e_nodeLabel = e_label_container.nextElementSibling.querySelector(".nodeLabel").firstElementChild;

                e_nodeLabels.push(e_nodeLabel);

                M_nodeLabels_global.set(e_nodeLabel, e_label_container);
                M_labelContainers_global.set(e_label_container, e_nodeLabel);

                M_nodeLabelsText_global.set(e_nodeLabel.textContent, e_nodeLabel);
            }

            const e_edgePaths = e_diagram_global.querySelectorAll(".edgePaths>path");

            for (let index = 0; index < e_edgePaths.length; index++) {
                const e_edgePath = e_edgePaths[index];

                const m = e_edgePath.id.match(/^L_([^_]+_[^_]+)_\d+$/u);

                if (m) {
                    M_alphabetEdge_global.set(`${m[1]}`, e_edgePath);
                } else if (!e_edgePath.id.match(/-cyclic-special-/u)) {
                    console.log("%c 予期されない e_edgePath.id です", "color:hotpink;", e_edgePath.id);
                }
            }

            initialize_PopupTexts(e_nodeLabels);
        };

        initialize_Maps_global = initialize_Maps;

        const l_click_diagram = (e) => {

            const clear_colors = () => {
                for (let index = 0; index < e_colored_labelContainers_global.length; index++) {
                    const e_colored_labelContainer = e_colored_labelContainers_global[index];
                    e_colored_labelContainer.style.cssText = "";
                }

                e_colored_labelContainers_global.length = 0;

                /**
                 * ノードSTARTに色を付ける。
                 */
                const e_nodeLabel = M_nodeLabelsText_global.get("START");
                if (e_nodeLabel) {
                    const e_label_container = M_nodeLabels_global.get(e_nodeLabel);

                    /**
                     * index.cssで!importantを付けているので!important必要。
                     */
                    e_label_container.style.cssText = `fill:${s_START_color_global}!important;`;
                }
            };

            const get_alphabet_at = (e_label_container) => e_label_container.closest(".node").id.replace(/^flowchart-([^-]+)-.*$/u, "$1");

            const color_function_flows = (s_nodeLabel, s_alphabet_base) => {
                for (let index = 0; index < o_function_flows_global.length; index++) {
                    const o_function_flow = o_function_flows_global[index];

                    if (o_function_flow.s_from === s_nodeLabel) {
                        /* ノードの枠線 */
                        const e_nodeLabel = M_nodeLabelsText_global.get(o_function_flow.s_to);
                        const e_label_container = M_nodeLabels_global.get(e_nodeLabel);

                        e_label_container.style.cssText = "stroke:blue!important; stroke-width:2px;";

                        e_colored_labelContainers_global.push(e_label_container);

                        /* 辺 */
                        const s_alphabet_counterpart = get_alphabet_at(e_label_container);

                        if (s_alphabet_counterpart !== s_alphabet_base) {
                            /**
                             * 同じノード間の場合は特殊（-cyclic-special-）で扱いが難しい。
                             */

                            const e_edge = M_alphabetEdge_global.get(`${s_alphabet_base}_${s_alphabet_counterpart}`);

                            e_edge.style.cssText = "stroke:blue!important; stroke-width:2px;";

                            e_colored_labelContainers_global.push(e_edge);
                        }
                    }

                    if (o_function_flow.s_to === s_nodeLabel) {
                        /* ノードの枠線 */
                        const e_nodeLabel = M_nodeLabelsText_global.get(o_function_flow.s_from);
                        const e_label_container = M_nodeLabels_global.get(e_nodeLabel);

                        e_label_container.style.cssText = "stroke:red!important; stroke-width:2px;";

                        e_colored_labelContainers_global.push(e_label_container);

                        /* 辺 */
                        const s_alphabet_counterpart = get_alphabet_at(e_label_container);

                        if (s_alphabet_counterpart !== s_alphabet_base) {
                            /**
                             * 同じノード間の場合は特殊（-cyclic-special-）で扱いが難しい。
                             */

                            const e_edge = M_alphabetEdge_global.get(`${s_alphabet_counterpart}_${s_alphabet_base}`);

                            e_edge.style.cssText = "stroke:red!important; stroke-width:2px;";

                            e_colored_labelContainers_global.push(e_edge);
                        }
                    }
                }
            };

            let e_label_container;
            let e_nodeLabel;

            /**
             * クリック座標は背景の長方形か前景の文字かの2通りある。
             */
            if (e.target.closest(".nodeLabel")) {
                e_nodeLabel = e.target;
                e_label_container = M_nodeLabels_global.get(e_nodeLabel);
            } else if (e.target.matches(".label-container")) {
                e_label_container = e.target;
                e_nodeLabel = M_labelContainers_global.get(e_label_container);
            } else {
                return;
            }

            /**
             * 前回のイベントで色付けした色を元に戻す。
             */
            clear_colors();

            if (e_previous_labelContainers_global === e_label_container) {
                /**
                 * 前回と同じ対象をクリックした場合、初期状態にする。
                 */
                e_previous_labelContainers_global = void 0;
            } else {
                e_label_container.style.cssText = "fill: #fff0a8 !important;";

                e_colored_labelContainers_global.push(e_label_container);

                const s_alphabet_base = get_alphabet_at(e_label_container);

                /**
                 * 関数フローでつながった先 in/out を色付けする。
                 */
                color_function_flows(e_nodeLabel.textContent, s_alphabet_base);

                e_previous_labelContainers_global = e_label_container;
            }
        };

        initialize_Maps();

        if (l_previous_click_diagram_global) {
            e_diagram_global.removeEventListener("click", l_previous_click_diagram_global);
        }
        l_previous_click_diagram_global = l_click_diagram;

        e_diagram_global.addEventListener("click", l_click_diagram);
    };

    const update_output_screen = async (s_code, s_filename) => {
        const e_error_global = document.getElementById("error");

        const error_end = (s_error) => {
            e_error_global.textContent = s_error;

            e_input_screen_global.style.display = "";
            e_output_screen_global.style.display = "none";

            e_input_screen_global.classList.remove("dragenter");
            document.body.style.cursor = "";

            history.replaceState({ "number": 0 }, "", s_initial_url_global);
        };

        if (s_code_global === void 0) {
            return;
        }

        const e_filename = document.getElementById("filename");

        const s_ignore_objectNames = localStorage.getItem("ignore_objectNames");
        const s_include_functionNames = localStorage.getItem("include_functionNames");
        const s_ignore_functionNames = localStorage.getItem("ignore_functionNames");

        e_filename.textContent = s_filename;

        e_input_screen_global.classList.add("dragenter");
        document.body.style.cursor = "wait";

        /**
         * dragenter での CSS 変更を画面反映させる。
         */
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.time("get_functionFlows");

        const { o_function_flows, s_error } = window.functionFlows.get_functionFlows(s_code, {
            s_ignore_objectNames,
            s_include_functionNames,
            s_ignore_functionNames
        });

        if (s_error) {
            return error_end(s_error);
        }

        e_error_global.textContent = "";


        console.timeEnd("get_functionFlows");
        console.time("update_functions_table");

        // eslint-disable-next-line require-atomic-updates
        e_input_screen_global.style.display = "none";
        e_output_screen_global.style.display = "";

        update_functions_table(o_function_flows);

        console.timeEnd("update_functions_table");
        console.time("get_mermaid_code");

        const s_mermaid_code = get_mermaid_code(o_function_flows);
        e_mermaid_code_global.value = s_mermaid_code;

        console.timeEnd("get_mermaid_code");
        console.time("mermaid.initialize");

        window.mermaid.initialize({
            "startOnLoad": false,
            "fontFamily": "Consolas, \"trebuchet ms\", verdana, arial, sans-serif;"
            // "maxTextSize": 200000,
            // "maxEdges": 1200
        });

        console.timeEnd("mermaid.initialize");
        console.time("mermaid.render");

        const s_mermaid_code2 = escape_code(s_mermaid_code);

        let svg;
        try {
            ({ svg } = await window.mermaid.render("svg_diagram", s_mermaid_code2));
        } catch (error) {
            return error_end(error.message);
        }

        e_diagram_global.innerHTML = svg;
        e_diagram_global.style.width = e_diagram_global.firstElementChild.style.maxWidth;

        console.timeEnd("mermaid.render");

        color_diagram_onClicks(o_function_flows);

        e_input_screen_global.classList.remove("dragenter");
        // eslint-disable-next-line require-atomic-updates
        document.body.style.cursor = "";

        if (history.state?.number !== 1) {
            history.pushState({ "number": 1 }, "", `${s_initial_url_global}?diagram`);
        }
    };



    /**
     * イベントリスナー
     */
    const e_select_file = document.getElementById("select_file");
    const e_body = document.body;

    const l_change_file = async () => {
        const { files } = e_select_file;
        const file = files[0];
        const s_filename = file.name;
        s_filename_global = s_filename;

        const s_code = await file.text();

        s_code_global = s_code;

        // eslint-disable-next-line require-atomic-updates
        e_select_file.value = "";

        update_output_screen(s_code, s_filename);
    };

    const l_dragenter_body = (e) => {
        e.preventDefault();

        e_input_screen_global.classList.add("dragenter");
    };

    const l_dragleave_body = (e) => {
        e.preventDefault();

        if (e.relatedTarget === null
            || (e.target.tagName === "BODY"
                && e.relatedTarget.tagName === "HTML")) {
            e_input_screen_global.classList.remove("dragenter");
        }
    };

    const l_drop_handler = async (e) => {
        e.preventDefault();

        const item = [...e.dataTransfer.items].find((a) => a.kind === "file");
        if (!item) {
            return;
        }
        const file = item.getAsFile();
        const s_filename = file.name;
        s_filename_global = s_filename;

        const s_code = await file.text();

        s_code_global = s_code;

        update_output_screen(s_code, s_filename);
    };

    const l_dragover_body = (e) => {
        /**
         * ブラウザの既定動作をオフにしないとファイルが開かれる。
         */
        e.preventDefault();
    };

    const l_popstate = (e) => {
        const n_state = e.state.number;

        switch (n_state) {
            case 0:
                /**
                 * 初期画面
                 */
                e_input_screen_global.style.display = "";
                e_output_screen_global.style.display = "none";
                break;

            case 1:
                /**
                 * 描画画面
                 */
                e_input_screen_global.style.display = "none";
                e_output_screen_global.style.display = "";
                break;

            default:
                console.log("%c 予期されない値です", "color:hotpink;", { n_state });
                break;
        }
    };

    /**
     * e_mermaid_code(textarea) を変更した値で mermaid.render し直す。
     * svg をクリックしたときにエラーが出る場合があるので、 initialize_Maps_global 関数で初期化だけしておく。
     */
    const l_change_mermaidCode = async () => {
        console.time("mermaid.render");

        const s_mermaid_code = e_mermaid_code_global.value;

        const s_mermaid_code2 = escape_code(s_mermaid_code);

        const { svg } = await window.mermaid.render("svg_diagram", s_mermaid_code2);

        e_diagram_global.innerHTML = svg;
        e_diagram_global.style.width = e_diagram_global.firstElementChild.style.maxWidth;

        console.timeEnd("mermaid.render");

        /**
         * 下の方にスクロールしてしまうことの対策。
         */
        document.body.scrollIntoView();

        initialize_Maps_global();
    };

    e_select_file.addEventListener("change", l_change_file);

    e_body.addEventListener("dragenter", l_dragenter_body);
    e_body.addEventListener("dragleave", l_dragleave_body);
    e_body.addEventListener("drop", l_drop_handler);
    e_body.addEventListener("dragover", l_dragover_body);

    window.addEventListener("popstate", l_popstate);
    e_mermaid_code_global.addEventListener("change", l_change_mermaidCode);


    /**
     * 設定画面
     */
    const e_settingDialog = document.getElementById("settingDialog");
    const e_settingDialog__openButton = document.getElementById("settingDialog__openButton");
    const e_settingDialog__closeIcon = document.getElementById("settingDialog__closeIcon");
    const e_settingDialog__okButton = document.getElementById("settingDialog__okButton");
    const e_settingDialog__cancelButton = document.getElementById("settingDialog__cancelButton");

    const e_ignore_objectNames = document.getElementById("ignore_objectNames");
    const e_include_functionNames = document.getElementById("include_functionNames");
    const e_ignore_functionNames = document.getElementById("ignore_functionNames");

    const e_ignore_objectNames__resetButton = document.getElementById("ignore_objectNames__resetButton");
    const e_include_functionNames__resetButton = document.getElementById("include_functionNames__resetButton");
    const e_ignore_functionNames__resetButton = document.getElementById("ignore_functionNames__resetButton");

    const save_setting = () => {
        const split_sort_join = (e_textarea) => e_textarea.value.split(/\n/u).map((a) => a.replace(/^\s+/u, "").replace(/\s+$/u, "")).
            filter((a) => a).
            sort((a, b) => a < b ? -1 : 1).
            join("\n");

        localStorage.setItem("ignore_objectNames", split_sort_join(e_ignore_objectNames));
        localStorage.setItem("include_functionNames", split_sort_join(e_include_functionNames));
        localStorage.setItem("ignore_functionNames", split_sort_join(e_ignore_functionNames));

        /**
         * 下の方にスクロールしてしまうことの対策。
         */
        document.body.scrollIntoView();

        update_output_screen(s_code_global, s_filename_global);
    };

    const load_setting = () => {
        const sort_join = (s_texts) => s_texts.sort((a, b) => a < b ? -1 : 1).join("\n");

        const s_ignore_objectNames = localStorage.getItem("ignore_objectNames");
        const s_include_functionNames = localStorage.getItem("include_functionNames");
        const s_ignore_functionNames = localStorage.getItem("ignore_functionNames");

        e_ignore_objectNames.value = s_ignore_objectNames;
        e_include_functionNames.value = s_include_functionNames;
        e_ignore_functionNames.value = s_ignore_functionNames;

        if (s_ignore_objectNames === null) {
            e_ignore_objectNames.value = sort_join(window.functionFlows.s_ignore_objectNames);
        }

        if (s_include_functionNames === null) {
            e_include_functionNames.value = sort_join(window.functionFlows.s_include_functionNames);
        }

        if (s_ignore_functionNames === null) {
            e_ignore_functionNames.value = sort_join(window.functionFlows.s_ignore_functionNames);
        }
    };

    e_settingDialog__openButton.addEventListener("click", () => {
        load_setting();

        e_settingDialog.showModal();
        e_settingDialog__cancelButton.focus({ "preventScroll": true });
    });

    e_settingDialog__closeIcon.addEventListener("click", () => {
        e_settingDialog.close();
    });

    e_settingDialog__okButton.addEventListener("click", () => {
        save_setting();

        e_settingDialog.close();
    });

    e_settingDialog__cancelButton.addEventListener("click", () => {
        e_settingDialog.close();
    });

    e_ignore_objectNames__resetButton.addEventListener("click", () => {
        e_ignore_objectNames.value = window.functionFlows.s_ignore_objectNames.join("\n");
    });

    e_include_functionNames__resetButton.addEventListener("click", () => {
        e_include_functionNames.value = window.functionFlows.s_include_functionNames.join("\n");
    });

    e_ignore_functionNames__resetButton.addEventListener("click", () => {
        e_ignore_functionNames.value = window.functionFlows.s_ignore_functionNames.join("\n");
    });
})();
