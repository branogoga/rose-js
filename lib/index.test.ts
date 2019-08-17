import * as Rose from "./index";

describe("foo ", () => {
  it(" not implemnted", () => {
    let storage = new Rose.Data.Storage.InMemoryStorage<number>();
    expect(storage.getItem("7")).toBeNull();
  });
});
