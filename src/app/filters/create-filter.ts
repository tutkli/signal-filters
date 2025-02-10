import { computed, effect, resource } from '@angular/core'
import { isLimitFilterField, limitFilterField } from './filter-fields/limit-filter'
import { isPageFilterField, pageFilterField } from './filter-fields/page-filter'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
	FilterFieldsWithPagination,
	FilterValueChanges,
	Pairs,
} from './types'

/**
 * Creates a filter management system with pagination support.
 * The filter must be created within an injection context.
 *
 * @example
 * const filter = createFilter({
 *   q: textFilterField(),
 *   visible: booleanFilterField()
 * });
 *
 * // Update filter values
 * filter.set({q: textFilterValue({ value: 'query' })})
 * filter.fields.q.set(textFilterValue({ value: 'query' }))
 * filter.fields.q.update({ value: 'query' }) // Partial change
 *
 * // Get current values
 * filter.value()
 *
 * // Get serialized values
 * filter.serializedPairs()
 *
 * // Reset all filters
 * filter.reset()
 *
 * // Reset specific filters
 * filter.reset([FilterFieldName.q])
 */
export function createFilter<T extends Partial<Record<FilterFieldName, FilterFields>>>(
	initialFields: T
) {
	const fields = initFields()
	const fieldKeys = Object.keys(fields) as (keyof FilterFieldsWithPagination<T>)[]

	const isDirty = computed(() => {
		return fieldKeys
			.filter(key => key !== FilterFieldName.page && key !== FilterFieldName.limit)
			.map(fieldKey => getField(fieldKey))
			.some(field => field.isDirty())
	})

	const value = computed(() => {
		return fieldKeys.reduce(
			(acc, key) => {
				const field = getField(key)
				acc[key] = field.value() as FilterValueChanges<FilterFieldsWithPagination<T>>[typeof key]
				return acc
			},
			{} as FilterValueChanges<FilterFieldsWithPagination<T>>
		)
	})

	const serializedPairs = computed(() => {
		return fieldKeys.reduce<Pairs>((acc, key) => {
			const field = getField(key)
			return { ...acc, ...field.serialize(key as string) }
		}, {})
	})

	// This effect ensures that the page is reseted when any of the field values changes.
	effect(() => {
		const fieldValues = fieldKeys
			.filter(key => key !== FilterFieldName.page && key !== FilterFieldName.limit)
			.map(fieldKey => getField(fieldKey).value())
		const page = getField(FilterFieldName.page)
		page.reset()
	})

	const dataResource = <K>(endpoint: string) =>
		resource<K, Pairs>({
			request: () => serializedPairs(),
			loader: async ({ request: serializedParams, abortSignal }) => {
				const params = new URLSearchParams(serializedParams)
				const response = await fetch(`${endpoint}?${params.toString()}`, { signal: abortSignal })
				return response.json()
			},
		})

	function getField<K extends keyof FilterFieldsWithPagination<T>>(key: K) {
		return fields[key] as FilterField<ExtractFieldValue<FilterFieldsWithPagination<T>[K]>>
	}

	function set<K extends keyof FilterFieldsWithPagination<T>>(
		newFields: Partial<{
			[key in K]: ExtractFieldValue<FilterFieldsWithPagination<T>[K]>
		}>
	) {
		for (const fieldKey in newFields) {
			const field = getField(fieldKey as K)
			field.set(newFields[fieldKey as K] as ExtractFieldValue<FilterFieldsWithPagination<T>[K]>)
		}
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
			page: isPageFilterField(initialFields.page) ? initialFields.page : pageFilterField(),
			limit: isLimitFilterField(initialFields.limit) ? initialFields.limit : limitFilterField(),
		}
	}

	return {
		fields,
		// SIGNALS
		isDirty,
		value,
		serializedPairs,
		// RESOURCE
		data: dataResource,
		// METHODS
		set,
		reset,
	}
}
