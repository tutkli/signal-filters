import { ResourceRef, Signal } from '@angular/core'
import { ArrayFilterField } from './filter-fields/array-filter'
import { BooleanFilterField } from './filter-fields/boolean-filter'
import { TextFilterField } from './filter-fields/text-filter'

export type Params = { [key: string]: string }
export type SignalFilter<T extends Partial<Record<FilterFieldName, FilterFields>>, Data> = {
	fields: T
	page: Signal<number>
	limit: Signal<number>
	isDirty: Signal<boolean>
	value: Signal<FilterValueChanges<T>>
	serializedParams: Signal<Params>
	data: (endpoint: string) => ResourceRef<Data>
	set: <K extends keyof T>(newFields: Partial<{ [key in K]: ExtractFieldValue<T[K]> }>) => void
	reset: () => void
	nextPage: () => void
}
export type FilterField<T> = {
	active: Signal<boolean>
	isDirty: Signal<boolean>
	value: Signal<T>
	set: (value: T) => void
	serialize: (fieldName: string) => { [key: string]: string } | undefined
	reset: () => void
}
export type ExtractFieldValue<T> = T extends FilterField<infer V> ? V : never
export type FilterValueChanges<T extends Partial<Record<FilterFieldName, FilterFields>>> = {
	[K in keyof T]: ExtractFieldValue<T[K]> | undefined
}
export type FilterFields = TextFilterField | BooleanFilterField | ArrayFilterField
export enum FilterFieldName {
	q = 'q',
	search = 'search',
	visible = 'visible',
	status = 'status',
	firstName = 'firstName',
	isActive = 'isActive',
	favoriteColors = 'favoriteColors',
}
