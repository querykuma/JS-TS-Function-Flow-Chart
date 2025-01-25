/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable max-classes-per-file */
/* eslint-disable func-name-matching */
/* eslint-disable no-use-before-define */
// ObjectProperty
o1 = {
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
};

t = {
    "t2": "t3"
};
o11 = {
    [(1, t.t2)]() {
        test6();
    }
};
var o12 = {
    [(1, t.t2)]() {
        test6();
    }
};
