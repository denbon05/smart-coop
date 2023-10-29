// Extract the values as a type
export type ObjectValues<T extends Record<string, any>> = T[keyof T];

export type EnumValues<T> = T[keyof T];
