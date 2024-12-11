/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * setTimeout,addEventListener,add_functionFlow_arguments,MutationObserver
 * include_functionNames: addEventListener
 */

const f1 = async () => {
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
}
