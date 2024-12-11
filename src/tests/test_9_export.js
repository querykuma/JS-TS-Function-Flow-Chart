export const test = `Object.f1();
o1.Object.f2();
Object.f3().addEventListener();
a1.push();
a2.push.f4();
a3.push().addEventListener();
new Object();
new Object2();`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "Object.f3().addEventListener",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a2.push.f4",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a3.push().addEventListener",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "Object2.constructor",
        "n_count": 1
    }
]`;
