import { BooleanFilterValue } from './boolean-filter'
import { TextFilterValue } from './text-filter'

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

export const booleanFilterSerializer = (fieldName: string, value: BooleanFilterValue) => {
	if (!value.selected || value.value === undefined) return
	return { [fieldName]: value.value ? 'true' : 'false' }
}
