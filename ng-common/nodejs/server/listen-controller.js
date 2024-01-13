/**
 * The Controller to handle listeners.
 * It has 2 interfaces:
 *   1) controller to register listeners in it;
 *   2) dispatcher to handle incoming messages and forward them to specific controllers.
 * A listener has some query, like (param1=value1, param2=value2).
 * If dispatched message has all key-values specific for a listener, then such a message is forwarded to the listener.
 * It's used to pass tx events to online websocket-based listeners.
 * There is a Forest of trees.
 * Each tree is to handle the listeners of specific query type based on keys set.
 * We register the listener once in one leaf-node of one tree.
 * No dependencies.
 * Pure abstract.
 */
'use strict';

const util = require('../../util');

class Node {
  constructor(tree) {
    this.tree = tree;
  }
  add(query, ws, i, key) {
    const value = query[this.tree.keys[i]];
    if (i === this.tree.keys.length) {
      if (!this.listeners) {
        this.listeners = []; // arrays of ws client connections
      }
      const index = this.listeners.findIndex(item => item.ws === ws);
      if (index === -1)
        this.listeners.push({ws, keys: [key]});
      else
        this.listeners[index].keys.push(key);
    } else {
      if (!this.values)
        this.values = {};
      let node = this.values[value];
      if (!node) {
        node = new Node(this.tree);
        this.values[value] = node;
      }
      node.add(query, ws, i+1, key);
    }
  }
  remove(query, ws, i, key) {
    const value = query[this.tree.keys[i]];
    if (i === this.tree.keys.length) {
      if (this.listeners) {
        const iListener = this.listeners.findIndex(item => item.ws === ws);
        if (iListener !== -1) {
          const listener = this.listeners[iListener];
          const iKey = listener.keys.indexOf(key);
          if (iKey !== -1) {
            listener.keys.splice(iKey, 1);
            if (listener.keys.length === 0)
              this.listeners.splice(iListener, 1);
          }
        }
      }
    } else {
      if (this.values) {
        let node = this.values[value];
        if (node)
          node.remove(query, ws, i + 1, key);
      }
    }
  }
  removeWs(ws) {
    if (this.listeners) {
      const index = this.listeners.findIndex(item => item.ws === ws);
      if (index !== -1)
        this.listeners.splice(index, 1);
    }
    if (this.values)
      Object.values(this.values).forEach(node => node.removeWs(ws));
  }
  dispatch(record, i, cb) {
    if (i === this.tree.keys.length) {
      if (this.listeners) {
        this.listeners.forEach(listener => cb(listener.ws, listener.keys));
      }
    } else {
      const value = record[this.tree.keys[i]];
      if (typeof value === 'undefined')
        return;
      if (this.values) {
        let node = this.values[value];
        if (node)
          node.dispatch(record, i + 1, cb);
      }
    }
  }
}

class Tree {
  constructor(keys) {
    this.keys = keys;
  }
  add(query, ws, key) {
    if (!this.rootNode)
      this.rootNode = new Node(this);
    this.rootNode.add(query, ws, 0, key);
  }
  remove(query, ws, key) {
    if (this.rootNode)
      this.rootNode.remove(query, ws, 0, key);
  }
  removeWs(ws) {
    if (this.rootNode)
      this.rootNode.removeWs(ws);
  }
  dispatch(record, cb) {
    if (this.rootNode)
      this.rootNode.dispatch(record, 0, cb);
  }
}

class Forest {
  constructor() {
    this.trees = {};
  }
  add(query, ws, _key) {
    const keys = queryKeys(query);
    const key = keys.join(',');
    if (!this.trees[key])
      this.trees[key] = new Tree(keys);
    this.trees[key].add(query, ws, _key);
  }
  remove(query, ws, _key) {
    const key = queryKey(query);
    if (this.trees[key])
      this.trees[key].remove(query, ws, _key);
  }
  removeWs(ws) {
    Object.values(this.trees).forEach(tree => tree.removeWs(ws));
  }
  dispatch(record, cb) {
    for (const tree of Object.values(this.trees)) {
      tree.dispatch(record, cb);
    }
  }
}

const forest = new Forest();

module.exports = function listenController() {
  const controller = {
    listen: (query, ws, key) => {
      forest.add(query, ws, key);
      return util.timestamp();
    },
    close: (query, ws, key) => forest.remove(query, ws, key),
    closeWs: (ws) => forest.removeWs(ws)
  };
  const dispatcher = {
    dispatch: (record, cb) => forest.dispatch(record, cb)
  };
  return {__components:{
    listenController: controller,
    listenDispatcher: dispatcher
  }};
};

function queryKeys(query) {
  if (!query)
    return [];
  return Object.keys(query).sort();
}
function queryKey(query) {
  return queryKeys(query).join(',');
}
