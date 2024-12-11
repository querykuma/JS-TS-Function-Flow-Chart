export const test = `new A1;
a = new A2();
new o1.o2[1].A3;
a = new (1 ? A4 : A5);`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "A1.constructor",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "A2.constructor",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "o1.o2[?].A3.constructor",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "?.constructor",
        "n_count": 1
    }
]`;
