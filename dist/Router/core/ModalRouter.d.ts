import { Router } from './Router';
import { IModalOptions, TOnModalClose } from '../types';
import { LocationDescriptor } from 'history';
import { MainRouter } from './MainRouter';
export declare class ModalRouter extends Router {
    private readonly onModalClose;
    readonly mainRouter: MainRouter;
    readonly modalOptions: IModalOptions;
    constructor(mainRouter: MainRouter, initialLocation: LocationDescriptor, modalOptions: IModalOptions, onModalClose?: TOnModalClose);
    closeModal(...args: any[]): void;
    getOptions(): import("../types").IRouterOptions;
    private static createHistory;
}
