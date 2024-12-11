export const test = `f1();
o1.o2.o3.f2();
(1 ? f3 : f4)();
obj.a[0].f5().f6();`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "f1",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "o1.o2.o3.f2",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "obj.a[?].f5().f6",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "obj.a[?].f5",
        "n_count": 1
    }
]`;
