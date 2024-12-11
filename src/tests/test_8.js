/* eslint-disable no-undef */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/* eslint-disable max-classes-per-file */
// super

class A2 extends A3 {
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
            console.log(n2);
        }
    }
};

class B1 extends B2.B3 {
    constructor(n1) {
        super(n1);
    }
}

const b = new B1(2);
