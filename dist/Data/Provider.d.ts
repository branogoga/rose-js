import * as Storage from "./Storage";
export interface ProviderInterface<ItemType> {
    list(): Promise<Array<ItemType>>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
}
export declare abstract class ProviderMockup<ItemType> implements ProviderInterface<ItemType> {
    private storage;
    constructor(storage: Storage.StorageInterface<string>);
    list(): Promise<Array<ItemType>>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
    private generateId;
    protected abstract getStorageKey(): string;
    protected abstract getItemId(item: ItemType): number | undefined;
    protected abstract setItemId(item: ItemType, id: number): void;
    private serializeItems;
    private deserializeItems;
    private load;
    private updateNextId;
    private findMaxId;
    private save;
    private nextId;
    private items;
}
export declare abstract class Provider<ItemType> implements ProviderInterface<ItemType> {
    protected hostname: string;
    constructor(hostname?: string);
    protected abstract getId(item: ItemType): number | undefined;
    protected abstract getResourcePathPart(): string;
    protected getListUri(): string;
    protected getGetUri(): string;
    protected getAddUri(): string;
    protected getEditUri(id: number): string;
    protected getRemoveUri(id: number): string;
    list(): Promise<Array<ItemType>>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
}
