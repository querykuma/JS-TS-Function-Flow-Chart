export const test = `class A1 extends B1 {
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
};`;

export const expected = `[
  {
      "s_from": "A1.constructor",
      "s_to": "arg1",
      "n_count": 1
  },
  {
      "s_from": "A1.constructor",
      "s_to": "test1",
      "n_count": 1
  },
  {
      "s_from": "A1.constructor",
      "s_to": "B1.constructor",
      "n_count": 1
  },
  {
      "s_from": "A1.m1",
      "s_to": "test2",
      "n_count": 1
  },
  {
      "s_from": "A1",
      "s_to": "f1",
      "n_count": 1
  },
  {
      "s_from": "A1.?",
      "s_to": "test3",
      "n_count": 1
  },
  {
      "s_from": "A1",
      "s_to": "f2",
      "n_count": 1
  },
  {
      "s_from": "A1",
      "s_to": "f3",
      "n_count": 1
  },
  {
      "s_from": "START",
      "s_to": "A1.constructor",
      "n_count": 1
  },
  {
      "s_from": "A2.constructor",
      "s_to": "test4",
      "n_count": 1
  },
  {
      "s_from": "A3.constructor",
      "s_to": "test5",
      "n_count": 1
  },
  {
      "s_from": "p1.X.static",
      "s_to": "test6",
      "n_count": 1
  },
  {
      "s_from": "A4.O.p1",
      "s_to": "h1",
      "n_count": 1
  },
  {
      "s_from": "A4",
      "s_to": "O.p1",
      "n_count": 1
  },
  {
      "s_from": "A4.O.p1()",
      "s_to": "hh1",
      "n_count": 1
  },
  {
      "s_from": "a2.b.c.d.e",
      "s_to": "test7",
      "n_count": 1
  },
  {
      "s_from": "a3.b1.m",
      "s_to": "test8",
      "n_count": 1
  },
  {
      "s_from": "a3.b2.A.m",
      "s_to": "test8",
      "n_count": 1
  },
  {
      "s_from": "a3.b3.m",
      "s_to": "test8",
      "n_count": 1
  },
  {
      "s_from": "a3.b4.m",
      "s_to": "test8",
      "n_count": 1
  }
]`;
