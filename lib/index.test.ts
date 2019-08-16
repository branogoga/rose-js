import * as Rose from "./index";

describe("foo ", function () {
    it(" not implemnted", function () {
        let storage = new Rose.Data.Storage.InMemoryStorage<number>();
        expect(storage.getItem("7")).toBeNull();
    }); 
});
