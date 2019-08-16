"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryStorage {
    constructor(store = new Map()) {
        this.store = store;
    }
    clear() {
        this.store.clear();
    }
    getItem(key) {
        return this.store.get(key) || null;
    }
    setItem(key, value) {
        this.store.set(key, value);
    }
    removeItem(key) {
        const item = this.getItem(key);
        this.store.delete(key);
        return item;
    }
}
exports.InMemoryStorage = InMemoryStorage;
class BrowserStorage {
    constructor(storage) {
        this.storage = storage;
    }
    clear() {
        this.storage.clear();
    }
    getItem(key) {
        const item = this.storage.getItem(key);
        if (item == null) {
            return null;
        }
        return JSON.parse(item);
    }
    setItem(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    }
    removeItem(key) {
        const item = this.getItem(key);
        this.storage.removeItem(key);
        return item;
    }
}
exports.BrowserStorage = BrowserStorage;
class LocalStorage extends BrowserStorage {
    constructor() {
        super(localStorage);
    }
}
exports.LocalStorage = LocalStorage;
class SessionStorage extends BrowserStorage {
    constructor() {
        super(sessionStorage);
    }
}
exports.SessionStorage = SessionStorage;
