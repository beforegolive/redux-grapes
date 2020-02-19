export declare const createActions: <T extends {
    [key: string]: Function;
}>(obj: any, prefix?: string) => { [K in Extract<keyof T, string>]: any; };
