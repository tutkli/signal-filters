import { computed, linkedSignal, resource, signal } from '@angular/core'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
	FilterValueChanges,
	Params,
	SignalFilter,
} from './types'

/**
 * Creates a filter management system with pagination support.
 * The filter must be created within an injection context.
 *
 * @template T - Filter fields configuration type
 * @template Data - Data result type
 *
 * @param {T} filterFields - Configuration object for filter fields
 * @param {number} [limit=20] - Number of items per page
 *
 * @returns {SignalFilter<T, Data>} Filter instance with the following features:
 *
 * @property {T} fields - Direct access to filter fields
 * @property {Signal<number>} page - Current page (readonly)
 * @property {Signal<number>} limit - Items per page (readonly)
 * @property {Signal<boolean>} isDirty - Whether any field has been modified
 * @property {Signal<FilterValueChanges<T>>} value - Current filter values
 * @property {Signal<Params>} serializedParams - URL-ready parameters
 * @property {(enpoint: string) => ResourceRef<Data>} data - resourceRef for the given endpoint
 *
 * Methods:
 * - `set(fields)` - Update multiple filter values
 * - `reset([fieldNames])` - Reset all or specific fields
 * - `nextPage()` - Load next page
 * - `data(endpoint)` - Get filtered data from endpoint
 *
 * @example
 * const filter = createFilter({
 *   q: textFilterField(),
 *   visible: booleanFilterField(),
 *   status: arrayFilterField({ serializer: arrayFilterCommaSerializer }),
 * });
 *
 * // Update filter values
 * filter.set({q: textFilterValue({ value: 'query' })})
 * filter.fields.q.set(textFilterValue({ value: 'query' }))
 * filter.fields.q.update({ value: 'query' }) // Partial change
 *
 * // Get endpoint data based on selected fields
 * const data = filter.data('https://api.example.com')
 *
 * // Get filter value
 * filter.value()
 *
 * // Check if filter is dirty
 * filter.isDirty()
 * filter.fields.q.isDirty()
 *
 * // Get current page
 * filter.page()
 *
 * // Set next page
 * filter.nextPage()
 *
 * // Get serialized queryParams
 * filter.serializedParams()
 *
 * // Reset fields
 * filter.reset()
 * filter.reset([FilterFieldName.q])
 */
export function createFilter<
	T extends Partial<Record<FilterFieldName, FilterFields>>,
	Data extends unknown[],
>(filterFields: T, limit: number = 20): SignalFilter<T, Data> {
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

	const serializedParams = computed<Params>(() => {
		return {
			page: String(_page()),
			limit: String(_limit()),
			...fieldKeys.reduce<Params>((acc, key) => {
				const field = getField(key)
				return { ...acc, ...field.serialize(key as string) }
			}, {}),
		}
	})

	let currentData: Data = [] as unknown as Data
	const dataResource = (endpoint: string) =>
		resource<Data, Params>({
			request: () => serializedParams(),
			loader: async ({ request: serializedParams, abortSignal }) => {
				const params = new URLSearchParams(serializedParams)
				const response = await fetch(`${endpoint}?${params.toString()}`, { signal: abortSignal })
				const jsonData = (await response.json()) as Data

				if (_page() === 1) currentData = jsonData
				else currentData = [...currentData, ...jsonData] as Data

				return currentData
			},
			defaultValue: [] as unknown as Data,
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
		serializedParams,
		// RESOURCE
		data: dataResource,
		// METHODS
		set,
		reset,
		nextPage,
	}
}
