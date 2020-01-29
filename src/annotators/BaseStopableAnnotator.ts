
import {BaseAnnotator} from "./BaseAnnotator"

export class BaseStopableAnnotator extends BaseAnnotator {
    
    protected stopped: boolean;
    
    public stop() {
        this.stopped = true;
    }
    
}