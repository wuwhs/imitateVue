var arrayKeys = Object.getOwnPropertyNames(extendArr);
var hasProto = "__proto__" in {};

function Observer(data) {
	// 如若this不是Observer对象，即创建一个
	if(!(this instanceof Observer)) {
		return new Observer(data);
	}

	// 将监听对象的隐指针指向extendObj对象
	// data.__proto__ = extendObj;

	// 继承变异方法push、pop
	if(Array.isArray(data)) {
		// data.__proto__.__proto__ = extendArr;
		// 是否支持__proto__
		var augment = hasProto
		  ? protoAugment
		  : copyAugment;
		augment(data, extendArr, arrayKeys);
	}

	this.data = data;
	this.walk(data);
}

function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    proxyObject(target, key, src[key]);
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

		data.$Observer = this;
	},

	/**
	 * [convert 监听对象属性]
	 * @param  {[String]} key [对象属性]
	 * @param  {[String|Number|Boolean]} val [对象值]
	 */
	convert: function(key, val) {
		console.log("监听了：" + key + ":", val );
		Object.defineProperty(this.data, key, {
			get: function() {
				console.log("访问了" + key + "属性");
				return val;
			},
			set: function(newVal) {
				console.log("设置了" + key + "属性");
				if(newVal !== val) {
					val = newVal;
				}
			}
		});
	},

	observe: function(data) {
		if(typeof data === "object") {
			new Observer(data);
		}
	}/*,

	proxyObject: function(obj, key, val, enume) {
		Object.defineProperty(obj, key, {
			value: val,
			enumerable: !!enume,
			writable: true,
			configurable: true
		});
	},

	"$set": function(key, val) {
		
		var self = this;

		this.proxyObject( this, key, function() {
			if(this.hasOwnProperty(key)) {
				return;
			}
			else {
				var ob = self.$Observer;
				ob.observe(val);
				ob.convert(key, val);
			}
		} );		
	}*/
};

