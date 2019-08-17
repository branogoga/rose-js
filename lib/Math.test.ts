import { add } from "./Math";

describe("add ", () => {
  it(" 1 + 2 = 3", () => {
    expect(add(1, 2)).toBe(3);
  });
});
