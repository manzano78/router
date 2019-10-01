import { RouteError } from './RouteError';
import { TFallbackOrGetFallback } from '../../types';
export declare class AccessDeniedError extends RouteError {
    constructor(fallback: TFallbackOrGetFallback, reload: () => void, reloadFully: () => void);
}
