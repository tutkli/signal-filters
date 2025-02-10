import { FilterField } from '../types'

export type SelectFilterValue = {
	name: string
	selected: boolean
	value: string | number | Date
	icon: string
	children: SelectFilterValue[]
	opened: boolean
}
export function selectFilterValue(config: Partial<SelectFilterValue> = {}): SelectFilterValue {
	return {
		name: config.name ?? '',
		selected: config.selected ?? true,
		value: config.value ?? '',
		icon: config.icon ?? '',
		children: config.children ?? [],
		opened: config.opened ?? false,
	}
}

export type SelectFilterFieldConfig = {
	initialValue: SelectFilterValue
	defaultValue: SelectFilterValue
	active: boolean
	serializer: (fieldName: string, value: SelectFilterValue) => { [key: string]: string } | undefined
}

export type SelectFilterField = FilterField<SelectFilterValue> & { type: 'select' }
