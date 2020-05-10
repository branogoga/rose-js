import * as Provider from "./Provider";
import * as Storage from "./Storage";

class Item {
  public id?: number;
  public name: string = "";
}

class ItemProviderMockup extends Provider.ProviderMockup<Item> {
  public constructor() {
    super(new Storage.InMemoryStorage());
  }

  protected getStorageKey(): string {
    return "test-item";
  }

  protected getItemId(item: Item): number | undefined {
    return item.id;
  }

  protected setItemId(item: Item, id: number): void {
    item.id = id;
  }
}

class ItemProvider extends Provider.Provider<Item> {

  protected getId(item: Item): number | undefined {
    return item.id;
  }

  protected getResourcePathPart(): string {
    return "resource";
  }

  public getListUri(filter?: Provider.FilterItem[], order?: Provider.OrderItem[], limit?: number, page?: number): string {
    return super.getListUri(filter, order, limit, page);
  }
}

describe("Data", () => {
  describe(".ProviderMockup", () => {
    it(" has initialy empty list of sets", async () => {
      let dataProvider: Provider.ProviderInterface<Item> = new ItemProviderMockup();

      let list = await dataProvider.list(undefined, undefined, 100, 0);
      expect(list.items.length).toBe(0);
    });

    it(" adds an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      const item: Item = new Item();

      item.id = undefined;
      item.name = "set1";

      const addedItem = await dataProvider.add(item);

      expect(item.id).toBe(undefined); // !!! Input is NOT modified !!!
      expect(addedItem.id).toBe(1);
      expect(addedItem.name).toBe("set1");

      let list = await dataProvider.list();
      expect(list.items.length).toBe(1);
      expect(list.items[0].id).toBe(1);
      expect(list.items[0].name).toBe("set1");
    });

    it(" gets an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      let list = await dataProvider.list();
      expect(list.items.length).toBe(0);

      const item: Item = new Item();

      item.id = undefined;
      item.name = "set1";

      const addedItem = await dataProvider.add(item);

      list = await dataProvider.list();
      expect(list.items.length).toBe(1);

      expect(addedItem.id).not.toBeNull();

      if (!addedItem.id) {
        throw new Error("Invalid argument.");
      }

      const getItem = await dataProvider.get(addedItem.id);

      expect(getItem.id).toBe(1);
      expect(getItem.name).toBe("set1");
    });

    it(" updates an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      const item1: Item = new Item();

      item1.id = undefined;
      item1.name = "set1";

      const addedItem = await dataProvider.add(item1);

      const item2: Item = new Item();

      item2.id = addedItem.id;
      item2.name = "changed name";

      const changedItem = await dataProvider.edit(item2);

      expect(changedItem.id).toBe(1);
      expect(changedItem.name).toBe("changed name");

      let list = await dataProvider.list();
      expect(list.items.length).toBe(1);
      expect(list.items[0].id).toBe(1);
      expect(list.items[0].name).toBe("changed name");
    });

    it(" removes an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      let list = await dataProvider.list();
      expect(list.items.length).toBe(0);

      const item: Item = new Item();

      item.id = undefined;
      item.name = "set1";

      const addedItem = await dataProvider.add(item);

      list = await dataProvider.list();
      expect(list.items.length).toBe(1);

      expect(addedItem.id).not.toBeNull();

      if (!addedItem.id) {
        throw new Error("Invalid argument.");
      }

      const removedItem = await dataProvider.remove(addedItem.id);

      list = await dataProvider.list();
      expect(list.items.length).toBe(0);

      expect(removedItem.id).toBe(1);
      expect(removedItem.name).toBe("set1");
    });
  });
  describe(".Provider", () => {
    it(" asks for list", async () => {
      let dataProvider: ItemProvider = new ItemProvider();

      let uri: string = dataProvider.getListUri();
      expect(uri).toBe("http://vertigo.localhost/resource/list");
    });
    it(" asks for list with limit", async () => {
      let dataProvider: ItemProvider = new ItemProvider();

      let uri: string = dataProvider.getListUri(undefined, undefined, 10);
      expect(uri).toBe("http://vertigo.localhost/resource/list?limit=10");
    });
    it(" asks for list with limit and page", async () => {
      let dataProvider: ItemProvider = new ItemProvider();

      let uri: string = dataProvider.getListUri(undefined, undefined, 10, 3);
      expect(uri).toBe("http://vertigo.localhost/resource/list?limit=10&page=3");
    });
    it(" asks for list with order, limit and page", async () => {
      let dataProvider: ItemProvider = new ItemProvider();

      let order = [
        new Provider.OrderItem("column1","DESC"),
        new Provider.OrderItem("column2","ASC")
      ];

      let uri: string = dataProvider.getListUri(undefined, order, 10, 3);
      expect(uri).toBe('http://vertigo.localhost/resource/list?order=[["column1","DESC"],["column2","ASC"]]&limit=10&page=3');
    });
    it(" asks for list with filter, order, limit and page", async () => {
      let dataProvider: ItemProvider = new ItemProvider();

      let filter = [
        new Provider.FilterItem("key1", "value1"),
        new Provider.FilterItem("key2", 7)
      ];

      let order = [
        new Provider.OrderItem("column1","DESC"),
        new Provider.OrderItem("column2","ASC")
      ];

      let uri: string = dataProvider.getListUri(filter, order, 10, 3);
      expect(uri).toBe('http://vertigo.localhost/resource/list?key1=value1&key2=7&order=[["column1","DESC"],["column2","ASC"]]&limit=10&page=3');
    });
  });
});
