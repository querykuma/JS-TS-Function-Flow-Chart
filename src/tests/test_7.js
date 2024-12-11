/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// anonymous function

a1 = (() => {
    test1();
})();

(() => {
    test1b();
})();

a2 = (function f1(params) {
    test2();
}());

(function f2(params) {
    test2b();
}());

a3 = (function (params) {
    test3();
}());

(function (params) {
    test3b();
}());
