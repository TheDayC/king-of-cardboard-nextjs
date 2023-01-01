export function isOdd(num: number): boolean {
    const oddChecker = num % 2;

    return oddChecker === 1 ? true : false;
}

export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
