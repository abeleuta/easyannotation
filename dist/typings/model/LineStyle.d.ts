export declare enum StrokeType {
    SOLID = 0,
    DOTTED = 1,
    DASHED = 2
}
export default interface FillStyle {
    fillType: number;
    color: string;
}
export default interface DrawStyle {
    startArrow: number;
    endArrow: number;
    width: number;
    type: StrokeType;
    color: string;
}
