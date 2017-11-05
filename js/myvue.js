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
		var data = this._data = this.$options.data, // 得到data对象
			keys = Object.keys(data), // data对象上全部的自身属性，返回数组
			self = this;



		// 监听每一个属性
		Observer(data);

		Object.assign(this, data);
		
console.log("this._data:", this._data);
		keys.forEach(function(ele) {
			/*Object.defineProperty(self, ele, {

				get: function() {
					return self._data[ele];
				},
				set: function(newVal) {
					
					var oldVal = self[ele];
					// 属性没有变化，无需更新
					if(oldVal === newVal) {
						return;
					}

					self._data[ele] = newVal;

					// 数据变化，更新页面
					MyVue.throttle(self.update, self, 50);
				}
			});*/

			// 初次进入改变self[ele]，从而触发update方法
			// self[ele] = data[ele];
		});		
	},

	// 初始化MyVue实例时，就将原始模板保留
	getTemplate: function() {
		this.template = this.$el.innerHTML;
	},

	// 数据改变更新视图
	update: function() {
		var self = this,
			template = self.template,
			reg = /\{\{\s*(\w+)\s*\}\}/g,
			result = "";

		result = template.replace(reg, function(rs, $1) {
			return self[$1] || "";
		});

		this.$el.innerHTML = result;
	},

	$set: function(target, key, val) {
		if(this.hasOwnProperty(key)) {
			target[key] = val;
		}
		else {
			var ob = target.$Observer;
			ob.observe(val);
			ob.convert(key, val);
		}
		
		return val;
	}
};


