export const test = `a1 = (() => {
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
};`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "()=>{}",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "test1",
        "n_count": 1
    },
    {
        "s_from": "b1",
        "s_to": "test2",
        "n_count": 1
    },
    {
        "s_from": "a2",
        "s_to": "test3",
        "n_count": 1
    },
    {
        "s_from": "b2",
        "s_to": "test4",
        "n_count": 1
    },
    {
        "s_from": "a2",
        "s_to": "b2",
        "n_count": 1
    },
    {
        "s_from": "o1",
        "s_to": "test5",
        "n_count": 1
    },
    {
        "s_from": "o2",
        "s_to": "test6",
        "n_count": 1
    },
    {
        "s_from": "o3.o4.o5",
        "s_to": "test7",
        "n_count": 1
    },
    {
        "s_from": "o3.o6",
        "s_to": "test8",
        "n_count": 1
    }
]`;
