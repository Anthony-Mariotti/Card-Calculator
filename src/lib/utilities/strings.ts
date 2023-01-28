export function StringIsNumber(value: string): boolean {
    return isNaN(Number(value)) === false;
}
