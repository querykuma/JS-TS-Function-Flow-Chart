export const test = `class A2 extends A3 {
    constructor(n2) {
        super(n2);
    }
}

class A1 extends A2 {
    constructor(n1) {
        super(n1);
    }
}

B4 = [];
B4[3] = class { };

const B2 = {
    "B3": class extends B4[3] {
        constructor(n2) {
            super(n2);
        }
    }
};

class B1 extends B2.B3 {
    constructor(n1) {
        super(n1);
    }
}

const b = new B1(2);`;
export const expected = `[
    {
        "s_from": "A2.constructor",
        "s_to": "A3.constructor",
        "n_count": 1
    },
    {
        "s_from": "A1.constructor",
        "s_to": "A2.constructor",
        "n_count": 1
    },
    {
        "s_from": "B2.B3.constructor",
        "s_to": "B4[?].constructor",
        "n_count": 1
    },
    {
        "s_from": "B1.constructor",
        "s_to": "B2.B3.constructor",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "B1.constructor",
        "n_count": 1
    }
]`;
