"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Provider = require("./Provider");
const Storage = require("./Storage");
class Item {
    constructor() {
        this.name = "";
    }
}
class ItemProviderMockup extends Provider.ProviderMockup {
    constructor() {
        super(new Storage.InMemoryStorage());
    }
    getStorageKey() {
        return "test-item";
    }
    getItemId(item) {
        return item.id;
    }
    setItemId(item, id) {
        item.id = id;
    }
}
describe("Data", () => {
    describe(".ProviderMockup", () => {
        it(" has initialy empty list of sets", () => __awaiter(this, void 0, void 0, function* () {
            let dataProvider = new ItemProviderMockup();
            let list = yield dataProvider.list();
            expect(list.length).toBe(0);
        }));
        it(" adds an item", () => __awaiter(this, void 0, void 0, function* () {
            let dataProvider = new ItemProviderMockup();
            const item = new Item();
            item.id = undefined;
            item.name = "set1";
            const addedItem = yield dataProvider.add(item);
            expect(item.id).toBe(undefined); // !!! Input is NOT modified !!!
            expect(addedItem.id).toBe(1);
            expect(addedItem.name).toBe("set1");
            let list = yield dataProvider.list();
            expect(list.length).toBe(1);
            expect(list[0].id).toBe(1);
            expect(list[0].name).toBe("set1");
        }));
        it(" gets an item", () => __awaiter(this, void 0, void 0, function* () {
            let dataProvider = new ItemProviderMockup();
            let list = yield dataProvider.list();
            expect(list.length).toBe(0);
            const item = new Item();
            item.id = undefined;
            item.name = "set1";
            const addedItem = yield dataProvider.add(item);
            list = yield dataProvider.list();
            expect(list.length).toBe(1);
            expect(addedItem.id).not.toBeNull();
            if (!addedItem.id) {
                throw new Error("Invalid argument.");
            }
            const getItem = yield dataProvider.get(addedItem.id);
            expect(getItem.id).toBe(1);
            expect(getItem.name).toBe("set1");
        }));
        it(" updates an item", () => __awaiter(this, void 0, void 0, function* () {
            let dataProvider = new ItemProviderMockup();
            const item1 = new Item();
            item1.id = undefined;
            item1.name = "set1";
            const addedItem = yield dataProvider.add(item1);
            const item2 = new Item();
            item2.id = addedItem.id;
            item2.name = "changed name";
            const changedItem = yield dataProvider.edit(item2);
            expect(changedItem.id).toBe(1);
            expect(changedItem.name).toBe("changed name");
            let list = yield dataProvider.list();
            expect(list.length).toBe(1);
            expect(list[0].id).toBe(1);
            expect(list[0].name).toBe("changed name");
        }));
        it(" removes an item", () => __awaiter(this, void 0, void 0, function* () {
            let dataProvider = new ItemProviderMockup();
            let list = yield dataProvider.list();
            expect(list.length).toBe(0);
            const item = new Item();
            item.id = undefined;
            item.name = "set1";
            const addedItem = yield dataProvider.add(item);
            list = yield dataProvider.list();
            expect(list.length).toBe(1);
            expect(addedItem.id).not.toBeNull();
            if (!addedItem.id) {
                throw new Error("Invalid argument.");
            }
            const removedItem = yield dataProvider.remove(addedItem.id);
            list = yield dataProvider.list();
            expect(list.length).toBe(0);
            expect(removedItem.id).toBe(1);
            expect(removedItem.name).toBe("set1");
        }));
    });
});
