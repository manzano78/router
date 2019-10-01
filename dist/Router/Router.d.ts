/// <reference types="react" />
import { IBreadcrumbProps, IModalRouterContainerProps, IRoute, IRouteProps, IRouterProps, TBreadcrumb, TIsLoadingNextRoute, IModalOptions } from './types';
export declare function Router(props: IRouterProps): JSX.Element;
export declare function ModalContainer({ children }: IModalRouterContainerProps): JSX.Element | null;
export declare function Route(props: IRouteProps): any;
export declare function Breadcrumb({ children }: IBreadcrumbProps): JSX.Element;
export declare function useModalOptions(): IModalOptions;
export declare function useRoute(): [IRoute, boolean];
export declare function useBreadcrumb(): [TBreadcrumb, TIsLoadingNextRoute];
export declare function useLocation(): import("history").Location<any>;
export declare function useHistory(): import("history").History<any>;
export declare function useIsInModal(): boolean;
export declare function useIsModalOpen(): boolean;
export declare function useOpenModal(): (initialLocation: import("history").History.LocationDescriptor<any>, modalOptions: IModalOptions, onModalClose?: import("./types").TCloseModal | undefined) => void;
export declare function useCloseModal(): (...args: any[]) => void;
