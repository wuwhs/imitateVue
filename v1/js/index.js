function defineReactive(data, key, val) {
    observe(val);

    var dep = new Dep();

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            // 判断是否需要添加订阅者
            if(Dep.target) {
                // 在这里添加一个订阅者
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function(newVal) {
            val = newVal;
            console.log("属性：" + key + "被监听了，现在值为：" + newVal);
        }
    });
}

function observe(data) {
    if(!data || typeof data !== "object") {
        return;
    }

    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
}

/**
 * 订阅器
 */
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
}

/**
 * 订阅者
 * @param {*} vm 
 * @param {*} exp 
 * @param {*} cb 
 */
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    // 将自己添加到订阅器
    this.value = this.get();
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if(value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        // 缓存自己
        Dep.target = this;

        // 强制执行监听器里的get函数
        var value = this.vm.data[this.exp];

        // 释放自己
        Dep.target = null;

        return value;
    }
}

function MyVue(data, el, exp) {
    this.data = data;
    observe(data);
    el.innerHTML = this.data[exp];
    new Watcher(this, exp, function(value) {
        el.innerHTML = value;
    });

    return this;
}

var ele = document.querySelector("#name");
var vm = new MyVue({
    name: "hello word"
}, ele, "name");

setTimeout(function() {
    console.log("name值变了");
    vm.data.name = "wawawa...vue";
}, 2000);

/* var library = {
    student: {
        name: "wuwh",
        age: 18
    },
    school: {
        name: "qing",
        may: "pc"
    }
};

observe(library); */

