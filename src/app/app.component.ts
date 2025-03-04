import { JsonPipe, UpperCasePipe } from '@angular/common'
import { Component } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatDivider } from '@angular/material/divider'
import { BooleanFilterFieldComponent } from './components/boolean-filter-field.ng'
import { TextFilterFieldComponent } from './components/text-filter-field.ng'
import { createFilter } from './filters/create-filter'
import { arrayFilterField, arrayFilterValue } from './filters/filter-fields/array-filter'
import { booleanFilterField } from './filters/filter-fields/boolean-filter'
import { textFilterField } from './filters/filter-fields/text-filter'
import { FilterFieldName } from './filters/types'

@Component({
	selector: 'app-root',
	imports: [
		JsonPipe,
		TextFilterFieldComponent,
		BooleanFilterFieldComponent,
		MatDivider,
		MatButtonToggle,
		MatButtonToggleGroup,
		UpperCasePipe,
		MatButton,
	],
	template: `
		<div class="px-4 py-2 flex items-center gap-4 border-b border-gray-500">
			<app-text-filter-field [filterField]="filter.fields.firstName" placeholder="Buscar..." />

			<mat-divider vertical [style.height.px]="40" />

			<app-boolean-filter-field
				[fieldName]="FilterFieldName.isActive"
				[filterField]="filter.fields.isActive"
				label="Is active?" />

			<mat-divider vertical [style.height.px]="40" />

			<mat-button-toggle-group
				hideMultipleSelectionIndicator
				multiple
				[value]="filter.fields.favoriteColors.value()"
				(change)="filter.fields.favoriteColors.toggleValue($event.source.value)">
				@for (value of availableColors; track $index) {
					<mat-button-toggle [value]="value">
						{{ value.value.toString() | uppercase }}
					</mat-button-toggle>
				}
			</mat-button-toggle-group>
		</div>

		<div class="container m-auto py-8 flex space-y-4 flex-col">
			<div class="flex space-x-2">
				<button mat-flat-button (click)="filter.nextPage()">Next Page</button>
				<button mat-flat-button (click)="filter.reset()">Reset All</button>
			</div>

			<div>
				<span class="font-medium">Filter is dirty:</span>
				{{ filter.isDirty() }}
			</div>

			<div>
				<span class="font-medium">Serialized params:</span>
				<pre>{{ filter.serializedParams() | json }}</pre>
			</div>

			<div>
				<span class="font-medium">Filter value:</span>
				<pre>{{ filter.value() | json }}</pre>
			</div>
		</div>
	`,
})
export class AppComponent {
	protected readonly FilterFieldName = FilterFieldName

	filter = createFilter({
		firstName: textFilterField(),
		isActive: booleanFilterField(),
		favoriteColors: arrayFilterField(),
	})

	data = this.filter.data('http://localhost:3000/users')

	availableColors = ['red', 'blue', 'green'].map(value => arrayFilterValue({ name: value, value }))
}
