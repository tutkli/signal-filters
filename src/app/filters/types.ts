import {Signal} from "@angular/core";
import {TextFilterField} from "./text-filter-field";
import {PageFilterField} from "./page-filter-field";
import {LimitFilterField} from "./limit-filter-field";

export interface Pairs {
  [key: string]: string;
}

export type FilterField<T> = {
    defaultValue: T;
    active: Signal<boolean>;
    value: Signal<T>;
    set: (value: T) => void;
    serialize: (fieldName: string, params: Pairs) => void;
    reset: () => void;
}

export type FilterFields = PageFilterField | LimitFilterField | TextFilterField

export enum FilterFieldName {
    page = 'page',
    limit = 'limit',
    q = 'q',
    search = 'search',
}

export type ExtractFieldValue<T> = T extends FilterField<infer V> ? V : never;
export type FilterValueChanges<
  T extends Partial<Record<FilterFieldName, FilterField<any>>>,
> = {
  [K in keyof T]: ExtractFieldValue<T[K]> | undefined;
};
export type FilterFieldsWithPagination<T> = T & { page: PageFilterField; limit: LimitFilterField };