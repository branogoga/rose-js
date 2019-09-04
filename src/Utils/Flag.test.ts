import * as Flag from "./Flag";

describe("Flag ", () => {

    const FlagA: number = 1;
    const FlagB: number = 2;
    const FlagC: number = 3;
    const FlagD: number = 4;

    it("convertBinaryToDecimal", () => {
        expect(Flag.convertBinaryToDecimal("101")).toBe("5");
    });

    it("convertDecimalToBinary", () => {
        expect(Flag.convertDecimalToBinary(5)).toBe("101");
    });

    it("hasFlag", () => {
        expect(Flag.hasFlag(1, 0)).toBeTruthy();
        expect(Flag.hasFlag(3, 0)).toBeTruthy();
        expect(Flag.hasFlag(8, 0)).toBeTruthy();

        expect(Flag.hasFlag(0, 1)).toBeFalsy();
        expect(Flag.hasFlag(1, 1)).toBeTruthy();
        expect(Flag.hasFlag(3, 1)).toBeTruthy();

        expect(Flag.hasFlag(0, 2)).toBeFalsy();
        expect(Flag.hasFlag(1, 2)).toBeFalsy();
        expect(Flag.hasFlag(2, 2)).toBeTruthy();
        expect(Flag.hasFlag(3, 2)).toBeTruthy();
        expect(Flag.hasFlag(6, 2)).toBeTruthy();

        expect(Flag.hasFlag(0, 4)).toBeFalsy();
        expect(Flag.hasFlag(1, 4)).toBeFalsy();
        expect(Flag.hasFlag(2, 4)).toBeFalsy();
        expect(Flag.hasFlag(3, 4)).toBeFalsy();
        expect(Flag.hasFlag(4, 4)).toBeTruthy();
        expect(Flag.hasFlag(5, 4)).toBeTruthy();
        expect(Flag.hasFlag(6, 4)).toBeTruthy();
    });

    it("setFlag", () => {
        expect(Flag.setFlag(0, 0)).toBe(0);
        expect(Flag.setFlag(0, 1)).toBe(1);
        expect(Flag.setFlag(0, 2)).toBe(2);
        expect(Flag.setFlag(0, 3)).toBe(3);
        expect(Flag.setFlag(0, 4)).toBe(4);
        expect(Flag.setFlag(0, 8)).toBe(8);

        expect(Flag.setFlag(1, 0)).toBe(1);
        expect(Flag.setFlag(1, 1)).toBe(1);
        expect(Flag.setFlag(1, 2)).toBe(3);
        expect(Flag.setFlag(1, 3)).toBe(3);
        expect(Flag.setFlag(1, 4)).toBe(5);
        expect(Flag.setFlag(1, 8)).toBe(9);

        expect(Flag.setFlag(2, 0)).toBe(2);
        expect(Flag.setFlag(2, 1)).toBe(3);
        expect(Flag.setFlag(2, 2)).toBe(2);
        expect(Flag.setFlag(2, 3)).toBe(3);
        expect(Flag.setFlag(2, 4)).toBe(6);
        expect(Flag.setFlag(2, 8)).toBe(10);

        expect(Flag.setFlag(4, 0)).toBe(4);
        expect(Flag.setFlag(4, 1)).toBe(5);
        expect(Flag.setFlag(4, 2)).toBe(6);
        expect(Flag.setFlag(4, 3)).toBe(7);
        expect(Flag.setFlag(4, 4)).toBe(4);
        expect(Flag.setFlag(4, 8)).toBe(12);
    });

    it("clearFlag", () => {
        expect(Flag.clearFlag(0, 0)).toBe(0);
        expect(Flag.clearFlag(0, 1)).toBe(0);
        expect(Flag.clearFlag(0, 2)).toBe(0);
        expect(Flag.clearFlag(0, 3)).toBe(0);
        expect(Flag.clearFlag(0, 4)).toBe(0);
        expect(Flag.clearFlag(0, 8)).toBe(0);

        expect(Flag.clearFlag(1, 0)).toBe(1);
        expect(Flag.clearFlag(1, 1)).toBe(0);
        expect(Flag.clearFlag(1, 2)).toBe(1);
        expect(Flag.clearFlag(1, 3)).toBe(0);
        expect(Flag.clearFlag(1, 4)).toBe(1);
        expect(Flag.clearFlag(1, 8)).toBe(1);

        expect(Flag.clearFlag(2, 0)).toBe(2);
        expect(Flag.clearFlag(2, 1)).toBe(2);
        expect(Flag.clearFlag(2, 2)).toBe(0);
        expect(Flag.clearFlag(2, 3)).toBe(0);
        expect(Flag.clearFlag(2, 4)).toBe(2);
        expect(Flag.clearFlag(2, 8)).toBe(2);

        expect(Flag.clearFlag(4, 0)).toBe(4);
        expect(Flag.clearFlag(4, 1)).toBe(4);
        expect(Flag.clearFlag(4, 2)).toBe(4);
        expect(Flag.clearFlag(4, 3)).toBe(4);
        expect(Flag.clearFlag(4, 4)).toBe(0);
        expect(Flag.clearFlag(4, 8)).toBe(4);
    });
});