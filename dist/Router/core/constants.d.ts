import { ICancellation, IDefaultDisplay, IDisplayableRouteState, IErrorProps } from '../types';
export declare const INITIAL_ROUTE_STATE: IDisplayableRouteState;
export declare const DEFAULT_ON_ROUTE_NOT_FOUND: IDefaultDisplay;
export declare const DEFAULT_ON_ACCESS_DENIED: IDefaultDisplay;
export declare const DEFAULT_ON_ASYNC_ERROR: IDefaultDisplay<IErrorProps>;
export declare const DEFAULT_CANCELLATION_SYSTEM: () => ICancellation;
