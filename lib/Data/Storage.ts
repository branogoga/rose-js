export interface StorageInterface<ItemType> {
  clear(): void;
  getItem(key: string): ItemType | null;
  setItem(key: string, value: ItemType): void;
  removeItem(key: string): ItemType | null;
}

export class InMemoryStorage<ItemType> implements StorageInterface<ItemType> {
  constructor(private store: Map<string, ItemType> = new Map<string, ItemType>()) {}

  clear() {
    this.store.clear();
  }

  getItem(key: string): ItemType | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: ItemType): void {
    this.store.set(key, value);
  }

  removeItem(key: string): ItemType | null {
    const item = this.getItem(key);
    this.store.delete(key);
    return item;
  }
}

export class BrowserStorage<ItemType> implements StorageInterface<ItemType> {
  public constructor(private storage: Storage) {}

  public clear(): void {
    this.storage.clear();
  }

  getItem(key: string): ItemType | null {
    const item: string | null = this.storage.getItem(key);
    if (item == null) {
      return null;
    }

    return JSON.parse(item);
  }

  setItem(key: string, value: ItemType): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): ItemType | null {
    const item = this.getItem(key);
    this.storage.removeItem(key);
    return item;
  }
}

export class LocalStorage<ItemType> extends BrowserStorage<ItemType> {
  public constructor() {
    super(localStorage);
  }
}

export class SessionStorage<ItemType> extends BrowserStorage<ItemType> {
  public constructor() {
    super(sessionStorage);
  }
}
