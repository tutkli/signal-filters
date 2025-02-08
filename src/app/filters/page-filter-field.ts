import { signal } from '@angular/core'
import { FilterField } from './types'

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
	initialValue: PageFilterValue
	defaultValue: PageFilterValue
	active: boolean
}

export type PageFilterField = FilterField<PageFilterValue> & {
	type: 'page'
	nextPage: () => void
}

export function pageFilterField(
	config: Partial<PageFilterFieldConfig> = {}
): PageFilterField {
	const defaultValue = config.defaultValue ?? pageFilterValue()
	const _value = signal(config.initialValue ?? defaultValue)
	const _active = signal(config.active ?? false)

	function set(value: PageFilterValue): void {
		_value.set(value)
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
		defaultValue,
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
