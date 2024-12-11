export const test = `(() => {
    const a = f1({
        m1() {
            test1();
        }
    });
    const b = {
        m2() {
            test1();
        }
    };
})();

(1, 2)();
function f1() {
    (2, 3)();
}`;
export const expected = `[
    {
        "s_from": "START",
        "s_to": "()=>{}",
        "n_count": 1
    },
    {
        "s_from": "START",
        "s_to": "f1",
        "n_count": 1
    },
    {
        "s_from": "m1",
        "s_to": "test1",
        "n_count": 1
    },
    {
        "s_from": "b.m2",
        "s_to": "test1",
        "n_count": 1
    }
]`;
