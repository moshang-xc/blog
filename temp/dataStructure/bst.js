/**
 * 二叉搜索树
 * Binary search tree
 */
class Node{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BST{
    constructor(root){
        this.root = root;
    }

    insert(data){
        let node = new Node(data);
        if(!this.root){
            this.root = node;
            return;
        }

        let current = this.root;
        while(true){
            if(node.data < current.data){
                if(!current.left){
                    current.left = node;
                    break;
                }
                current = current.left;
            }else{
                if(!current.right){
                    current.right = node;
                    break;
                }
                current = current.right;
            }
        }
    }

    // 前序遍历：根结点 ---> 左子树 ---> 右子树
    preOrder(node){
        node = node || this.root;
        if(node){
            console.log(node.data);
            this.preOrder(node.left);
            this.preOrder(node.right);
        }
    }

    // 中序遍历：左子树---> 根结点 ---> 右子树
    inOrder(node){
        node = node || this.root;
        if(node){
            this.inOrder(node.left);
            console.log(node.data);
            this.inOrder(node.right);
        }
    }

    // 后序遍历：左子树 ---> 右子树 ---> 根结点
    preOrder(node){
        node = node || this.root;
        if(node){
            this.preOrder(node.left);
            this.preOrder(node.right);
            console.log(node.data);
        }
    }

    // 获取最小值
    getMin(){
        let current = this.root;
        if(current){
            while(current.left){
                current = current.left;
            }
            return current.data;
        }
    }

    // 获取最大值
    getMax(){
        let current = this.root;
        if(current){
            while(current.right){
                current = current.right;
            }
            return current.data;
        }
    }

    // 查找节点
    search(data){
        let current = this.root;
        if(current){
            if(current.data === data){
                return current;
            }

            if(current.data > data){
                current = current.left;
            }else{
                current = current.right;
            }
        }
        return null;
    }

    // 深度优先遍历
    deepFirstTraversal(){
        //见后续遍历
    }

    // 广度优先遍历
    breadthFirstTraversal(){
        let queue = [];
        if(!this.root){
            return;
        }

        queue.push(this.root);
        while(queue.length > 0){
            let node = queue.shift();
            console.log(node.data);
            node.left && queue.push(node.left);
            node.left && queue.push(node.right);
        }
    }

    // 深度
    deep(node){
        if(!node){
            return 0;
        }
        let left, right;
        left = this.deep(node.left);
        right = this.deep(node.right);
        return Math.max(left, right) + 1;
    }
} 