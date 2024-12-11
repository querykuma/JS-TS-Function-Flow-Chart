/* eslint-disable func-name-matching */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// function
function f1(p1 = test1()) {
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
