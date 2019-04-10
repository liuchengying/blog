// 模拟bind方法，返回一个改变了this指向的函数
// Function对象的属性
Function.prototype.myBind = function (context) {
    let self = this;
    let arg = Array.prototype.slice.call(arguments,1);
    let Func = function () { };
    let newBound = function () {
        let args = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? context : self, arg.concat(args));
    }
    Func.prototype = self.prototype;
    newBound.prototype = new Func();
    return newBound;
}

