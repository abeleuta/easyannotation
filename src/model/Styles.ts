
export enum StrokeType {
    SOLID = 0,
    DOTTED = 1,
    DASHED = 2
}

export enum ArrowType {
    NONE = 0,
    ARROW = 1,
    OPEN_ARROW = 2,
    RECT = 3,
    DIAMOND_ARROW = 4,
    OVAL_ARROW = 5,
    LINE_ARROW = 6
}

export enum EffectType {
    BLUR = 1,
    SHADOW = 2
}

export default interface Effect {
    effectType: EffectType;
    value: string;
    index: number;
}

export default interface FillStyle {

    fillType?: number;
    
    color?: string;
    
    opacity?: number;
    
    effects?: Array<Effect>;
}

export default interface DrawStyle {
    
    startArrow?: number;
    
    endArrow?: number;
    
    width?: number;
    
    type?: StrokeType;
    
    color?: string;
}

/**
 * Blurring style for blurring annotators.
 */
export default interface BlurStyle {
    radius?: number;
}