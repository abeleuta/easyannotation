import { BaseAnnotator } from "./BaseAnnotator";
export declare class BaseStopableAnnotator extends BaseAnnotator {
    protected stopped: boolean;
    stop(): void;
}
