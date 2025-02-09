import { computed, signal } from '@angular/core'
import { limitFilterSerializer } from './serializers'
import { FilterField, FilterFields } from './types'

export type LimitFilterField = FilterField<number> & {
	type: 'limit'
}

export type LimitFilterFieldConfig = {
	initialValue: number
	defaultValue: number
	active: boolean
	serializer: (fieldName: string, value: number) => { [key: string]: string } | undefined
}

export function limitFilterField(config: Partial<LimitFilterFieldConfig> = {}): LimitFilterField {
	const serializer = config.serializer ?? limitFilterSerializer
	const defaultValue = config.defaultValue ?? 20
	const _value = signal(config.initialValue ?? defaultValue)
	const _active = signal(config.active ?? false)

	const isDirty = computed(() => JSON.stringify(_value()) !== JSON.stringify(defaultValue))

	function set(value: number): void {
		_value.set(value)
	}

	function reset() {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string = 'limit') {
		return serializer(fieldName, _value())
	}

	return {
		type: 'limit',
		isDirty,
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		// METHODS
		set,
		reset,
		serialize,
	}
}

export function isLimitFilterField(field: FilterFields | undefined): field is LimitFilterField {
	return field?.type === 'limit'
}
