import {
	textFilterField,
	TextFilterValue,
	textFilterValue,
} from './text-filter-field'
import { FilterField, FilterFields } from './types'

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

export function isLimitFilterField(
	field: FilterFields | undefined
): field is LimitFilterField {
	return field?.type === 'limit'
}
