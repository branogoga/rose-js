"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rose = require("./index");
describe("foo ", function () {
    it(" not implemnted", function () {
        let storage = new Rose.Data.Storage.InMemoryStorage();
        expect(storage.getItem("7")).toBeNull();
    });
});
