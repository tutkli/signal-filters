import { Signal } from '@angular/core'
import { BooleanFilterField } from './filter-fields/boolean-filter'
import { LimitFilterField } from './filter-fields/limit-filter'
import { PageFilterField } from './filter-fields/page-filter'
import { TextFilterField } from './filter-fields/text-filter'

export interface Pairs {
	[key: string]: string
}

export type FilterField<T> = {
	active: Signal<boolean>
	isDirty: Signal<boolean>
	value: Signal<T>
	set: (value: Partial<T>) => void
	serialize: (fieldName: string) => { [key: string]: string } | undefined
	reset: () => void
}

export type FilterFields = PageFilterField | LimitFilterField | TextFilterField | BooleanFilterField

export enum FilterFieldName {
	page = 'page',
	limit = 'limit',
	q = 'q',
	search = 'search',
	visible = 'visible',
}

export type ExtractFieldValue<T> = T extends FilterField<infer V> ? V : never
export type FilterValueChanges<T extends Partial<Record<FilterFieldName, FilterField<any>>>> = {
	[K in keyof T]: ExtractFieldValue<T[K]> | undefined
}
export type FilterFieldsWithPagination<T> = T & {
	page: PageFilterField
	limit: LimitFilterField
}
