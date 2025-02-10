import { computed, signal } from '@angular/core'
import { booleanFilterSerializer } from '../serializers'
import { FilterField, FilterFields } from '../types'

export type BooleanFilterValue = {
	value: boolean | undefined
	selected: boolean
}
export function booleanFilterValue(config: Partial<BooleanFilterValue> = {}): BooleanFilterValue {
	return {
		value: config.value ?? false,
		selected: config.selected ?? true,
	}
}
export type BooleanFilterFieldConfig = {
	initialValue: Partial<BooleanFilterValue>
	defaultValue: Partial<BooleanFilterValue>
	active: boolean
	serializer: (
		fieldName: string,
		value: BooleanFilterValue
	) => { [key: string]: string } | undefined
}

export type BooleanFilterField = FilterField<BooleanFilterValue> & {
	type: 'boolean'
}

export function booleanFilterField(
	config: Partial<BooleanFilterFieldConfig> = {}
): BooleanFilterField {
	const serializer = config.serializer ?? booleanFilterSerializer
	const defaultValue = booleanFilterValue(config.defaultValue)
	const _value = signal<BooleanFilterValue>({
		...defaultValue,
		...config.initialValue,
	})
	const _active = signal(config.active ?? false)

	const isDirty = computed(() => JSON.stringify(_value()) !== JSON.stringify(defaultValue))

	function set(value: Partial<BooleanFilterValue>): void {
		_value.update(v => ({ ...v, ...value }))
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string) {
		return serializer(fieldName, _value())
	}

	return {
		type: 'boolean',
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		isDirty,
		// METHODS
		set,
		reset,
		serialize,
	}
}

export function isBooleanFilterField(field: FilterFields | undefined): field is BooleanFilterField {
	return field?.type === 'boolean'
}
