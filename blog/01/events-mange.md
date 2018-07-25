## 基于js的事件管理（订阅-发布） --- events-manage

### 关于文章

> 最近在提升个人技能的同时，决定把自己为数不多的沉淀记录下来，让自己理解的更加深刻，同时也欢迎各位看官指出不足之处。

随着node.js的盛行，引领着Javascript上天下地无所不能啊，本人确确实实的一个前端的忠实粉丝，于是乎......不能自拔...node的异步回调机制有效的提高了非密集型程序的高并发、速度快、性能优的需求同时，也饱受各大厂商的青睐，正是node将javascript又一次推向了热潮，于是小白又要埋头苦读，在各位大神和看官指引的道路下前进。

这篇文章是我的第一篇文章，很早就下定决心要记录和分享一些自己对已掌握的知识的一些理解（其实真心觉得将自己学到东西以文章的形式分享给大家，话风通俗易懂，不仅巩固了自己的知识体系，还会 润物无声），可迟迟没有勇气和信心。

这篇文章主要记录一下自己前几天手写的一个兼容node环境、浏览器环境、还支持Vue的...库。**[event-mange](https://www.github.com/liuchengying/js-Events)**（ npm仓库的名字）。node下的EventEmitter想必大家都很熟悉了，在思考过后决定自己也要产出一个类似的事件管理，不仅能在node下，还可以在浏览器端以 <script> 的方式引入使用，还有CMD、AMD下...于是，本小白开始动工了。

### 关于事件

> 在我们使用javascript开发时，我们会经常用到很多事件，如点击、键盘、鼠标等等，这些物理性的事件。而我们今天所说的我称之为事件的，是另一种形式的事件，订阅---发布，又叫做观察者模式，他定义了一对多的依赖关系，当一个对象状态发生改变时，所有依赖于它的对象都会收到通知，而在javascript中，一般习惯性的用事件模型来替代发布---订阅模式。

列举一个生活中的例子来帮助大家理解这一种模式。炎热的夏天，妈妈烧好了饭盛上桌，冒着热气，这时妈妈喊小明吃饭（小明在旁边的屋子里饿着肚子大吉大利晚上吃鸡...），小明出来一看，跟妈妈说，等一会 ‘饭凉了’ 再叫我，太烫了...十分钟后...妈妈喊你 ‘饭凉了’，快来吃饭，而这时小明听到了妈妈的喊话说 ‘饭凉了’，便快速的出来吃完了。这个例子，就是以上介绍的订阅---发布模式。例子中的小明就是订阅者（订阅的是 ‘饭凉了’），而妈妈则是发布者（将信号 ‘饭凉了’ 发布出去）。

使用订阅---发布模式的有着显而易见的优点：订阅者不用每时每刻都询问发布者饭是否凉了，在合适的事件点，发布者会通知这些订阅者，告诉他们饭凉了，他们可以过来吃了。这样就不用把小明和妈妈强耦合在一起，当小明的弟弟妹妹都想在饭凉了在吃饭，只需告诉妈妈一声。就像每个看官肯定都接触过的一种订阅---发布：DOM事件的绑定

``` javascript
document.body.addEventListener('click', function (e) {
     console.log('我执行了...')
}, false)
```

#### 回归正题：

> ##### ****[event-mange](https://www.github.com/liuchengying/js-Events)**  通过订阅-发布模式实现的**

### 一步一步的实现
**[event-mange](https://www.github.com/liuchengying/js-Events)** 模块的主要**方法**：

* on：订阅者，添加事件
* emit：发布者， 出发事件
* once： 订阅者，添加只能监听一次之后就失效的事件
* removeListener：删除单个订阅（事件）
* removeAllListener： 删除单个事件类型的订阅或删除全部订阅
* getListenerCount：获得订阅者的数量
  
**[event-mange](https://www.github.com/liuchengying/js-Events)** 模块的主要**属性**：
* MaxEventListNum: 设置单个事件最多订阅者数量（默认为10）

---------
##### 基本骨架

首先，我们希望通过 event.on , event.emit 来订阅和发布，通过构造函数来创建一个event实例，而on，emit分别为这个实例的两个方法, 同样的，以上列出的所有主要方法，都是event的对象的原型方法。
``` javascript
function events () {};

// 列举去我们想要实现的event对象的方法

event.prototype.on = function () {};

event.prototype.emit = function () {};

event.prototype.once = function () {};

event.prototype.removeListener = function () {};

event.prototype.removeAllListener = function () {};

event.prototype.getListenerCount = function () {};
```
似乎丢了什么，没错，是event对象我们上面列出来的MaxEventListNum属性，我们给他补上
``` javascript
function event () {
    //因为MaxEventListNum属性是可以让开发者设置的
    //所以在没有set的时候，我们将其设置为 undefind
    this.MaxEventListNum = this.MaxEventListNum || undefined;

    //如果没有设置set，我们不能让监听数量无限大
    //这样有可能会造成内存溢出
    //所以我们将默认数量设置为10（当然，设置成别的数量也是可以的）
    this.defaultMaxEventListNum = 10;
}

```
到这里，基本上我们想实现的时间管理模块属性和方法的初态也就差不多了，也就是说，骨架出来了，我们就需要填饱他的代码逻辑，让他变的有血有肉（看似像个生命...）

值得思考的是，骨架我们构建完了，我们要做的是一个订阅--发布模式，我们应该怎么去记住众多的订阅事件呢？ 首先，对于一个订阅，我们需要有一个订阅的类型，也就是topic，针对此topic我们要把所有的订阅此topic的事件都放在一起，对，可以选择Array，初步的构造

``` javascript
event_list: {
    topic1: [fn1, fn2, fn3 ...]
    ...
}
```

那么接下来我们将存放我们事件的event_list放入代码中完善,作为event的属性

``` javascript
function event () {
    // 这里我们做一个简单的判断，以免一些意外的错误出现
    if(!this.event_list) {
        this.event_list = {};
    }

    this.MaxEventListNum = this.MaxEventListNum || undefined;
    this.defaultMaxEventListNum = 10;
}
```
----------
##### on 方法实现

``` javascript
event.prototype.on = function () {};
```
通过分析得出on方法首先应该接收一个订阅的topic，其次是一个当此topic响应后触发的callback方法

``` javascript
event.prototype.on = function (eventName, content) {};
```
eventName作为事件类型，将其作为event_list的一个属性，所有的事件类型为eventName的监听都push到eventName这个数组里面。
``` javascript
event.prototype.on = function (eventName, content) {
    ...
    var _event, ctx;
    _event = this.event_list;
    // 再次判断event_list是否存在，不存在则重新赋值
    if (!_event) {
      _event = this.event_list = {};
    } else {
      // 获取当前eventName的监听
      ctx = this.event_list[eventName];
    }
    // 判断是否有此监听类型
    // 如果不存在，则表示此事件第一次被监听
    // 将回调函数 content 直接赋值
    if (!ctx) {
      ctx = this.event_list[eventName] = content;
      // 改变订阅者数量
      ctx.ListenerCount = 1;
    } else if (isFunction(ctx)) {
      // 判断此属性是否为函数（是函数则表示已经有且只有一个订阅者）
      // 将此eventName类型由函数转变为数组
      ctx = this.event_list[eventName] = [ctx, content];
      // 此时订阅者数量变为数组长度
      ctx.ListenerCount = ctx.length;
    } else if (isArray(ctx)) {
      // 判断是否为数组，如果是数组则直接push
      ctx.push(content);
      ctx.ListenerCount = ctx.length;
    }
    ...
};
```

##### once 方法实现
``` javascript
event.prototype.once = function () {};
```
once方法对已订阅事件只执行一次，需执行完后立即在event_list中相应的订阅类型属性中删除该订阅的回调函数，其存储过程与on方法几乎一致，同样需要一个订阅类型的topic，以及一个响应事件的回调 content
``` javascript
event.prototype.once = function (eventName, content) {};
```
在执行完本次事件回调后立即取消注册此订阅，而如果此时同一类型的事件注册了多个监听回调，我们无法准确的删除当前once方法所注册的监听回调，所以通常我们采用的遍历事件监听队列，找到相应的监听回调然后将其删除是行不通的。还好，伟大的javascript语言为我们提供了一个强大的闭包特性，通过闭包的方式来装饰content，包装成一个全新的函数。
``` javascript
events.prototype.once = function (event, content) {
    ...
    // once和on的存储事件回调机制相同
    // dealOnce 函数 包装函数
    this.on(event, dealOnce(this, event, content));
    ...
  }

// 包装函数
function dealOnce(target, type, content) {
    var flag = false;
    // 通过闭包特性（会将函数外部引用保存在作用域中）
    function packageFun() {
      // 当此监听回调被调用时，会先删除此回调方法
      this.removeListener(type, packageFun);
      if (!flag) {
        flag = true;
        // 因为闭包，所以原监听回调还会保留，所以还会执行
        content.apply(target, arguments);
      }
      packageFun.content = content;
    }
    return packageFun;
  }
```
once的实现其实将我们自己传递的回调函数做了二次封装，再绑定上封装后的函数，封装的函数首先执行了removeListener()移除了回调函数与事件的绑定，然后才执行的回调函数

##### emit 方法实现
``` javascript
event.prototype.emit = function () {};
```
emit方法用来发布事件，驱动执行相应的事件监听队列中的监听回调，故我们需要一个事件type的topic
``` javascript
event.prototype.emit = function (eventName[,message][,message1][,...]) {};
```

当然，发布事件是，也可以像该事件监听者传递参数,数量不限，则会依次传递给所有的监听回调

``` javascript
event.prototype.emit = function (eventName[,message]) {
    var _event, ctx;
    //除第一个参数eventNmae外，其他参数保存在一个数组里
    var args = Array.prototype.slice.call(arguments, 1);
    _event = this.event_list;
    // 检测存储事件队列是否存在
    if (_event) {
      // 如果存在，得到此监听类型
      ctx = this.event_list[eventName];
    }
    // 检测此监听类型的事件队列
    // 不存在则直接返回
    if (!ctx) {
      return false;
    } else if (isFunction(ctx)) {
      // 是番薯则直接执行，并将所有参数传递给此函数（回调函数）
      ctx.apply(this, args);
    } else if (isArray(ctx)) {
      // 是数组则遍历调用
      for (var i = 0; i < ctx.length; i++) {
        ctx[i].apply(this, args);
      }
    }
};
```

emit从理解程度上来说应该是更容易一些，只是从存储事件的对象中找到相应类型的监听事件队列，然后执行队列中的每一个回调

##### removeListener 方法实现
``` javascript
event.prototype.removeListener = function () {};
```
删除某种监听类型的某一个监听回调，显然，我们仍然需要一个事件type，以及一个监听回调，当事件对列中的回调与该回调相同时，则移除
``` javascript
event.prototype.removeListener = function (eventName, content) {};
```
需要注意的是，如果我们确实存在要移除某个监听事件的回调，在on方法时一定不要使用匿名函数作为回调，这样会导致在removeListener是无法移除，因为在javascript中匿名函数是不相等的。
``` javascript
// 如果需要移除

// 错误
event.on('eatting', function (msg) {

});

// 正确
event.on('eatting', cb);
// 回调
function cb (msg) {
    ...
}
```
``` javascript
event.prototype.removeListener = function (eventName, content) {
    var _event, ctx, index = 0;
    _event = this.event_list;
    if (!_event) {
      return this;
    } else {
      ctx = this.event_list[eventName];
    }
    if (!ctx) {
      return this;
    }
    // 如果是函数  直接delete
    if (isFunction(ctx)) {
      if (ctx === content) {
        delete _event[eventName];
      }
    } else if (isArray(ctx)) {
      // 如果是数组 遍历
      for (var i = 0; i < ctx.length; i++) {
        if (ctx[i] === content) {
          // 监听回调相等
          // 从该监听回调的index开始，后面的回调依次覆盖掉前面的回调
          // 将最后的回调删除
          // 等价于直接将满足条件的监听回调删除
          this.event_list[eventName].splice(i - index, 1);
          ctx.ListenerCount = ctx.length;
          if (this.event_list[eventName].length === 0) {
            delete this.event_list[eventName]
          }
          index++;
        }
      }
    }
};

```
##### removeAllListener 方法实现
``` javascript
event.prototype.removeAllListener = function () {};
```
此方法有两个用途，即实现当有参数事件类型eventName时，则删除该类型的所有监听（清空此事件的监听回调队列），当没有参数时，则将所有类型的事件监听对垒全部移除，还是比较好理解的直接上代码
``` javascript
event.prototype.removeAllListener = function ([,eventName]) {
    var _event, ctx;
    _event = this.event_list;
    if (!_event) {
      return this;
    }
    ctx = this.event_list[eventName];
    // 判断是否有参数
    if (arguments.length === 0 && (!eventName)) {
      // 无参数
      // 将key 转成 数组  并遍历
      // 依次删除所有的类型监听
      var keys = Object.keys(this.event_list);
      for (var i = 0, key; i < keys.length; i++) {
        key = keys[i];
        delete this.event_list[key];
      }
    }
    // 有参数 直接移除
    if (ctx || isFunction(ctx) || isArray(ctx)) {
      delete this.event_list[eventName];
    } else {
      return this;
    }
};
```
其主要实现思路大致如上所述，貌似还漏了一些什么，哦，是对于是否超过舰艇数量的最大限制的处理
在on方法中
``` javascript
...
// 检测回调队列是否有maxed属性以及是否为false
if (!ctx.maxed) {
      //只有在是数组的情况下才会做比较
      if (isArray(ctx)) {
        var len = ctx.length;
        if (len > (this.MaxEventListNum ? this.MaxEventListNum : this.defaultMaxEventListNum)) { 
        // 当超过最大限制，则会发除警告
          ctx.maxed = true;
          console.warn('events.MaxEventListNum || [ MaxEventListNum ] :The number of subscriptions exceeds the maximum, and if you do not set it, the default value is 10');
        } else {
          ctx.maxed = false;
        }
      }
    }

...
```
-------------

现在Vue可谓是红的发紫，没关系，events-manage也可以在Vue中挂在到全局使用哦

``` javascript
events.prototype.install = function (Vue, Option) {
    Vue.prototype.$ev = this;
  }
```
不用多解释了吧，想必看官都明白应该怎么使用了吧(在Vue中)

##### 关于本库更具体更详细的使用文档，[赶紧戳这里](https://www.github.com/liuchengying/js-Events)

码字不易啊，如果觉得对您有一些帮助，还请给一个大大的赞👍哈哈

（...已是凌晨...）

