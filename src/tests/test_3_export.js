export const test = `function f1(p1 = test1()) {
    test2();
}

const o1 = {
    "p1": function f2() {
        test3();
    },
    p2() {
        test4();
    },
    "o2": {
        "p3": function f3() {
            test5();
        }
    }
};

o2 = function f4() {
    test6();
};
const o3 = function f5() {
    test7();
};
`;
export const expected = `[
    {
        "s_from": "f1",
        "s_to": "test1",
        "n_count": 1
    },
    {
        "s_from": "f1",
        "s_to": "test2",
        "n_count": 1
    },
    {
        "s_from": "o1.p1",
        "s_to": "test3",
        "n_count": 1
    },
    {
        "s_from": "o1.p2",
        "s_to": "test4",
        "n_count": 1
    },
    {
        "s_from": "o1.o2.p3",
        "s_to": "test5",
        "n_count": 1
    },
    {
        "s_from": "o2",
        "s_to": "test6",
        "n_count": 1
    },
    {
        "s_from": "o3",
        "s_to": "test7",
        "n_count": 1
    }
]`;
