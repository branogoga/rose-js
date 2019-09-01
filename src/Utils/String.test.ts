import * as String from "./String";

describe("String", () => {
    it("hasUpperCaseLetter", () => {
        expect(String.hasUpperCaseLetter("")).toBeFalsy();
        expect(String.hasUpperCaseLetter("A")).toBeTruthy();
        expect(String.hasUpperCaseLetter("a")).toBeFalsy();
        expect(String.hasUpperCaseLetter("1")).toBeFalsy();
        expect(String.hasUpperCaseLetter(":")).toBeFalsy();
        expect(String.hasUpperCaseLetter(" ")).toBeFalsy();
        expect(String.hasUpperCaseLetter("7A")).toBeTruthy();
        expect(String.hasUpperCaseLetter("A7")).toBeTruthy();
        expect(String.hasUpperCaseLetter("aA7")).toBeTruthy();
    });
    it("hasLowerCaseLetter", () => {
        expect(String.hasLowerCaseLetter("")).toBeFalsy();
        expect(String.hasLowerCaseLetter("a")).toBeTruthy();
        expect(String.hasLowerCaseLetter("A")).toBeFalsy();
        expect(String.hasLowerCaseLetter("1")).toBeFalsy();
        expect(String.hasLowerCaseLetter(":")).toBeFalsy();
        expect(String.hasLowerCaseLetter(" ")).toBeFalsy();
        expect(String.hasLowerCaseLetter("7a")).toBeTruthy();
        expect(String.hasLowerCaseLetter("a7")).toBeTruthy();
        expect(String.hasLowerCaseLetter("Aa7")).toBeTruthy();
    });
});
