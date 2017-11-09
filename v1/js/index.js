
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },

    defineReactive: function(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                
                // 判断是否需要添加订阅者 什么时候添加订阅者呢？ 与实际页面DOM有关联的data属性才添加相应的订阅者
                if(Dep.target) {
                    // 在这里添加一个订阅者
                    dep.addSub(Dep.target);

                    console.log("订阅者 get data:", val);
                }
                return val;
            },
            set: function(newVal) {
                if(newVal === val) {
                    return;
                }

                val = newVal;

                dep.notify();
                console.log("属性：" + key + "被监听了，现在值为：" + newVal);
            }
        });
    }
}

function observe(data) {
    if(!data || typeof data !== "object") {
        return;
    }

    return new Observer(data);
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
        console.log("this.subs:",this.subs);
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
        // 缓存自己 做个标记
        Dep.target = this;

        // 强制执行监听器里的get函数 this.vm.data[this.exp] 调用getter，添加一个订阅者sub，存入到全局变量subs
        var value = this.vm.data[this.exp];

        // 释放自己
        Dep.target = null;

        return value;
    }
}

function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function() {
        if(this.el) {
            console.log("this.el:", this.el);
            // 移除页面元素生成文档碎片
            this.fragment = this.nodeToFragment(this.el);
            // 编译文档碎片
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        }
        else {
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
        while(child) {
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
            var reg = /\{\{\s*(\w+)\s*\}\}/;
            var text = node.textContent;

            if(self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, reg.exec(text)[1]);
            }

            if(node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    /**
     * 编译文档碎片节点文本，即对标记替换
     */
    compileText: function(node, exp) {
        var self = this;
        var initText = this.vm[exp];
        
        this.updateText(node, initText);

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
}

function MyVue(options) {
    var self = this;

    this.vm = this;

    this.data = options.data;

    // 把data属性的监听代理到根
    Object.keys(this.data).forEach(function(key) {
        self.proxy(key);
    });

    observe(this.data);
   
    new Compile(options.el, this.vm);

    return this;
}


MyVue.prototype.proxy = function(key) {
    var self = this;

    Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: function proxyGetter() {
            return self.data[key];
        },
        set: function proxySetter(newVal) {
            self.data[key] = newVal;
        }
    });
}

var myvm = new MyVue({
    el: "#demo",
    data: {
        name: "hello word",
        desc: "MVVM"
    }
});

setTimeout(function() {
    console.log("name值变了");
    myvm.name = "wawawa...vue";
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

