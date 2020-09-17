import Config from "../Config";
export default interface InternalConfig extends Config {
    annotatorIdx?: number;
    sizePercentage: number;
}
