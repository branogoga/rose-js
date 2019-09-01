export function hasUpperCaseLetter(value: string): boolean {
    return value !== value.toLowerCase();
}

export function hasLowerCaseLetter(value: string): boolean {
    return value !== value.toUpperCase();
}