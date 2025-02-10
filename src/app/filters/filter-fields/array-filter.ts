import { computed, signal } from '@angular/core'
import { arrayFilterSerializer } from '../serializers'
import { FilterField } from '../types'

export type ArrayFilterValue = {
	name: string
	selected: boolean
	value: string | number | Date
	icon: string
	children: ArrayFilterValue[]
	opened: boolean
}

export function arrayFilterValue(config: Partial<ArrayFilterValue> = {}): ArrayFilterValue {
	return {
		name: config.name ?? '',
		selected: config.selected ?? true,
		value: config.value ?? '',
		icon: config.icon ?? '',
		children: config.children ?? [],
		opened: config.opened ?? false,
	}
}

export type ArrayFilterFieldConfig = {
	initialValue: ArrayFilterValue[]
	defaultValue: ArrayFilterValue[]
	active: boolean
	serializer: (
		fieldName: string,
		value: ArrayFilterValue[]
	) => { [key: string]: string } | undefined
}

export type ArrayFilterField = FilterField<ArrayFilterValue[]> & {
	type: 'array'
	toggleValue: (value: ArrayFilterValue) => void
	addValue: (value: ArrayFilterValue) => void
	removeValue: (value: ArrayFilterValue) => void
}

export function arrayFilterField(config: Partial<ArrayFilterFieldConfig> = {}): ArrayFilterField {
	const serializer = config.serializer ?? arrayFilterSerializer
	const defaultValue = config.defaultValue ?? []
	const _value = signal<ArrayFilterValue[]>(config.initialValue ?? defaultValue)
	const _active = signal(config.active ?? false)

	const isDirty = computed(() => JSON.stringify(_value()) !== JSON.stringify(defaultValue))

	function set(value: ArrayFilterValue[]): void {
		_value.set(value)
	}

	function toggleValue(value: ArrayFilterValue) {
		if (!_value().find(v => v.value === value.value)) {
			addValue(value)
		} else {
			removeValue(value)
		}
	}

	function addValue(value: ArrayFilterValue) {
		_value.update(v => [...v, value])
	}

	function removeValue(value: ArrayFilterValue) {
		_value.update(v => v.filter(v => v.value !== value.value))
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string) {
		return serializer(fieldName, _value())
	}

	return {
		type: 'array',
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		isDirty,
		// METHODS
		set,
		reset,
		serialize,
		toggleValue,
		addValue,
		removeValue,
	}
}
