function MyVue(obj) {

	this.$el = document.querySelector(obj.el);
	this.$options = obj;
	this._data = Object.create(null);

	this.init();
	obj = null;
}

// 节流函数
MyVue.throttle = function(method, context, delay) {
	clearTimeout(method.timer);

	method.timer = setTimeout(function() {
		method.call(context);
	}, delay);
};

// 钩子函数
MyVue.callHook = function(vm, hook) {
	var handler = vm.$options[hook];

	if(handler) {
		handler.call(vm);
	}
};

MyVue.prototype = {
	constructor: MyVue,
	init: function() {
		this.getTemplate();
		this.watchData();
		MyVue.callHook(this, "created");
	},
	// 监听data属性
	watchData: function() {
		var data = this.$options.data, // 得到data对象
			keys = Object.keys(data), // data对象上全部的自身属性，返回数组
			that = this;

		// 监听每一个属性
		keys.forEach(function(ele) {
			Object.defineProperty(that, ele, {

				get: function() {
					return that._data[ele];
				},
				set: function(newVal) {
					
					var oldVal = that[ele];
					// 属性没有变化，无需更新
					if(oldVal === newVal) {
						return;
					}

					that._data[ele] = newVal;

					// 数据变化，更新页面
					MyVue.throttle(that.update, that, 50);
				}
			});

			// 初次进入改变that[ele]，从而触发update方法
			that[ele] = data[ele];
		});		
	},

	// 初始化MyVue实例时，就将原始模板保留
	getTemplate: function() {
		this.template = this.$el.innerHTML;
	},

	// 数据改变更新视图
	update: function() {
		var that = this,
			template = that.template,
			reg = /\{\{\s*(\w+)\s*\}\}/g,
			result = "";

		result = template.replace(reg, function(rs, $1) {
			return that[$1] || "";
		});
console.log("result:", result);
		this.$el.innerHTML = result;
	}
};


