import { ArrayFilterValue } from './filter-fields/array-filter'
import { BooleanFilterValue } from './filter-fields/boolean-filter'
import { TextFilterValue } from './filter-fields/text-filter'

export function textFilterSerializer(fieldName: string, value: TextFilterValue) {
	if (!value.selected || value.value === '') return
	return { [fieldName]: value.value }
}

export function pageFilterSerializer(fieldName: string, value: number) {
	return { [fieldName]: String(value) }
}

export function limitFilterSerializer(fieldName: string, value: number) {
	return { [fieldName]: String(value) }
}

export function booleanFilterSerializer(fieldName: string, value: BooleanFilterValue) {
	if (!value.selected || value.value === undefined) return
	return { [fieldName]: value.value ? 'true' : 'false' }
}

export function arrayFilterSerializer(fieldName: string, values: ArrayFilterValue[]) {
	const selectedValues = values
		.filter(({ selected }) => selected)
		.map(({ value }) => value.toString())
	if (!selectedValues.length) {
		return
	}

	return selectedValues.reduce(
		(acc, value, index) => {
			acc[`${fieldName}[${index}]`] = value
			return acc
		},
		{} as Record<string, string>
	)
}

export const arrayFilterCommaSerializer = (fieldName: string, values: ArrayFilterValue[]) => {
	const commaString = values
		.filter(({ selected }) => selected)
		.map(({ value }) => value.toString())
		.join(',')
	return { [fieldName]: commaString }
}
