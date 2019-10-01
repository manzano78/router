import { RouteError } from './RouteError';
import { TFallbackOrGetFallback } from '../../types';
export declare class DataResolvingError extends RouteError {
    constructor(fallback: TFallbackOrGetFallback, reload: () => void, reloadFully: () => void);
}
