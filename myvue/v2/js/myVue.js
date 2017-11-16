/**
 * 监听器构造函数
 * @param {Object} data 被监听数据 
 */
function Observer(data) {

    if (!data || typeof data !== "object") {
        return;
    }

    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    /**
     * 属性遍历
     */
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },

    /**
     * 监听函数
     */
    defineReactive: function(data, key, val) {
        var dep = new Dep();

        observe(val);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {

                // 判断是否需要添加订阅者 什么时候添加订阅者呢？ 与实际页面DOM有关联的data属性才添加相应的订阅者
                if (Dep.target) {
                    // 添加一个订阅者
                    dep.addSub(Dep.target);
                }

                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }

                val = newVal;

                console.log("属性：" + key + "被监听了，现在值为：" + newVal);

                // 通知所有订阅者
                dep.notify(newVal);
            }
        });

        updateView(val);

        // 订阅器标识本身实例
        Dep.target = dep;
        // 强行执行getter，往订阅器中添加订阅者
        var v = data[key];
        // 释放自己
        Dep.target = null;
    }
}

/**
 * 监听器
 * @param {Object} data 被监听对象
 */
function observe(data) {

    return new Observer(data);
}

/**
 * 订阅器
 */
function Dep() {
    this.subs = [];
    this.target = null;
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
        console.log("this.subs:", this.subs);
    },
    notify: function(data) {
        this.subs.forEach(function(sub) {
            sub.update(data);
        });
    },
    update: function(val) {
        updateView(val)
    }
};

/**
 * vue构造函数
 * @param {Object} options 所有入参
 */
function MyVue(options) {

    this.vm = this;

    this.data = options.data;

    observe(this.data);

    return this;
}

/**
 * 更新视图
 * @param {*} val 
 */
function updateView(val) {
    var $name = document.querySelector("#name");
    $name.innerHTML = val;
}