function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}

Person.prototype = {
    sleeping: function () {
        console.log('I am sleeping');
    }
}

var CreateObjectInstance = function () {
    let obj = {};
    let args = Array.prototype.slice.call(arguments);
    let Constructor = args.shift();
    obj.__proto__ = Constructor.prototype;
    let result = Constructor.apply(obj, args);
    // 判断 构造函数有无返回值，如果返回值为{}，则只能访问return的{}的属性
    // 如果有返回值，且返回值类型不为{}时，仍然返回实例对象
    return typeof result === 'object' ? result : obj;
}

var person = CreateObjectInstance(Person, 'liuchengying', 25, '男');
console.log(person.name);// liuchengying
console.log(person.sex);// 男

// 检测是否为Person对象的实例
console.log(person instanceof Person); // true