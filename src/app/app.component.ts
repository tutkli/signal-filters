import { JsonPipe, UpperCasePipe } from '@angular/common'
import { Component } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatDivider } from '@angular/material/divider'
import { MatToolbar } from '@angular/material/toolbar'
import { BooleanFilterFieldComponent } from './components/boolean-filter-field.ng'
import { TextFilterFieldComponent } from './components/text-filter-field.ng'
import { createFilter } from './filters/create-filter'
import { arrayFilterField, arrayFilterValue } from './filters/filter-fields/array-filter'
import { booleanFilterField } from './filters/filter-fields/boolean-filter'
import { textFilterField } from './filters/filter-fields/text-filter'
import { arrayFilterCommaSerializer } from './filters/serializers'
import { FilterFieldName } from './filters/types'

@Component({
	selector: 'app-root',
	imports: [
		JsonPipe,
		MatToolbar,
		TextFilterFieldComponent,
		BooleanFilterFieldComponent,
		MatDivider,
		MatButtonToggle,
		MatButtonToggleGroup,
		UpperCasePipe,
		MatButton,
	],
	template: `
		<mat-toolbar>
			<app-text-filter-field [filterField]="filter.fields.q" placeholder="Buscar..." />

			<mat-divider vertical [style.height.px]="40" />

			<app-boolean-filter-field
				[fieldName]="FilterFieldName.visible"
				[filterField]="filter.fields.visible"
				label="Visible" />

			<mat-divider vertical [style.height.px]="40" />

			<mat-button-toggle-group
				hideMultipleSelectionIndicator
				multiple
				[value]="filter.fields.status.value()"
				(change)="filter.fields.status.toggleValue($event.source.value)">
				@for (value of statusValues; track $index) {
					<mat-button-toggle [value]="value">
						{{ value.value.toString() | uppercase }}
					</mat-button-toggle>
				}
			</mat-button-toggle-group>
		</mat-toolbar>

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
				<pre>{{ filter.serializedPairs() | json }}</pre>
			</div>

			<div>
				<span class="font-medium">Filter value:</span>
				<pre>{{ filter.value() | json }}</pre>
			</div>
		</div>
	`,
	styles: `
		mat-toolbar {
			height: auto;
			padding: 8px 16px;
			display: flex;
			gap: 1rem;
			border-bottom: 1px solid var(--color-gray-500);
		}
	`,
})
export class AppComponent {
	protected readonly FilterFieldName = FilterFieldName

	filter = createFilter({
		q: textFilterField(),
		search: textFilterField(),
		visible: booleanFilterField(),
		status: arrayFilterField({ serializer: arrayFilterCommaSerializer }),
	})

	data = this.filter.data('https://my-filter-api.com')

	statusValues = ['pending', 'progress', 'done'].map(value =>
		arrayFilterValue({ name: value, value })
	)
}
