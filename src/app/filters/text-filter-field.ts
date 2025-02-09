import { computed, signal } from '@angular/core'
import { textFilterSerializer } from './serializers'
import { FilterField, FilterFields } from './types'

export type TextFilterValue = {
	value: string
	selected: boolean
}
export function textFilterValue(
	config: Partial<TextFilterValue> = {}
): TextFilterValue {
	return {
		value: config.value ?? '',
		selected: config.selected ?? true,
	}
}

export type TextFilterFieldConfig = {
	initialValue: Partial<TextFilterValue>
	defaultValue: Partial<TextFilterValue>
	active: boolean
	serializer: (
		fieldName: string,
		value: TextFilterValue
	) => { [key: string]: string } | undefined
}

export type TextFilterField = FilterField<TextFilterValue> & { type: 'text' }

export function textFilterField(
	config: Partial<TextFilterFieldConfig> = {}
): TextFilterField {
	const serializer = config.serializer ?? textFilterSerializer
	const defaultValue = textFilterValue(config.defaultValue)
	const _value = signal<TextFilterValue>({
		...defaultValue,
		...config.initialValue,
	})
	const _active = signal(config.active ?? false)

	const isDirty = computed(
		() => JSON.stringify(_value()) !== JSON.stringify(defaultValue)
	)

	function set(value: Partial<TextFilterValue>): void {
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

export function isTextFilterField(
	field: FilterFields | undefined
): field is TextFilterField {
	return field?.type === 'text'
}
