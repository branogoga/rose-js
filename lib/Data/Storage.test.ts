import * as Data from "./index";

describe("Storage", () => {
    describe(" InMemoryStorage", () => {
        it(" loads undefined before anything was stored in ", () => {
            const storage: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            const item: number | null = storage.getItem("key");
            expect(item).toBe(null);
        });

        it(" returns the value which was stored in ", () => {
            const storage: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            storage.setItem("key", 7);
            const item: number | null = storage.getItem("key");
            expect(item).toBe(7);
        });

        it(" overwrites the previous value ", () => {
            const storage: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            storage.setItem("key",7);
            storage.setItem("key",9);
            const item: number | null = storage.getItem("key");
            expect(item).toBe(9);
        });

        it(" loads undefined before anything was stored in ", () => {
            const storage: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            storage.setItem("key", 7);
            storage.clear();
            const item: number | null = storage.getItem("key");
            expect(item).toBe(null);
        });

        it(" does not share values with other storage ", () => {
            const storage1: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            storage1.setItem("key", 7);
            const item1: number | null = storage1.getItem("key");
            expect(item1).toBe(7);

            const storage2: Data.Storage.StorageInterface<number> = new Data.Storage.InMemoryStorage();
            const item2: number | null = storage2.getItem("key");
            expect(item2).toBe(null);
        });
    });

//    describe(" LocalStorage", () => {
//        it(" loads undefined before anything was stored in ", () => {
//            const storage: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            const item: number | undefined = storage.load();
//            expect(item).toBe(undefined);
//        });
//
//        it(" returns the value which was stored in ", () => {
//            const storage: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            storage.save(7);
//            const item: number | undefined = storage.load();
//            expect(item).toBe(7);
//        });
//
//        it(" overwrites the previous value ", () => {
//            const storage: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            storage.save(7);
//            storage.save(9);
//            const item: number | undefined = storage.load();
//            expect(item).toBe(9);
//        });
//
//        it(" loads undefined before anything was stored in ", () => {
//            const storage: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            storage.save(7);
//            storage.clear();
//            const item: number | undefined = storage.load();
//            expect(item).toBe(undefined);
//        });
//
//        it(" does share values with other storage with same namespace", () => {
//            const storage1: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            storage1.save(7);
//            const item1: number | undefined = storage1.load();
//            expect(item1).toBe(7);
//
//            const storage2: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace");
//            const item2: number | undefined = storage2.load();
//            expect(item2).toBe(undefined);
//        });
//
//        it(" does not share values with other storage with different namespace", () => {
//            const storage1: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace-1");
//            storage1.save(7);
//            const item1: number | undefined = storage1.load();
//            expect(item1).toBe(7);
//
//            const storage2: Data.OpeningHours.StorageInterface<number> = new Data.OpeningHours.LocalStorage("namespace-2");
//            const item2: number | undefined = storage2.load();
//            expect(item2).toBe(undefined);
//        });
//    });
//
//    describe(" SessionStorage", () => {
//
//    });
});
