
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

        observe(val);

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {                
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }

                val = newVal;

                console.log("属性：" + key + "被监听了，现在值为：" + newVal);

                updateView(newVal);
            }
        });

        updateView(val);
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
 * vue构造函数
 * @param {Object} options 所有入参
 */
function MyVue(options) {

    this.vm = this;

    this.data = options.data;

    // 监听数据
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