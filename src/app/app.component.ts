import { JsonPipe } from '@angular/common'
import { Component } from '@angular/core'
import { MatDivider } from '@angular/material/divider'
import { MatToolbar } from '@angular/material/toolbar'
import { BooleanFilterFieldComponent } from './components/boolean-filter-field.ng'
import { TextFilterFieldComponent } from './components/text-filter-field.ng'
import { booleanFilterField } from './filters/boolean-filter'
import { createFilter } from './filters/create-filter'
import { textFilterField } from './filters/text-filter'
import { FilterFieldName } from './filters/types'

@Component({
	selector: 'app-root',
	imports: [
		JsonPipe,
		MatToolbar,
		TextFilterFieldComponent,
		BooleanFilterFieldComponent,
		MatDivider,
	],
	template: `
		<mat-toolbar>
			<app-text-filter-field
				placeholder="Buscar..."
				[fieldValue]="filter.fields.q.value()"
				(valueChange)="filter.set({ q: $event })"
				(reseted)="filter.reset(['q'])" />

			<mat-divider vertical [style.height.px]="40" />

			<app-boolean-filter-field
				[fieldName]="FilterFieldName.visible"
				[fieldValue]="filter.fields.visible.value()"
				(valueChange)="filter.set({ visible: $event })"
				(reseted)="filter.reset(['visible'])"
				label="Visible" />
		</mat-toolbar>

		<div>
			<button (click)="nextPage()" class="bg-primary text-on-primary">Next page</button>

			<div>
				<button (click)="filter.reset()">Reset All</button>
			</div>
			<div>Filter is dirty: {{ filter.isDirty() }}</div>
			<pre>
Serialized params:
				{{ filter.serializedPairs() | json }}</pre
			>
			<pre>
Value:
				{{ filter.value() | json }}</pre
			>
		</div>
	`,
	styles: `
		mat-toolbar {
			height: auto;
			padding: 8px 16px;
			display: flex;
			gap: 1rem;
		}
	`,
})
export class AppComponent {
	filter = createFilter({
		q: textFilterField(),
		search: textFilterField(),
		visible: booleanFilterField(),
	})

	nextPage() {
		this.filter.fields.page.nextPage()
	}

	protected readonly FilterFieldName = FilterFieldName
}
