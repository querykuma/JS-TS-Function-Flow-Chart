export const test = `a1 = (() => {
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
`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "()=>{}",
        "n_count": 2
    },
    {
        "s_from": "START",
        "s_to": "test1",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "test1b",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f1",
        "n_count": 1
    },
    {
        "s_from": "f1",
        "s_to": "test2",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f2",
        "n_count": 1
    },
    {
        "s_from": "f2",
        "s_to": "test2b",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "function(){}",
        "n_count": 2
    },
    {
        "s_from": "START",
        "s_to": "test3",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "test3b",
        "n_count": 1
    }
]`;
