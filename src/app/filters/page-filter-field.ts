import { computed, signal } from '@angular/core'
import { FilterField, FilterFields } from './types'

export type PageFilterValue = {
	value: number
	selected: boolean
}
export function pageFilterValue(
	config: Partial<PageFilterValue> = {}
): PageFilterValue {
	return {
		value: config.value ?? 1,
		selected: config.selected ?? true,
	}
}

export type PageFilterFieldConfig = {
	initialValue: Partial<PageFilterValue>
	defaultValue: Partial<PageFilterValue>
	active: boolean
}

export type PageFilterField = FilterField<PageFilterValue> & {
	type: 'page'
	nextPage: () => void
}

export function pageFilterField(
	config: Partial<PageFilterFieldConfig> = {}
): PageFilterField {
	const defaultValue = pageFilterValue(config.defaultValue)
	const _value = signal<PageFilterValue>({
		...defaultValue,
		...config.initialValue,
	})
	const _active = signal(config.active ?? false)

	const isDirty = computed(
		() => JSON.stringify(_value()) !== JSON.stringify(defaultValue)
	)

	function set(value: Partial<PageFilterValue>): void {
		_value.update(v => ({ ...v, ...value }))
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string): void {
		// implementation here
	}

	function nextPage() {
		_value.update(v => {
			return {
				...v,
				value: v.value + 1,
			}
		})
	}

	return {
		type: 'page',
		isDirty,
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		// METHODS
		set,
		reset,
		serialize,
		nextPage,
	}
}

export function isPageFilterField(
	field: FilterFields | undefined
): field is PageFilterField {
	return field?.type === 'page'
}
