/**
 * 链表
 */

class Node{
    constructor(data){
        this.data = data;
        this.pre = null;
        this.next = null;
    }
}

class Link{
    constructor(data){
        this.head = new Node(data);
    }

    insertAfter(newNode, data){
        let target = this.find(data);
        newNode.next = target.next;
        target.next && (target.next.pre = newNode);
        newNode.pre = target;
        target.next = newNode;
    }

    remove(data){
        let node = this.find(data);
        node.pre.next = node.next;
        node.next.pre = node.pre;
        node.pre = null;
        node.next = null;
    }

    find(data){
        let current = this.head;
        while(current && current.data !== data){
            current = current.next;
        }
        return current;
    }
}