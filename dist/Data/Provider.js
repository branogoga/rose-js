"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class ProviderMockup {
    constructor(storage) {
        this.storage = storage;
        this.nextId = 1;
        this.items = new Map();
        this.load();
    }
    list(limit = 100, page = 0) {
        return new Promise(function (resolve, reject) {
            if (limit <= 0) {
                throw new Error("Parameter 'limit' must be positive number.");
            }
            if (page < 0) {
                throw new Error("Parameter 'age' must be positive number.");
            }
            const items = [];
            for (let value of this.items.values()) {
                items.push(value);
            }
            resolve(items);
        }.bind(this));
    }
    get(id) {
        return new Promise(function (resolve, reject) {
            if (this.items.has(id)) {
                const foundItem = this.items.get(id);
                if (foundItem) {
                    resolve(foundItem);
                }
                else {
                    reject("Unable to get an item: Item '" + id + "' not found.");
                }
            }
            else {
                reject("Unable to get an item: Item '" + id + "' not found.");
            }
        }.bind(this));
    }
    add(item) {
        return new Promise(function (resolve, reject) {
            const copy = Object.assign({}, item);
            const id = this.generateId();
            this.setItemId(copy, id);
            this.items.set(id, copy);
            this.save();
            const newItem = this.items.get(id);
            if (newItem) {
                resolve(newItem);
            }
            else {
                reject("Unable to add new item.");
            }
        }.bind(this));
    }
    edit(item) {
        return new Promise(function (resolve, reject) {
            const copy = Object.assign({}, item);
            const id = this.getItemId(copy);
            if (!id || !this.items.has(id)) {
                reject("Unable to edit an item: Item '" + id + "' not found.");
                return;
            }
            if (id) {
                this.items.set(id, copy);
            }
            else {
                reject("Unable to edit an item: Item '" + id + "' not found.");
                return;
            }
            this.save();
            let modifiedItem = this.items.get(id);
            if (modifiedItem) {
                resolve(modifiedItem);
            }
            else {
                reject("Unable to modify an item: Item '" + id + "' not found.");
            }
        }.bind(this));
    }
    remove(id) {
        return new Promise(function (resolve, reject) {
            if (id && this.items.has(id)) {
                const item = this.items.get(id);
                if (item) {
                    this.items.delete(id);
                    this.save();
                    resolve(item);
                }
                else {
                    reject("Unable to remove an item: Item '" + id + "' not found.");
                }
            }
            else {
                reject("Unable to remove an item: Item '" + id + "' not found.");
            }
        }.bind(this));
    }
    generateId() {
        const nextId = this.nextId;
        this.nextId++;
        return nextId;
    }
    serializeItems(items) {
        return JSON.stringify([...items]);
    }
    deserializeItems(json) {
        const items = JSON.parse(json);
        const map = new Map(items);
        return map;
    }
    load() {
        let items = this.storage.getItem(this.getStorageKey());
        if (items) {
            this.items = this.deserializeItems(items);
        }
        this.updateNextId();
    }
    updateNextId() {
        this.nextId = this.findMaxId() + 1;
    }
    findMaxId() {
        let maxId = 0;
        this.items.forEach((value, key) => {
            if (key > maxId) {
                maxId = key;
            }
        });
        return maxId;
    }
    save() {
        this.storage.setItem(this.getStorageKey(), this.serializeItems(this.items));
    }
}
exports.ProviderMockup = ProviderMockup;
class Provider {
    constructor(hostname = "http://vertigo.localhost") {
        this.hostname = hostname;
    }
    list(limit = 100, page = 0) {
        return new Promise((resolve, reject) => {
            if (limit <= 0) {
                throw new Error("Parameter 'limit' must be positive number.");
            }
            if (page < 0) {
                throw new Error("Parameter 'age' must be positive number.");
            }
            const uri = this.getListUri(limit, page);
            console.log(uri);
            axios_1.default.get(uri).then((response) => {
                console.log(response);
                const items = response.data;
                resolve(items);
            });
        });
    }
    get(id) {
        return new Promise((resolve, reject) => {
            const uri = this.getGetUri();
            const params = {
                id,
            };
            console.log(uri);
            axios_1.default.get(uri, { params }).then((response) => {
                console.log(response);
                const item = response.data;
                resolve(item);
            });
        });
    }
    add(item) {
        return new Promise((resolve, reject) => {
            const uri = this.getAddUri();
            console.log(uri);
            axios_1.default.post(uri, item).then((response) => {
                console.log(response);
                const result = response.data;
                resolve(result);
            });
        });
    }
    edit(item) {
        return new Promise((resolve, reject) => {
            const id = this.getId(item);
            if (!id) {
                reject("Invalid ID.");
                return;
            }
            const uri = this.getEditUri(id);
            console.log(uri);
            axios_1.default.post(uri, item).then((response) => {
                console.log(response);
                const result = response.data;
                resolve(result);
            });
        });
    }
    remove(id) {
        return new Promise((resolve, reject) => {
            const uri = this.getRemoveUri(id);
            console.log(uri);
            axios_1.default.post(uri).then((response) => {
                console.log(response);
                const result = response.data;
                resolve(result);
            });
        });
    }
    getListUri(limit, page) {
        return this.hostname + this.getResourcePathPart() + "/" + "?limit=" + limit + "&page=" + page;
    }
    getGetUri() {
        return this.hostname + this.getResourcePathPart() + "/show";
    }
    getAddUri() {
        return this.hostname + this.getResourcePathPart() + "/add";
    }
    getEditUri(id) {
        return this.hostname + this.getResourcePathPart() + "/edit?id=" + id;
    }
    getRemoveUri(id) {
        return this.hostname + this.getResourcePathPart() + "/delete?id=" + id;
    }
}
exports.Provider = Provider;
