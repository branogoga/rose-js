import * as Storage from "./Storage";

import axios, { AxiosResponse } from "axios";

export interface ProviderInterface<ItemType> {
  list(): Promise<Array<ItemType>>;
  get(id: number): Promise<ItemType>;
  add(item: ItemType): Promise<ItemType>;
  edit(item: ItemType): Promise<ItemType>;
  remove(id: number): Promise<ItemType>;
}

export abstract class ProviderMockup<ItemType> implements ProviderInterface<ItemType> {
  public constructor(private storage: Storage.StorageInterface<string>) {
    this.load();
  }

  public list(): Promise<Array<ItemType>> {
    return new Promise<Array<ItemType>>(
      function(
        this: ProviderMockup<ItemType>,
        resolve: (items: Array<ItemType>) => void,
        reject: (reason: any) => void,
      ) {
        const items: Array<ItemType> = [];
        for (let value of this.items.values()) {
          items.push(value);
        }
        resolve(items);
      }.bind(this),
    );
  }

  public get(id: number): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: ProviderMockup<ItemType>, resolve: (items: ItemType) => void, reject: (reason: any) => void) {
        if (this.items.has(id)) {
          const foundItem: ItemType | undefined = this.items.get(id);
          if (foundItem) {
            resolve(foundItem);
          } else {
            reject("Unable to get an item: Item '" + id + "' not found.");
          }
        } else {
          reject("Unable to get an item: Item '" + id + "' not found.");
        }
      }.bind(this),
    );
  }

  public add(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: ProviderMockup<ItemType>, resolve: (items: ItemType) => void, reject: (reason: any) => void) {
        const copy = { ...item };
        const id: number = this.generateId();

        this.setItemId(copy, id);

        this.items.set(id, copy);

        this.save();

        const newItem: ItemType | undefined = this.items.get(id);
        if (newItem) {
          resolve(newItem);
        } else {
          reject("Unable to add new item.");
        }
      }.bind(this),
    );
  }

  public edit(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: ProviderMockup<ItemType>, resolve: (items: ItemType) => void, reject: (reason: any) => void) {
        const copy = { ...item };
        const id: number | undefined = this.getItemId(copy);
        if (!id || !this.items.has(id)) {
          reject("Unable to edit an item: Item '" + id + "' not found.");
          return;
        }

        if (id) {
          this.items.set(id, copy);
        } else {
          reject("Unable to edit an item: Item '" + id + "' not found.");
          return;
        }

        this.save();

        let modifiedItem: ItemType | undefined = this.items.get(id);
        if (modifiedItem) {
          resolve(modifiedItem);
        } else {
          reject("Unable to modify an item: Item '" + id + "' not found.");
        }
      }.bind(this),
    );
  }

  public remove(id: number): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: ProviderMockup<ItemType>, resolve: (items: ItemType) => void, reject: (reason: any) => void) {
        if (id && this.items.has(id)) {
          const item: ItemType | undefined = this.items.get(id);
          if (item) {
            this.items.delete(id);
            this.save();
            resolve(item);
          } else {
            reject("Unable to remove an item: Item '" + id + "' not found.");
          }
        } else {
          reject("Unable to remove an item: Item '" + id + "' not found.");
        }
      }.bind(this),
    );
  }

  private generateId(): number {
    const nextId = this.nextId;
    this.nextId++;
    return nextId;
  }

  protected abstract getStorageKey(): string;
  protected abstract getItemId(item: ItemType): number | undefined;
  protected abstract setItemId(item: ItemType, id: number): void;

  private serializeItems(items: Map<number, ItemType>): string {
    return JSON.stringify([...items]);
  }

  private deserializeItems(json: string): Map<number, ItemType> {
    const items: Array<[number, ItemType]> = JSON.parse(json);
    const map = new Map<number, ItemType>(items);
    return map;
  }

  private load(): void {
    let items: string | null = this.storage.getItem(this.getStorageKey());
    if (items) {
      this.items = this.deserializeItems(items);
    }
    this.updateNextId();
  }

  private updateNextId(): void {
    this.nextId = this.findMaxId() + 1;
  }

  private findMaxId(): number {
    let maxId: number = 0;
    this.items.forEach((value: ItemType, key: number) => {
      if (key > maxId) {
        maxId = key;
      }
    });
    return maxId;
  }

  private save(): void {
    this.storage.setItem(this.getStorageKey(), this.serializeItems(this.items));
  }

  private nextId: number = 1;
  private items: Map<number, ItemType> = new Map<number, ItemType>();
}

export abstract class Provider<ItemType> implements ProviderInterface<ItemType> {
  public constructor(protected hostname: string = "http://vertigo.localhost") {}

  protected abstract getId(item: ItemType): number | undefined;
  protected abstract getResourcePathPart(): string;

  protected getListUri(): string {
    return this.hostname + this.getResourcePathPart() + "/";
  }

  protected getGetUri(): string {
    return this.hostname + this.getResourcePathPart() + "/show";
  }

  protected getAddUri(): string {
    return this.hostname + this.getResourcePathPart() + "/add";
  }

  protected getEditUri(id: number): string {
    return this.hostname + this.getResourcePathPart() + "/edit?id=" + id;
  }

  protected getRemoveUri(id: number): string {
    return this.hostname + this.getResourcePathPart() + "/delete?id=" + id;
  }

  public list(): Promise<Array<ItemType>> {
    return new Promise<Array<ItemType>>(
      function(this: Provider<ItemType>, resolve: (items: Array<ItemType>) => void, reject: (reason: any) => void) {
        const uri: string = this.getListUri();
        console.log(uri);
        axios.get(uri).then(
          function(response: AxiosResponse<Array<ItemType>>) {
            console.log(response);
            const items: Array<ItemType> = response.data;
            resolve(items);
          }.bind(this),
        );
      }.bind(this),
    );
  }

  public get(id: number): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: Provider<ItemType>, resolve: (item: ItemType) => void, reject: (reason: any) => void) {
        const uri: string = this.getGetUri();
        const params = {
          id: id,
        };
        console.log(uri);
        axios.get(uri, { params }).then(
          function(response: AxiosResponse<ItemType>) {
            console.log(response);
            const item: ItemType = response.data;
            resolve(item);
          }.bind(this),
        );
      }.bind(this),
    );
  }

  public add(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: Provider<ItemType>, resolve: (item: ItemType) => void, reject: (reason: any) => void) {
        const uri: string = this.getAddUri();
        console.log(uri);

        axios.post(uri, item).then(
          function(response: AxiosResponse<ItemType>) {
            console.log(response);
            const result: ItemType = response.data;
            resolve(result);
          }.bind(this),
        );
      }.bind(this),
    );
  }

  public edit(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: Provider<ItemType>, resolve: (item: ItemType) => void, reject: (reason: any) => void) {
        const id: number | undefined = this.getId(item);
        if (!id) {
          reject("Invalid ID.");
          return;
        }

        const uri: string = this.getEditUri(id);
        console.log(uri);
        axios.post(uri, item).then(
          function(response: AxiosResponse<ItemType>) {
            console.log(response);
            const result: ItemType = response.data;
            resolve(result);
          }.bind(this),
        );
      }.bind(this),
    );
  }

  public remove(id: number): Promise<ItemType> {
    return new Promise<ItemType>(
      function(this: Provider<ItemType>, resolve: (item: ItemType) => void, reject: (reason: any) => void) {
        const uri: string = this.getRemoveUri(id);
        console.log(uri);
        axios.post(uri).then(
          function(response: AxiosResponse<ItemType>) {
            console.log(response);
            const result: ItemType = response.data;
            resolve(result);
          }.bind(this),
        );
      }.bind(this),
    );
  }
}
