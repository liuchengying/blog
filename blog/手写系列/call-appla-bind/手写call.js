// 模拟call方法，改变this的指向
// Function类型的属性

Function.prototype.myCall = function () {
    let context = arguments[0] || window;
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    let result = eval('context.fn(' + args +')');
    delete context.fn;
    return result;
}
