import { IDisplayableRouteState, IRouterOptions, TStopRouter } from '../types';
import { History } from 'history';
export declare abstract class Router {
    private cancelRouteLoading;
    private readonly routeState$;
    stop: TStopRouter;
    readonly history: History;
    protected constructor(history: History);
    private toRouteLoader;
    private loadRoute;
    private searchMatch;
    private finalizeRoute;
    private handleRouteAsyncDataSuccess;
    private handleRouteAsyncDataError;
    private handleRouteLoadingError;
    private setRouteState;
    private nextCancellation;
    private static getRouteAsyncData;
    private static toMetaData;
    private static toBreadcrumb;
    private static fillBreadcrumb;
    private static assertMatchExistence;
    private static assertHasAccess;
    abstract getOptions(): IRouterOptions;
    getRouteState(): IDisplayableRouteState;
    listenToRouteState(listener: (routeState: IDisplayableRouteState) => void): () => void;
    readonly isStarted: boolean;
    start(): TStopRouter;
}
