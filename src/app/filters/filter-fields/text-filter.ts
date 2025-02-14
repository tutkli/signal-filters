import { computed, signal } from '@angular/core'
import { textFilterSerializer } from '../serializers'
import { FilterField } from '../types'

export type TextFilterValue = {
	value: string
	selected: boolean
}
export function textFilterValue(config: Partial<TextFilterValue> = {}): TextFilterValue {
	return {
		value: config.value ?? '',
		selected: config.selected ?? true,
	}
}

export type TextFilterFieldConfig = {
	initialValue: Partial<TextFilterValue>
	defaultValue: Partial<TextFilterValue>
	active: boolean
	serializer: (fieldName: string, value: TextFilterValue) => { [key: string]: string } | undefined
}

export type TextFilterField = FilterField<TextFilterValue> & {
	type: 'text'
	update: (value: Partial<TextFilterValue>) => void
}

export function textFilterField(config: Partial<TextFilterFieldConfig> = {}): TextFilterField {
	const serializer = config.serializer ?? textFilterSerializer
	const defaultValue = textFilterValue(config.defaultValue)
	const _value = signal<TextFilterValue>({
		...defaultValue,
		...config.initialValue,
	})
	const _active = signal(config.active ?? false)

	const isDirty = computed(() => JSON.stringify(_value()) !== JSON.stringify(defaultValue))

	function set(value: TextFilterValue): void {
		_value.set(value)
	}

	function update(value: Partial<TextFilterValue>): void {
		_value.update(v => ({ ...v, ...value }))
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string) {
		return serializer(fieldName, _value())
	}

	return {
		type: 'text',
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		isDirty,
		// METHODS
		set,
		update,
		reset,
		serialize,
	}
}
