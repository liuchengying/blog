// 模拟apply方法，改变this的指向
// Function类型的属性

Function.prototype.myApply = function () {
    let context = arguments[0] || window;
    let arg = arguments[1];
    if (!(arg instanceof Array)) return
    context.fn = this;
    let arrArg = [];
    for (let i = 1; i < arg.length; i++) {
        arrArg[i - 1] = arguments[i];
    }
    let result = eval('context.fn(' + arrArg.toString() + ')');
    delete context.fn;
    return result;
}