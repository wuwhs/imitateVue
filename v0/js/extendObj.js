var extendObj = {};
var arrKeys = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
var extendArr = [];

function def(obj, key, val, enume) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enume,
		writable: true,
		configurable: true
	});
}

/*def(extendObj, "$set", function(key, val) {
	if(this.hasOwnProperty(key)) {
		return;
	}
	else {
		var ob = this.$Observer;
		ob.observe(val);
		ob.convert(key, val);
	}
});*/

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