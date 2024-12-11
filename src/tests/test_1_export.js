export const test = `o1 = {
    "a1": function f1() {
        test();
    }
};
var o2 = {
    "a2": function f1() {
        test();
    }
};


o3 = {
    a1() {
        test2();
    }
};
var o4 = {
    a2() {
        test2();
    }
};


o5 = {
    "a1": () => {
        test3();
    }
};
var o6 = {
    "a2": () => {
        test3();
    }
};


o7 = {
    "a1": class A {
        constructor() {
            test4();
        }
    }
};
var o8 = {
    "a2": class A {
        constructor() {
            test4();
        }
    }
};
a = new o7.a1();
a = new o8.a2();

//
o9 = {
    "a1": {
        "b1": {
            m1() { test5(); }
        }
    }
};
var o10 = {
    "a2": {
        "b1": {
            m1() { test5(); }
        }
    }
};`;

export const expected = `[
    {
        "s_from": "o1.a1",
        "s_to": "test",
        "n_count": 1
    },
    {
        "s_from": "o2.a2",
        "s_to": "test",
        "n_count": 1
    },
    {
        "s_from": "o3.a1",
        "s_to": "test2",
        "n_count": 1
    },
    {
        "s_from": "o4.a2",
        "s_to": "test2",
        "n_count": 1
    },
    {
        "s_from": "o5.a1",
        "s_to": "test3",
        "n_count": 1
    },
    {
        "s_from": "o6.a2",
        "s_to": "test3",
        "n_count": 1
    },
    {
        "s_from": "o7.a1.constructor",
        "s_to": "test4",
        "n_count": 1
    },
    {
        "s_from": "o8.a2.constructor",
        "s_to": "test4",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "o7.a1.constructor",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "o8.a2.constructor",
        "n_count": 1
    },
    {
        "s_from": "o9.a1.b1.m1",
        "s_to": "test5",
        "n_count": 1
    },
    {
        "s_from": "o10.a2.b1.m1",
        "s_to": "test5",
        "n_count": 1
    }
]`;
