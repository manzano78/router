import { IDisplayableRoute, TFallback, TFallbackOrGetFallback } from '../../types';
export declare abstract class RouteError extends Error {
    readonly reload: () => void;
    readonly reloadFully: () => void;
    readonly fallback: TFallback;
    protected constructor(message: string, fallback: TFallbackOrGetFallback, reload: () => void, reloadFully: () => void);
    toDisplayableRoute(): IDisplayableRoute;
}
