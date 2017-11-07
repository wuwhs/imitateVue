function def(obj, key, val, enume) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enume,
		writable: true,
		configurable: true
	});
}

var arrKeys = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
var extendArr = [];

arrKeys.forEach(function(key) {
	def(extendArr, key, function() {
		var result,
			arrProto = Array.prototype,
			ob = this.$Observer,
			arr = arrProto.slice.call(arguments),
			inserted,
			index;

		switch(key) {
			case "push":
				inserted = arr;
				index = this.length;
			break;
			case "unshift":
				inserted = arr;
				index = 0;
			break;
			case "splice": 
				inserted = arr.slice(2);
				index = arr[0];
			break;
		}

		result = arrProto[key].apply(this, arguments);

		if(inserted) {
			inserted.forEach(function(val) {
				ob.observe(val);
				ob.convert(index++, val);
			});
		}

		return result;
	});
});

var arrayKeys = Object.getOwnPropertyNames(extendArr);

function Observer(data) {
	// 如若this不是Observer对象，即创建一个
	if(!(this instanceof Observer)) {
		return new Observer(data);
	}

	// 将监听对象的隐指针指向extendObj对象
	// data.__proto__ = extendObj;

	def(data, "$Observer", this);

	console.log("def data:", data);

	// 继承变异方法push、pop
	if(Array.isArray(data)) {
		// data.__proto__.__proto__ = extendArr;
		
		var hasProto = "__proto__" in {};
		
		// 是否支持__proto__
		var augment = hasProto
		  ? protoAugment
		  : copyAugment;
		augment(data, extendArr, arrayKeys);
	}
	else {
		this.data = data;
		this.walk(data);
	}
	
}

function protoAugment (target, src, keys) {
  target.__proto__ = src;
}

function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

Observer.prototype = {
	constructor: Observer,

	/**
	 * [walk 遍历监听data所有属性]
	 * @param  {[Object]} data [待监听对象]
	 */
	walk: function(data) {
		var self = this,
			keys = Object.keys(data);

		keys.forEach(function(key) {
			var val = data[key];

			// 如果val为对象，则交给Observer处理
			if(typeof val === "object") {
				Observer(val);
			}

			self.convert(key, val);
		});

		// data.$Observer = this;
	},

	/**
	 * [convert 监听对象属性]
	 * @param  {[String]} key [对象属性]
	 * @param  {[String|Number|Boolean]} val [对象值]
	 */
	convert: function(key, val) {

		// console.log("监听了：" + key + ":", val );
		Object.defineProperty(this.data, key, {
			get: function() {
				// console.log("访问了" + key + "属性");
				return val;
			},
			set: function(newVal) {
				// console.log("设置了" + key + "属性");
				if(newVal !== val) {
					val = newVal;
					
					/*console.log("newVal:", newVal);
					MyVue._data[key] = newVal;

					MyVue[key] = val;

					// 数据变化，更新页面
					MyVue.throttle(MyVue.update, MyVue, 50);*/
				}
			}
		});		

	},

	observe: function(data) {
		if(typeof data === "object") {
			new Observer(data);
		}
	}
};


