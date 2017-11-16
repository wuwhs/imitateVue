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
                dep.notify();
            }
        });
    }
};

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
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};

/**
 * 订阅者
 * @param {Object} vm vue对象
 * @param {String} exp 属性值
 * @param {Function} cb 回调函数
 */
function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
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

        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        // 缓存自己 做个标记
        Dep.target = this;

        // 强制执行监听器里的get函数 
        // this.vm.data[this.exp] 调用getter，添加一个订阅者sub，存入到全局变量subs
        var value = this.vm.data[this.exp];

        // 释放自己
        Dep.target = null;

        return value;
    }
};

/**
 * 编译器构造函数
 * @param {String} el 根元素
 * @param {Object} vm vue对象
 */
function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    /**
     * 初始
     */
    init: function() {
        if (this.el) {
            console.log("this.el:", this.el);
            // 移除页面元素生成文档碎片
            this.fragment = this.nodeToFragment(this.el);
            // 编译文档碎片
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log("DOM Selector is not exist");
        }
    },

    /**
     * 页面DOM节点转化成文档碎片
     */
    nodeToFragment: function(el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;

        // 此处添加打印，出来的不是页面中原始的DOM，而是编译后的？
        // NodeList是引用关系，在编译后相应的值被替换了，这里打印出来的NodeList是后来被引用更新了的
        console.log("el:", el);
        // console.log("el.firstChild:", el.firstChild.nodeValue);
        while (child) {
            // append后，原el上的子节点被删除了，挂载在文档碎片上
            fragment.appendChild(child);
            child = el.firstChild;
        }

        return fragment;
    },
    /**
     * 编译文档碎片，遍历到当前是文本节点则去编译文本节点，如果当前是元素节点，并且存在子节点，则继续递归遍历
     */
    compileElement: function(fragment) {
        var childNodes = fragment.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            // var reg = /\{\{\s*(.+)\s*\}\}/g;
            var reg = /\{\{\s*((?:.|\n)+?)\s*\}\}/g;
            var text = node.textContent;

            if (self.isTextNode(node) && reg.test(text)) {
                reg.lastIndex = 0

                /* var match;
                while(match = reg.exec(text)) {
                    self.compileText(node, match[1]);
                } */

                self.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },

    /**
     * 编译文档碎片节点文本，即对标记替换
     */
    compileText: function(node, exp) {
        var self = this;
        var exps = exp.split(".");
        var initText = this.vm.data;

        exps.forEach(function(item) {
            initText = initText[item];
        });

        if (typeof initText == "undefined") {
            return
        }

        // 初始化视图
        this.updateText(node, initText);

        // 添加一个订阅者到订阅器
        var w = new Watcher(this.vm, exp, function(val) {
            self.updateText(node, val);
        });
    },

    /**
     * 更新文档碎片相应的文本节点
     */
    updateText: function(node, val) {
        node.textContent = typeof val === "undefined" ? "" : val;
    },

    /**
     * 判断文本节点
     */
    isTextNode: function(node) {
        return node.nodeType == 3;
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

    new Compile(options.el, this.vm);

    return this;
}