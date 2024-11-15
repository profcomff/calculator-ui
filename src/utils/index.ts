export const lz = (number: number, digits = 2) => `${'0'.repeat(digits)}${number}`.slice(-digits);
