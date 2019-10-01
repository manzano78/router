import { IDefaultRedirection, IRouteConfig, IRouteConfigMatcher, TFallback } from '../types';
import { Observable } from 'rxjs';
export declare function useObservedValue<T>(getValue: () => T, listen: (listener: (value?: T) => void) => () => void): T;
export declare function isDefaultRedirectionFallback<P>(fallback: TFallback<P>): fallback is IDefaultRedirection;
export declare function toRouteConfigMatchers(routeConfigs: IRouteConfig[], basename?: string): IRouteConfigMatcher[];
export declare function listenToObservable<T>(observable: Observable<T>, listener: (value: T) => void): () => void;
export declare function hasAnyPromiseToResolve(items: any[]): boolean;
