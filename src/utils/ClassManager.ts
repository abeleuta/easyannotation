/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class ClassManager {
    
    private static classList: any = new Object();
    
    public static register<T extends Object>(className: string, cls: T) {
        this.classList[className] = cls;
    }
    
//    public static create<T extends BaseAnnotator>
//        (Ctor: { new (...args: any[]): T; }, constrArgs: any) {
//        return new Ctor(constrArgs);
//    }
//    
    public static create(className: string, constrArgs: Array<any>) {
        let Ctor = this.classList[className];
        if (Ctor) {
            if (constrArgs.length == 1) {
                return new Ctor(constrArgs[0]);
            } else {
                return new Ctor(constrArgs[0], constrArgs[1]);
            }
        }
        
        return null;
    }
    
}
