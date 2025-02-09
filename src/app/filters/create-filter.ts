import { computed } from '@angular/core'
import { isLimitFilterField, limitFilterField } from './limit-filter-field'
import { isPageFilterField, pageFilterField } from './page-filter-field'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
	FilterFieldsWithPagination,
	FilterValueChanges,
	Pairs,
} from './types'

export function createFilter<
	T extends Partial<Record<FilterFieldName, FilterFields>>,
>(initialFields: T) {
	const fields = initFields()

	const fieldKeys = Object.keys(
		fields
	) as (keyof FilterFieldsWithPagination<T>)[]

	const isDirty = computed(() => {
		return fieldKeys
			.filter(
				key => key !== FilterFieldName.page && key !== FilterFieldName.limit
			)
			.map(fieldKey => getField(fieldKey))
			.some(field => field.isDirty())
	})

	const value = computed(() => {
		return fieldKeys.reduce(
			(acc, key) => {
				const field = getField(key)
				acc[key] = field.value() as FilterValueChanges<
					FilterFieldsWithPagination<T>
				>[typeof key]
				return acc
			},
			{} as FilterValueChanges<FilterFieldsWithPagination<T>>
		)
	})

	const serializedParams = computed(() => {
		return fieldKeys.reduce<Pairs>((acc, key) => {
			const field = getField(key)
			const serializedValue = field.serialize(key as string)
			if (serializedValue) return { ...acc, ...serializedValue }
			return acc
		}, {})
	})

	function getField<K extends keyof FilterFieldsWithPagination<T>>(key: K) {
		return fields[key] as FilterField<
			ExtractFieldValue<FilterFieldsWithPagination<T>[K]>
		>
	}

	function set<K extends keyof FilterFieldsWithPagination<T>>(
		newFields: Partial<{
			[key in K]: ExtractFieldValue<FilterFieldsWithPagination<T>[K]>
		}>,
		resetPage = true
	) {
		for (const fieldKey in newFields) {
			const field = getField(fieldKey as K)
			field.set(
				newFields[fieldKey as K] as ExtractFieldValue<
					FilterFieldsWithPagination<T>[K]
				>
			)
		}
		if (resetPage) getField('page').reset()
	}

	function reset(fieldsToReset?: (keyof FilterFieldsWithPagination<T>)[]) {
		const fieldsToProcess = fieldsToReset ?? fieldKeys
		for (const field of fieldsToProcess) {
			getField(field).reset()
		}
	}

	function initFields() {
		return {
			...initialFields,
			page: isPageFilterField(initialFields.page)
				? initialFields.page
				: pageFilterField(),
			limit: isLimitFilterField(initialFields.limit)
				? initialFields.limit
				: limitFilterField(),
		}
	}

	return {
		fields,
		// SIGNALS
		isDirty,
		value,
		serializedValue: serializedParams,
		// METHODS
		set,
		reset,
	}
}
