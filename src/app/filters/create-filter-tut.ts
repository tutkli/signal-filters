import { computed } from '@angular/core'
import { LimitFilterField } from './limit-filter-field'
import { PageFilterField } from './page-filter-field'
import {
	ExtractFieldValue,
	FilterField,
	FilterFieldName,
	FilterFields,
	FilterFieldsWithPagination,
	FilterValueChanges,
} from './types'

export class Filter<T extends Partial<Record<FilterFieldName, FilterFields>>> {
	fields: FilterFieldsWithPagination<T>
	fieldKeys: (keyof FilterFieldsWithPagination<T>)[]

	isDirty = computed(() => {
		return this.fieldKeys
			.filter(
				key => key !== FilterFieldName.page && key !== FilterFieldName.limit
			)
			.some(fieldKey => {
				const field = this.getField(fieldKey)
				return (
					JSON.stringify(field.value()) !== JSON.stringify(field.defaultValue)
				)
			})
	})

	value = computed(() => {
		return this.fieldKeys.reduce(
			(acc, key) => {
				const field = this.getField(key)
				acc[key] = field.value() as FilterValueChanges<
					FilterFieldsWithPagination<T>
				>[typeof key]
				return acc
			},
			{} as FilterValueChanges<FilterFieldsWithPagination<T>>
		)
	})

	// serializedValue = computed(() => {})

	constructor(fields: T) {
		const pageField =
			fields.page instanceof PageFilterField
				? fields.page
				: new PageFilterField()
		const limitField =
			fields.limit instanceof LimitFilterField
				? fields.limit
				: new LimitFilterField()

		this.fields = { ...fields, page: pageField, limit: limitField }
		this.fieldKeys = Object.keys(
			this.fields
		) as (keyof FilterFieldsWithPagination<T>)[]
	}

	set<K extends keyof FilterFieldsWithPagination<T>>(
		fields: Partial<{
			[key in K]: ExtractFieldValue<FilterFieldsWithPagination<T>[K]>
		}>,
		resetPage = true
	) {
		for (const fieldKey in fields) {
			const field = this.getField(fieldKey as K)
			field.set(
				fields[fieldKey as K] as ExtractFieldValue<
					FilterFieldsWithPagination<T>[K]
				>
			)
		}
		if (resetPage) this.fields.page.reset()
	}

	reset(fields?: (keyof FilterFieldsWithPagination<T>)[]) {
		const fieldsToReset = fields ?? this.fieldKeys
		for (const field of fieldsToReset) {
			this.getField(field).reset()
		}
	}

	private getField<K extends keyof FilterFieldsWithPagination<T>>(key: K) {
		return this.fields[key] as FilterField<
			ExtractFieldValue<FilterFieldsWithPagination<T>[K]>
		>
	}
}
