export const test = `const f1 = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    setTimeout(f2);
};
setTimeout(f3);

document.addEventListener("click", f4);
addEventListener("click", f5);
a.b.c.addEventListener("click", f6);

function f7() {
    f8(temp1, addEventListener, temp2);
    new MutationObserver(f9);
    new MutationObserver((1, f10));
}`;
export const expected = `[
    {
        "s_from": "f1",
        "s_to": "resolve",
        "n_count": 1
    },
    {
        "s_from": "f1",
        "s_to": "f2",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f3",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "document.addEventListener",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f4",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "addEventListener",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "a.b.c.addEventListener",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f6",
        "n_count": 1
    },
    {
        "s_from": "f7",
        "s_to": "f8",
        "n_count": 1
    },
    {
        "s_from": "f7",
        "s_to": "addEventListener",
        "n_count": 1
    },
    {
        "s_from": "f7",
        "s_to": "MutationObserver.constructor",
        "n_count": 2
    },
    {
        "s_from": "f7",
        "s_to": "f9",
        "n_count": 1
    }
]`;
