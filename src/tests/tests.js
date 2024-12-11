/**
 * test_X.js は入力ファイル。
 * test_X_export.js は test_X.js の中身と期待値を変数に代入する。期待値と一致するかをテスト。
 * export const test = ``; の `` に test_X.js の中身を代入する。
 * export const expected = ``; の `` に test_X.js から作成される List of function flows オブジェクト（変数名o_function_flows_global）の期待値を代入する。
 */
const start_test = async () => {
    let n_error_count = 0;

    const start_test_file = async (s_file) => {
        console.log(s_file);

        let M_test;
        try {
            M_test = await import(s_file);
        } catch (error) {
            console.log(`%c ${error.message} TEST FAILED`, "color:hotpink;");
            n_error_count++;
            return;
        }

        const { o_function_flows, s_error } = window.functionFlows.get_functionFlows(M_test.test, {
            "s_ignore_objectNames": window.functionFlows.s_ignore_objectNames.join("\n"),
            "s_include_functionNames": window.functionFlows.s_include_functionNames.join("\n"),
            "s_ignore_functionNames": window.functionFlows.s_ignore_functionNames.join("\n")
        });

        if (s_error) {
            console.log(`%c ${s_file} TEST FAILED`, "color:hotpink;");
            n_error_count++;
            return;
        }

        if (JSON.stringify(o_function_flows, null, 2) !== JSON.stringify(JSON.parse(M_test.expected), null, 2)) {
            console.log(`%c ${s_file} TEST FAILED`, "color:hotpink;");
            n_error_count++;
            return;
        }

        console.log(s_file, "passed");
    };

    for (let i = 1; i <= 12; i++) {
        const s_file = `/src/tests/test_${i}_export.js`;
        // eslint-disable-next-line no-await-in-loop
        await start_test_file(s_file);
    }

    if (n_error_count === 0) {
        console.log("%c ALL TESTS PASSED", "color:hotpink;");
    } else {
        throw new Error(`TESTS FAILED: ${n_error_count} times.`);
    }
};

start_test();
