/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// class

class A1 extends B1 {
    constructor(arg = arg1()) {
        test1();
        super();
    }

    m1() {
        test2();
    }

    static [(1 ? f1() : 2)]() {
        test3();
    }

    [f2()] = 1;

    static [f3()] = 2;
}
a = new A1();

A2 = class B2 {
    constructor() {
        test4();
    }
};

const A3 = class B3 {
    constructor() {
        test5();
    }
};

function f1() {
    return {
        "p1": () => class X {
            static { test6(); }
        }
    };
}

class A4 {
    [O.p1]() {
        h1();
    }

    [O.p1()]() {
        hh1();
    }
}

a2 = {
    [b]: {
        "c": class {
            [d.e]() { test7(); }
        }
    }
};

const a3 = {
    "b1": () => class {
        m() { test8(); }
    },
    "b2": () => class A {
        m() { test8(); }
    },
    "b3": class {
        m() { test8(); }
    },
    "b4": class A {
        m() { test8(); }
    }
};

