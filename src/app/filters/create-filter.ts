import { computed, linkedSignal, resource, signal } from '@angular/core'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
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
 * // Get current page
 * filter.page()
 *
 * // Set next page
 * filter.nextPage()
 *
 * // Get serialized values
 * filter.serializedPairs()
 *
 * // Reset all fields
 * filter.reset()
 *
 * // Reset specific fields
 * filter.reset([FilterFieldName.q])
 */
export function createFilter<T extends Partial<Record<FilterFieldName, FilterFields>>>(
	filterFields: T,
	limit: number = 20
) {
	const fields = { ...filterFields }
	const fieldKeys = Object.keys(fields) as (keyof T)[]

	const isDirty = computed(() => {
		return fieldKeys.map(fieldKey => getField(fieldKey)).some(field => field.isDirty())
	})

	const value = computed(() => {
		return fieldKeys.reduce((acc, key) => {
			const field = getField(key)
			acc[key] = field.value() as FilterValueChanges<T>[typeof key]
			return acc
		}, {} as FilterValueChanges<T>)
	})

	const _page = linkedSignal<FilterValueChanges<T>, number>({
		source: value,
		computation: () => 1,
	})
	const _limit = signal(limit)

	const serializedPairs = computed(() => {
		const pairs = fieldKeys.reduce<Pairs>((acc, key) => {
			const field = getField(key)
			return { ...acc, ...field.serialize(key as string) }
		}, {})
		pairs['page'] = String(_page())
		pairs['limit'] = String(_limit())
		return pairs
	})

	// TODO: when the page is not 1, the results should concat the previous value.
	const dataResource = <K>(endpoint: string) =>
		resource<K, Pairs>({
			request: () => serializedPairs(),
			loader: async ({ request: serializedParams, abortSignal }) => {
				const params = new URLSearchParams(serializedParams)
				const response = await fetch(`${endpoint}?${params.toString()}`, { signal: abortSignal })
				return response.json()
			},
		})

	function getField<K extends keyof T>(key: K) {
		return fields[key] as FilterField<ExtractFieldValue<T[K]>>
	}

	function set<K extends keyof T>(
		newFields: Partial<{
			[key in K]: ExtractFieldValue<T[K]>
		}>
	) {
		for (const fieldKey in newFields) {
			const field = getField(fieldKey as K)
			field.set(newFields[fieldKey as K] as ExtractFieldValue<T[K]>)
		}
	}

	function reset(fieldsToReset?: (keyof T)[]) {
		const fieldsToProcess = fieldsToReset ?? fieldKeys
		for (const field of fieldsToProcess) {
			getField(field).reset()
		}
		_page.set(1)
	}

	function nextPage() {
		_page.update(v => v + 1)
	}

	return {
		fields,
		// SIGNALS
		page: _page.asReadonly(),
		limit: _limit.asReadonly(),
		isDirty,
		value,
		serializedPairs,
		// RESOURCE
		data: dataResource,
		// METHODS
		set,
		reset,
		nextPage,
	}
}
