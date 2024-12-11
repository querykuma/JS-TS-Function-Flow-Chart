/* eslint-disable no-undef */
// arrow function
a1 = (() => {
    test1();
    b1 = () => {
        test2();
    };
})();

a2 = () => {
    test3();
    b2 = () => {
        test4();
    };
    b2();
};

o1 = () => {
    test5();
};
const o2 = () => {
    test6();
};

o3 = {
    "o4": {
        "o5": () => {
            test7();
        }
    },
    "o6": () => {
        test8();
    }
};
