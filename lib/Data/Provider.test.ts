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

describe("Data", () => {
  describe(".ProviderMockup", () => {
    it(" has initialy empty list of sets", async () => {
      let dataProvider: Provider.ProviderInterface<Item> = new ItemProviderMockup();

      let list = await dataProvider.list();
      expect(list.length).toBe(0);
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
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(1);
      expect(list[0].name).toBe("set1");
    });

    it(" gets an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      let list = await dataProvider.list();
      expect(list.length).toBe(0);

      const item: Item = new Item();

      item.id = undefined;
      item.name = "set1";

      const addedItem = await dataProvider.add(item);

      list = await dataProvider.list();
      expect(list.length).toBe(1);

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
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(1);
      expect(list[0].name).toBe("changed name");
    });

    it(" removes an item", async () => {
      let dataProvider: ItemProviderMockup = new ItemProviderMockup();

      let list = await dataProvider.list();
      expect(list.length).toBe(0);

      const item: Item = new Item();

      item.id = undefined;
      item.name = "set1";

      const addedItem = await dataProvider.add(item);

      list = await dataProvider.list();
      expect(list.length).toBe(1);

      expect(addedItem.id).not.toBeNull();

      if (!addedItem.id) {
        throw new Error("Invalid argument.");
      }

      const removedItem = await dataProvider.remove(addedItem.id);

      list = await dataProvider.list();
      expect(list.length).toBe(0);

      expect(removedItem.id).toBe(1);
      expect(removedItem.name).toBe("set1");
    });
  });
});
