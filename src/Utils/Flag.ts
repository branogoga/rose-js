/* tslint:disable no-bitwise*/

export function convertBinaryToDecimal(binary: string): string {
    return parseInt(binary, 2).toString(10);
}

export function convertDecimalToBinary(decimal: number): string {
    return (decimal >>> 0).toString(2);
}

export function hasFlag(value: number, flag: number): boolean {
    return (value & flag) === flag;
}

export function setFlag(value: number, flag: number): number {
    return value | flag;
}

export function clearFlag(value: number, flag: number): number {
    return value & ~flag;
}
/* tslint:enable */
