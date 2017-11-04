// 二叉树节点
function TreeNode() {
	this.data = null; // 节点数据
	this.lchild = null; // 左子树
	this.rchild = null; // 右子树
}

/**
 * [createBinaryTree 采用先序序列建立二叉树]
 * @param  {[Array]} nodeList [树节点，以先序序列存入数组中，null代表空节点]
 * @return {[Array]}          [树节点数组]
 */
TreeNode.createBinaryTree = function(nodeList) {
	var i = 0;
	return (function getNode() {
		var node = null,
			val = nodeList[i++];

		if(!val) {
			node = null;
		}
		else {
			node = new TreeNode();
			node.data = val;
			node.lchild = getNode();
			node.rchild = getNode();
		}

		return node;
	})();
};

// 遍历二叉树
TreeNode.prototype = {
	constructor: TreeNode,

	// 先序遍历
	_PreOrderTraverse: function(node) {
		if(node) {
			console.log(node.data);
			this._PreOrderTraverse(node.lchild);
			this._PreOrderTraverse(node.rchild);
		}
	},

	PreOrderTraverse: function() {
		this._PreOrderTraverse(this);
	},

	// 中序遍历
	_InOrderTraverse: function(node) {
		if(node) {
			this._InOrderTraverse(node.lchild);
			console.log(node.data);
			this._InOrderTraverse(node.rchild);
		}
	},

	InOrderTraverse: function() {
		this._InOrderTraverse(this);
	},

	// 后序遍历
	_PostOrderTraverse: function(node) {
		if(node) {
			this._PostOrderTraverse(node.lchild);
			this._PostOrderTraverse(node.rchild);
			console.log(node.data);
		}
	},

	PostOrderTraverse: function() {
		this._PostOrderTraverse(this);
	}
}

/**
 * aaa 
 * 
 */
function aaa(a, b, c, cb) {

}