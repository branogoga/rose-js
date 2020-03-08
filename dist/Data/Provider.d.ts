import * as Storage from "./Storage";
export declare class OrderItem {
    private column;
    private direction;
    constructor(column: string, direction?: string);
    getColumn(): string;
    getDirection(): any;
}
export declare class FilterItem {
    private key;
    private value;
    constructor(key: string, value: any);
    getKey(): string;
    getValue(): any;
}
export interface ProviderInterface<ItemType> {
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): Promise<ItemType[]>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
}
export declare abstract class ProviderMockup<ItemType> implements ProviderInterface<ItemType> {
    private storage;
    private nextId;
    private items;
    constructor(storage: Storage.StorageInterface<string>);
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): Promise<ItemType[]>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
    protected abstract getStorageKey(): string;
    protected abstract getItemId(item: ItemType): number | undefined;
    protected abstract setItemId(item: ItemType, id: number): void;
    private generateId;
    private serializeItems;
    private deserializeItems;
    private load;
    private updateNextId;
    private findMaxId;
    private save;
}
export declare abstract class Provider<ItemType> implements ProviderInterface<ItemType> {
    protected hostname: string;
    constructor(hostname?: string);
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): Promise<ItemType[]>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
    protected abstract getId(item: ItemType): number | undefined;
    protected abstract getResourcePathPart(): string;
    protected getListUri(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): string;
    protected getGetUri(id: number): string;
    protected getAddUri(): string;
    protected getEditUri(id: number): string;
    protected getRemoveUri(id: number): string;
}
