import { computed } from '@angular/core'
import { LimitFilterField } from './limit-filter-field'
import { PageFilterField } from './page-filter-field'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
	FilterFieldsWithPagination,
	FilterValueChanges,
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
			.some(fieldKey => {
				const field = getField(fieldKey)
				return (
					JSON.stringify(field.value()) !== JSON.stringify(field.defaultValue)
				)
			})
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
			page:
				initialFields.page instanceof PageFilterField
					? initialFields.page
					: new PageFilterField(),
			limit:
				initialFields.limit instanceof LimitFilterField
					? initialFields.limit
					: new LimitFilterField(),
		}
	}

	return {
		fields,
		// SIGNALS
		isDirty,
		value,
		// METHODS
		set,
		reset,
	}
}
