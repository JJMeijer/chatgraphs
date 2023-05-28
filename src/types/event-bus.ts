export type EventCallback<T> = (data: T) => void;

export interface Subscribers {
    [key: string]: EventCallback<any>[];
}
