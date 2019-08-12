import { add } from "./index";

describe("add ", function () {
    it(" 1 + 2 = 3", function () {
        expect(add(1,2)).toBe(3);
    }); 
});
