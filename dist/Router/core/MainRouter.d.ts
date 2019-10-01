import { Router } from './Router';
import { ModalRouter } from './ModalRouter';
import { History, LocationDescriptor } from 'history';
import { IModalOptions, IRouterOptions, TOnModalClose } from '../types';
export declare class MainRouter extends Router {
    private options;
    private defaultModalOptions;
    private readonly modalRouter$;
    constructor(history: History, options: IRouterOptions, defaultModalOptions: IModalOptions);
    getOptions(): IRouterOptions;
    setOptions(options: IRouterOptions): void;
    setDefaultModalOptions(defaultModalOptions: IModalOptions): void;
    getModalRouter(): ModalRouter | null;
    listenToModalRouter(listener: (modalRouter: ModalRouter | null) => void): () => void;
    readonly isModalOpen: boolean;
    openModal(initialLocation: LocationDescriptor, modalOptions?: IModalOptions, onModalClose?: TOnModalClose): void;
}
