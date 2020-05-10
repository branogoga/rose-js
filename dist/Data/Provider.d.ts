import * as Storage from "./Storage";
import { CancelToken } from "axios";
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
export interface CountResponse {
    count: number;
}
export interface ListResponse<ItemType> {
    items: Array<ItemType>;
}
export interface ProviderInterface<ItemType> {
    count(filter?: FilterItem[]): Promise<CountResponse>;
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number, cancelToken?: CancelToken): Promise<ListResponse<ItemType>>;
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
    count(filter?: FilterItem[]): Promise<CountResponse>;
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number, cancelToken?: CancelToken): Promise<ListResponse<ItemType>>;
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
    count(filter?: FilterItem[]): Promise<CountResponse>;
    list(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number, cancelToken?: CancelToken): Promise<ListResponse<ItemType>>;
    get(id: number): Promise<ItemType>;
    add(item: ItemType): Promise<ItemType>;
    edit(item: ItemType): Promise<ItemType>;
    remove(id: number): Promise<ItemType>;
    protected abstract getId(item: ItemType): number | undefined;
    protected abstract getResourcePathPart(): string;
    protected getListUriHelper(action: string, filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): string;
    protected getCountUri(filter?: FilterItem[]): string;
    protected getListUri(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): string;
    protected getGetUri(id: number): string;
    protected getAddUri(): string;
    protected getEditUri(id: number): string;
    protected getRemoveUri(id: number): string;
}
