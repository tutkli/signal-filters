import { computed, signal } from '@angular/core'
import { FilterField, FilterFields } from './types'

export type PageFilterFieldConfig = {
	initialValue: number
	defaultValue: number
	active: boolean
}

export type PageFilterField = FilterField<number> & {
	type: 'page'
	nextPage: () => void
}

export function pageFilterField(
	config: Partial<PageFilterFieldConfig> = {}
): PageFilterField {
	const defaultValue = config.defaultValue ?? 1
	const _value = signal(config.initialValue ?? defaultValue)
	const _active = signal(config.active ?? false)

	const isDirty = computed(
		() => JSON.stringify(_value()) !== JSON.stringify(defaultValue)
	)

	function set(value: number): void {
		_value.set(value)
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string): void {
		// implementation here
	}

	function nextPage() {
		_value.update(v => v + 1)
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
