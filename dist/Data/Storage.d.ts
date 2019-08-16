export interface StorageInterface<ItemType> {
    clear(): void;
    getItem(key: string): ItemType | null;
    setItem(key: string, value: ItemType): void;
    removeItem(key: string): ItemType | null;
}
export declare class InMemoryStorage<ItemType> implements StorageInterface<ItemType> {
    private store;
    constructor(store?: Map<string, ItemType>);
    clear(): void;
    getItem(key: string): ItemType | null;
    setItem(key: string, value: ItemType): void;
    removeItem(key: string): ItemType | null;
}
export declare class BrowserStorage<ItemType> implements StorageInterface<ItemType> {
    private storage;
    constructor(storage: Storage);
    clear(): void;
    getItem(key: string): ItemType | null;
    setItem(key: string, value: ItemType): void;
    removeItem(key: string): ItemType | null;
}
export declare class LocalStorage<ItemType> extends BrowserStorage<ItemType> {
    constructor();
}
export declare class SessionStorage<ItemType> extends BrowserStorage<ItemType> {
    constructor();
}
