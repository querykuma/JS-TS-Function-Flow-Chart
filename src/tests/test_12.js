/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * その他のテスト
 */
(() => {
    const a = f1({
        m1() {
            test1();
        }
    });
    const b = {
        m2() {
            test1();
        }
    };
})();

(1, 2)();
function f1() {
    (2, 3)();
}
