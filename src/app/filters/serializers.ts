import { TextFilterValue } from './text-filter-field'

export function textFilterSerializer(
	fieldName: string,
	value: TextFilterValue
) {
	if (!value.selected || value.value === '') return
	return { [fieldName]: value.value }
}

export function pageFilterSerializer(fieldName: string, value: number) {
	return { [fieldName]: String(value) }
}

export function limitFilterSerializer(fieldName: string, value: number) {
	return { [fieldName]: String(value) }
}
