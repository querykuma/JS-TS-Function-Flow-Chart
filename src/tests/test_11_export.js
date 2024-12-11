export const test = `a1[12.3]();
a2[456]();
a3[-789]();
a4[0]();
a5["hoge"]();
a6[true]();
a7[null]();
a8[/^.*$/u]();
a9[1n]();`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "a1[12.3]",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a2[?]",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a3[?]",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a4[?]",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a5.hoge",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a6.true",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a7.null",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a8[/^.*$/u]",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a9.1n",
        "n_count": 1
    }
]`;
