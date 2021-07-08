const Queue = require("./Queue"); 

class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    // if tree is empty, the node getting inserted becomes the root
    if (this.key == null) {
      this.key = key;
      this.value = value;
    }
    // if the tree already exists, compare the root to they key being inserted
    // if the new key < the node key, the new node goes on the left
    else if (key < this.key) {
      // if the existing node doesn't have a left child
      // the node being inserted becomes the start of a new sub-tree
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      // if the existing node does have a left child
      // recursively call the insert() method
      } else {
        this.left.insert(key, value);
      }
    // do the same comparisons for the right side
    // but for if they node being inserted is greater than the root node
    } else {
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      } else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    // if found at root, return root value
    if (this.key == key) {
      return this.value;
    }
    // if less than root, and left child exists, recursively search the left side
    else if (key < this.key && this.left) {
      return this.left.find(key);
    }
    // if greater than root, and right child exists, recursively search the right side
    else if (key > this.key && this.right) {
      return this.right.find(key);
    }
    // search complete, throw error if not found
    else {
      throw new Error('Key Not Found'); 
    }
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      }
      // if the node only has a left child, replace the node with its left child
      else if (this.left) {
        this._replaceWith(this.left);
      }
      // if the node only has a right child, replace the node with its right child
      else if (this.right) {
        this._replaceWith(this.right);
      }
      // if the node has no children, remove it and any references to it
      else {
        this._replaceWith(null);
      }
    }
    else if (key < this.key && this.left) {
      this.left.remove(key);
    }
    else if (key > this.key && this.right) {
      this.right.remove(key);
    }
    else{
      throw new Error('Key Not Found');
    }
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      }
      else if (this == this.parent.right) {
        this.parent.right = node;
      }
      if (node) {
        node.parent = this.parent;
      }
    }
    else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      }
      else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin()
  }

  dfsInOrder(values = []) {
    // First, process the left node recursively
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }
    // Next, process the current node
    values.push(this.value);
    // Finally, process the right node recursively
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }
    return values;
  }

  dfsPreOrder(values = []) {
    // First, process the current node
    values.push(this.value);
    // Next, process the left node recursively
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }
    // Finally, process the right node recursively
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }
    return values;
  }

  bfs(tree, values = []) {
    // create a new queue
    const queue = new Queue();
    // start the traversal at the tree and add the tree node to the queue
    // this kicks-off the BFS
    queue.enqueue(tree);
    // remove from the queue
    let node = queue.dequeue();
    // while node has a value
    while (node) {
      // add that value from the queue to the array
      values.push(node.value);
      // if node has a left child, add it to the queue
      if (node.left) {
        queue.enqueue(node.left);
      }
      // if node has a right child, add it to the queue
      if (node.right) {
        queue.enqueue(node.right);
      }
      // set the node to the next item in the queue
      node = queue.dequeue();
    }
    // return the array of values once breadth-traversal is complete
    return values;
  }

  getHeight(currentHeight = 0) {
    // BASE CASE:
    // If the current node doesn't have a left or right child
    // the base case is reached, and the function can return the height
    if (!this.left && !this.right) return currentHeight;

    // RECURSIVE CASE:
    // Otherwise, compute new height
    const newHeight = currentHeight + 1;

    // If there's no left child, recurse down the right subtree only
    // passing down the height of the current node
    if (!this.left) return this.right.getHeight(newHeight);

    // If there's no right child, recurse down the left subtree only
    // passing down the height of the current node
    if (!this.right) return this.left.getHeight(newHeight);

    // If both children exist, recurse down both subtrees
    // passing down the height of the current node
    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    // return the greater of the left / right heights
    return Math.max(leftHeight, rightHeight);
  }

  isBST() {
    // use dfsInOrder() to traverse the tree
    const values = this.dfsInOrder();

    // check if the array returned by the in-order DFS is a sorted array
    for (let i = 1; i < values.length; i++) {
      // compare the current and previous values
      if (values[i] < values[i - 1]) {
        return false;
      }
    }
    return true;
  }

  findKthLargestValue(k) {
    // use existing dfsInOrder() method to traverse the BST
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;

    // ensure the index is within the bounds of the array
    if (kthIndex >= 0) {
      return values[kthIndex];
    } else {
      console.error("k value exceeds the size of the array");
    }
  }
}
