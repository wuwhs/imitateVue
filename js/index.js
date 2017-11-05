/*var person = {};

Object.defineProperty(person, "name", {
	writable: true,			// 是否可写
	configurable: true,		// 是否可删除
	enumerable: false,  	// 是否同通过for-in循环返回属性
	value: "wuwh"           // 属性数据值
});

console.log(person.name);

person.name = "xiaohua";
console.log(person.name);

// 对象属性configurable设为false后，不能再进行设置的了
Object.defineProperty(person, "name", {
	configurable: false
});

// 不可删除，delete后没有效果
delete person.name;
console.log(person.name);

// 不可枚举，name不能被遍历出来
for(var o in person) {
	console.log("o:" + o);
}*/

var vm = new MyVue({
	el: "#test",
	data: {
		name: "$wuwh",
		age: "22"
	},
	created: function() {
		console.log("created this:", this);
	}
});

/*
var nodeList = ["A", "B", "C", null, null, "D", "E", null, "G", null, null, "F", null, null, null];
var treeNode = TreeNode.createBinaryTree(nodeList);
console.log("treeNode:", treeNode);
treeNode.PreOrderTraverse();
treeNode.InOrderTraverse();
treeNode.PostOrderTraverse();
*/

/*
var treeNode = TreeNode("A", [
		TreeNode("B", [TreeNode("E")]),
		TreeNode("C"),
		TreeNode("D")
	]);

treeNode.traverseAsDFS();
treeNode.traverseAsBFS();
*/

/*var data = {
	user: {
		name: "wuwh",
		age: 23
	},
	student: {
		class: "111",
		school: "baidu"
	},
	fruit: ["apple"]
};

console.log( Observer(data) );*/
