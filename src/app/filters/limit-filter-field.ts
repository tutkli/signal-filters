import {
	textFilterField,
	TextFilterValue,
	textFilterValue,
} from './text-filter-field'
import { FilterField } from './types'

export type LimitFilterField = FilterField<TextFilterValue> & {
	type: 'limit'
}

export function limitFilterField(): LimitFilterField {
	return {
		...textFilterField({
			initialValue: textFilterValue({ value: '20' }),
			defaultValue: textFilterValue({ value: '20' }),
			active: false,
		}),
		type: 'limit',
	}
}
