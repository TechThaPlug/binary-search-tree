class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sorted = [...new Set(array)].sort((a, b) => a - b);
    return this.build(sorted, 0, sorted.length - 1);
  }

  build(array, start, end) {
    if (start > end) return null;

    const middle = Math.floor((start + end) / 2);
    const node = new Node(array[middle]);

    node.left = this.build(array, start, middle - 1);
    node.right = this.build(array, middle + 1, end);

    return node;
  }

  includes(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) return true;
      current = value < current.data ? current.left : current.right;
    }

    return false;
  }

  insert(value) {
    if (this.includes(value)) return;

    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;

    while (true) {
      if (value < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  deleteItem(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteNode(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let successor = node.right;

      while (successor.left !== null) {
        successor = successor.left;
      }

      node.data = successor.data;
      node.right = this.deleteNode(node.right, successor.data);
    }

    return node;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    if (this.root === null) return;

    const queue = [this.root];

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current.data);

      if (current.left !== null) queue.push(current.left);
      if (current.right !== null) queue.push(current.right);
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    this.inOrder(this.root, callback);
  }

  inOrder(node, callback) {
    if (node === null) return;

    this.inOrder(node.left, callback);
    callback(node.data);
    this.inOrder(node.right, callback);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    this.preOrder(this.root, callback);
  }

  preOrder(node, callback) {
    if (node === null) return;

    callback(node.data);
    this.preOrder(node.left, callback);
    this.preOrder(node.right, callback);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    this.postOrder(this.root, callback);
  }

  postOrder(node, callback) {
    if (node === null) return;

    this.postOrder(node.left, callback);
    this.postOrder(node.right, callback);
    callback(node.data);
  }

  height(value) {
    const node = this.findNode(this.root, value);

    if (node === null) return undefined;

    return this.getNodeHeight(node);
  }

  findNode(node, value) {
    if (node === null) return null;

    if (value === node.data) return node;

    if (value < node.data) {
      return this.findNode(node.left, value);
    }

    return this.findNode(node.right, value);
  }

  getNodeHeight(node) {
    if (node === null) return -1;

    const left = this.getNodeHeight(node.left);
    const right = this.getNodeHeight(node.right);

    return Math.max(left, right) + 1;
  }

  depth(value) {
    let current = this.root;
    let depth = 0;

    while (current !== null) {
      if (value === current.data) return depth;

      if (value < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }

      depth++;
    }

    return undefined;
  }

  isBalanced() {
    return this.checkBalance(this.root) !== -1;
  }

  checkBalance(node) {
    if (node === null) return 0;

    const left = this.checkBalance(node.left);
    const right = this.checkBalance(node.right);

    if (left === -1 || right === -1) return -1;

    if (Math.abs(left - right) > 1) return -1;

    return Math.max(left, right) + 1;
  }

  rebalance() {
    const values = [];

    this.inOrderForEach(value => values.push(value));

    this.root = this.buildTree(values);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

function getRandomNumbers() {
  const numbers = [];

  while (numbers.length < 10) {
    const number = Math.floor(Math.random() * 100);

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
}

const tree = new Tree(getRandomNumbers());

console.log("Balanced:", tree.isBalanced());

console.log("Level order:");
tree.levelOrderForEach(value => console.log(value));

console.log("Pre order:");
tree.preOrderForEach(value => console.log(value));

console.log("Post order:");
tree.postOrderForEach(value => console.log(value));

console.log("In order:");
tree.inOrderForEach(value => console.log(value));

tree.insert(120);
tree.insert(150);
tree.insert(180);
tree.insert(200);

console.log("Balanced after adding large numbers:", tree.isBalanced());

tree.rebalance();

console.log("Balanced after rebalance:", tree.isBalanced());

console.log("Level order after rebalance:");
tree.levelOrderForEach(value => console.log(value));

prettyPrint(tree.root);