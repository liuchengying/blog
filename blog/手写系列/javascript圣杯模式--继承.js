// 继承---最优继承----圣杯模式

function Father() { }

Father.prototype.lastName = '张';
Father.prototype.name = '张三';
Father.prototype.lastNaageme = '50';

function Child() { }

/**
 * 普通继承
 */
// Child.prototype = Father.prototype;
// Child.prototype.name = '张四';

// 创建实例
// var father = new Father();
// var firstSon = new Child();
// console.log(firstSon.name) // 张四
// console.log(father.name)  // 张四------父亲的名字也改变了，因为child的原型和father的原型引用了同一个对象，因此修改任何对象的属性变量或方法，所有继承而来的对象和父对象的属性都会发生改变

/**
 * 为了解决以上问题，我们通常选用圣杯模式，来保证在某一对象改变自己的属性时其他对象和父对象不受影响
 * ######## 圣杯模式继承 ########
 */

var inheritObject = (function () {
    var O = function () { };
    return function (sonObject, fatherObject) {
        O.prototype = fatherObject.prototype;
        sonObject.prototype = new O();
        sonObject.prototype.constructor = sonObject;
    }
})()

// 继承
inheritObject(Child, Father);
// 更改儿子的自己的name属性
Child.prototype.name = '张四';
// 继承后创建实例
var newFather = new Father();
var newSon = new Child();

console.log(newFather.name); // 张三 ---- 更改孩子对象的属性时没有影响到父亲的属性
console.log(newSon.name); // 张四 ---- 成功修改了自己的属性

