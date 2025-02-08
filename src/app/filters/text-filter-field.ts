import { signal } from '@angular/core'
import { FilterField } from './types'

// export class TextFilterValue {
//   value: string;
//   selected: boolean;
//
//   constructor({ value = '', selected = true }: Partial<TextFilterValue> = {}) {
//     this.value = value;
//     this.selected = selected;
//   }
// }
//
// export interface TextFilterFieldConfig {
//   initialValue: TextFilterValue;
//   defaultValue: TextFilterValue;
//   active: boolean;
// }
//
// export class TextFilterField implements FilterField<TextFilterValue> {
//     defaultValue = new TextFilterValue();
//
//     private readonly _active = signal(false);
//     active = this._active.asReadonly();
//
//     private readonly _value = signal(this.defaultValue);
//     value = this._value.asReadonly();
//
//     constructor({
//     initialValue = new TextFilterValue(),
//     defaultValue = new TextFilterValue(),
//     active = false,
//   }: Partial<TextFilterFieldConfig> = {}) {
//     this._value.set(initialValue);
//     this.defaultValue = defaultValue;
//     this._active.set(active);
//   }
//
//     set(value: TextFilterValue): void {
//         this._value.set(value);
//     }
//
//     reset(): void {
//         this._value.set(this.defaultValue);
//     }
//
//     serialize(fieldName: string): void {
//     }
// }

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
	initialValue: TextFilterValue
	defaultValue: TextFilterValue
	active: boolean
}

export type TextFilterField = FilterField<TextFilterValue> & { type: 'text' }

export function textFilterField(
	config: Partial<TextFilterFieldConfig> = {}
): TextFilterField {
	const defaultValue = config.defaultValue ?? textFilterValue()
	const _value = signal(config.initialValue ?? defaultValue)
	const _active = signal(config.active ?? false)

	function set(value: TextFilterValue): void {
		_value.set(value)
	}

	function reset(): void {
		_value.set(defaultValue)
	}

	function serialize(fieldName: string): void {
		// Implementation here
	}

	return {
		type: 'text',
		defaultValue,
		// SIGNALS
		value: _value.asReadonly(),
		active: _active.asReadonly(),
		// METHODS
		set,
		reset,
		serialize,
	}
}
