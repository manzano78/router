import { RouteError } from './RouteError';
import { TFallbackOrGetFallback } from '../../types';
export declare class RouteNotFoundError extends RouteError {
    constructor(fallback: TFallbackOrGetFallback, reloadFully: () => void);
}
