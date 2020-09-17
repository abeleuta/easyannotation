export declare class ClassManager {
    private static classList;
    static register<T extends Object>(className: string, cls: T): void;
    static create(className: string, constrArgs: Array<any>): any;
}
