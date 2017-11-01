function SimpleVue(obj){
    this.$el = document.querySelector(obj.el);
    this.$options = obj;
    this._data = Object.create(null);
    //入口
    this.init();
    obj = null;
};
SimpleVue.prototype = {
    constructor: SimpleVue,
    init: function(){
        this.getTemplate();
        this.watchData();
    },
    //初始化SimpleVue实例时，就将原始模板保留
    getTemplate: function(){
        this.template = this.$el.innerHTML;    
    },
    //监听data属性
    watchData: function(){
        var data = this.$options.data,//得到data对象
            keys = Object.keys(data),//data对象上全部的自身属性，返回数组
            that = this;
        keys.forEach(function(elem){//监听每个属性
            console.log("elem:", elem);
            Object.defineProperty(that, elem, {

                get: function(){
                    return that._data[elem];
                },
                set: function(newVal){
                    that._data[elem] = newVal;
                    that.update();//数据变化，更新页面
                }
            });
            that[elem] = data[elem];
        });
    },
    //数据改变更新视图
    update: function(){
        var that = this,
            template = that.template,
            reg = /(.*?)\{\{([.]*)\}\}/g,
            result = '';
        result = template.replace(reg, function(rs, $1, $2){
            console.log("that[$2]:", that[$2]);
            var val = that[$2] || '';
            return $1 + val;
        });
        this.$el.innerHTML = result;
        console.log('updated');
    }
};