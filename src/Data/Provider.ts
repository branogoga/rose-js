import * as Storage from "./Storage";

import axios, { 
  AxiosResponse, 
  AxiosError, 
  Cancel, 
  CancelToken 
} from "axios";

export class OrderItem {
  public constructor(private column: string, private direction: string = "ASC") {};

  public getColumn(): string {
    return this.column;
  }

  public getDirection(): any {
    return this.direction;
  }
}

export class FilterItem {

  public constructor(private key: string, private value: any) {};

  public getKey(): string {
    return this.key;
  }

  public getValue(): any {
    return this.value;
  }
}

export interface ProviderInterface<ItemType> {
  list(
    filter?: FilterItem[], 
    order?: OrderItem[], 
    limit?: number, 
    page?: number, 
    cancelToken?: CancelToken
  ): Promise<ItemType[]>;

  get(id: number): Promise<ItemType>;
  add(item: ItemType): Promise<ItemType>;
  edit(item: ItemType): Promise<ItemType>;
  remove(id: number): Promise<ItemType>;
}

export abstract class ProviderMockup<ItemType> implements ProviderInterface<ItemType> {
  private nextId: number = 1;
  private items: Map<number, ItemType> = new Map<number, ItemType>();

  public constructor(private storage: Storage.StorageInterface<string>) {
    this.load();
  }

  public list(
    filter?: FilterItem[], 
    order?: OrderItem[], 
    limit: number = 100, 
    page: number = 0, 
    cancelToken?: CancelToken
  ): Promise<ItemType[]> {

    return new Promise<ItemType[]>(
      function(this: ProviderMockup<ItemType>, resolve: (items: ItemType[]) => void, reject: (reason: any) => void) {
        if(limit <= 0) {
          throw new Error("Parameter 'limit' must be positive number.");
        }
        if(page < 0) {
          throw new Error("Parameter 'age' must be positive number.");
        }
        const items: ItemType[] = [];
        for (let value of this.items.values()) {
          items.push(value);
        }

        // TO DO: Sort items

        // TO DO: Filter items

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

  protected abstract getStorageKey(): string;
  protected abstract getItemId(item: ItemType): number | undefined;
  protected abstract setItemId(item: ItemType, id: number): void;

  private generateId(): number {
    const nextId = this.nextId;
    this.nextId++;
    return nextId;
  }

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
}

export abstract class Provider<ItemType> implements ProviderInterface<ItemType> {
  public constructor(protected hostname: string = "http://vertigo.localhost/") {}

  public list(
    filter?: FilterItem[], 
    order?: OrderItem[], 
    limit: number = 100, 
    page: number = 0,
    cancelToken?: CancelToken,
  ): Promise<ItemType[]> {

    return new Promise<ItemType[]>((resolve: (items: ItemType[]) => void, reject: (reason: any) => void) => {
      if(limit <= 0) {
        throw new Error("Parameter 'limit' must be positive number.");
      }
      if(page < 0) {
        throw new Error("Parameter 'age' must be positive number.");
      }
    const uri: string = this.getListUri(filter, order, limit, page);
      console.log(uri);
      axios.get(uri, {
        cancelToken: cancelToken,
      }).then((response: AxiosResponse<ItemType[]>) => {
        console.log(response);
        const items: ItemType[] = response.data;
        resolve(items);
      }).catch((thrown: AxiosError | Cancel) => {
        if(axios.isCancel(thrown)) {
          const cancel: Cancel = thrown;
          console.log("Request cancelled: " + cancel.message);
        }
      });
    });
  }

  public get(id: number): Promise<ItemType> {
    return new Promise<ItemType>((resolve: (item: ItemType) => void, reject: (reason: any) => void) => {
      const uri: string = this.getGetUri(id);
      const params = {
        id,
      };
      console.log(uri);
      axios.get(uri, { params }).then((response: AxiosResponse<ItemType>) => {
        console.log(response);
        const item: ItemType = response.data;
        resolve(item);
      });
    });
  }

  public add(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>((resolve: (item: ItemType) => void, reject: (reason: any) => void) => {
      const uri: string = this.getAddUri();
      console.log(uri);

      axios.post(uri, item).then((response: AxiosResponse<ItemType>) => {
        console.log(response);
        const result: ItemType = response.data;
        resolve(result);
      });
    });
  }

  public edit(item: ItemType): Promise<ItemType> {
    return new Promise<ItemType>((resolve: (item: ItemType) => void, reject: (reason: any) => void) => {
      const id: number | undefined = this.getId(item);
      if (!id) {
        reject("Invalid ID.");
        return;
      }

      const uri: string = this.getEditUri(id);
      console.log(uri);
      axios.post(uri, item).then((response: AxiosResponse<ItemType>) => {
        console.log(response);
        const result: ItemType = response.data;
        resolve(result);
      });
    });
  }

  public remove(id: number): Promise<ItemType> {
    return new Promise<ItemType>((resolve: (item: ItemType) => void, reject: (reason: any) => void) => {
      const uri: string = this.getRemoveUri(id);
      console.log(uri);
      axios.post(uri).then((response: AxiosResponse<ItemType>) => {
        console.log(response);
        const result: ItemType = response.data;
        resolve(result);
      });
    });
  }

  protected abstract getId(item: ItemType): number | undefined;
  protected abstract getResourcePathPart(): string;

  protected getListUri(filter?: FilterItem[], order?: OrderItem[], limit?: number, page?: number): string {
    let uri = this.hostname + this.getResourcePathPart() + "/list";
    let separator = "?";

    if(filter) {
      for(let item of filter) {
        uri = uri + separator + encodeURIComponent(item.getKey()) + "=" + encodeURIComponent(item.getValue());
        separator = "&";
      }
    }

    if(order) {
      let orderValue: string = "";
      for(let i: number = 0; i < order.length; i++) {
        let item: OrderItem = order[i];
        orderValue = orderValue + "[\"" + encodeURIComponent(item.getColumn()) + "\",\"" + encodeURIComponent(item.getDirection()) + "\"]";
        if(i < order.length - 1) {
          orderValue = orderValue + ",";
        }
      }

      uri = uri + separator + "order=" + "[" + orderValue + "]";
      separator = "&";
    }

    if(limit) {
      uri = uri + separator + "limit=" + limit;
      separator = "&";
    }

    if(page) {
      uri = uri + separator + "page=" + page;
      separator = "&";
    }

     return uri;
  }

  protected getGetUri(id: number): string {
    return this.hostname + this.getResourcePathPart() + "/show/" + id;
  }

  protected getAddUri(): string {
    return this.hostname + this.getResourcePathPart() + "/add";
  }

  protected getEditUri(id: number): string {
    return this.hostname + this.getResourcePathPart() + "/edit/" + id + "?id=" + id;
  }

  protected getRemoveUri(id: number): string {
    return this.hostname + this.getResourcePathPart() + "/delete/" + id + "?id=" + id;
  }
}
