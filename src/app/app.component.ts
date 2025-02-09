import { JsonPipe } from '@angular/common'
import { Component } from '@angular/core'
import { booleanFilterField } from './filters/boolean-filter'
import { createFilter } from './filters/create-filter'
import { textFilterField } from './filters/text-filter'

@Component({
	selector: 'app-root',
	imports: [JsonPipe],
	template: `
		<div>
			<div>
				<input
					#qInput
					[value]="filter.fields.q.value().value"
					(input)="updateQ(qInput.value)" />
				<button (click)="filter.reset(['q'])">Reset</button>
			</div>

			<div>
				<input
					#searchInput
					[value]="filter.fields.search.value().value"
					(input)="updateSearch(searchInput.value)" />
				<button (click)="filter.reset(['search'])">Reset</button>
			</div>
			<div>
				Visible: {{ filter.fields.visible.value().value }}
				<button
					(click)="
						filter.fields.visible.set({
							value: !filter.fields.visible.value().value,
						})
					">
					Toggle
				</button>
				<button (click)="filter.reset(['visible'])">Reset</button>
			</div>

			<button (click)="nextPage()">Next page</button>

			<div>
				<button (click)="filter.reset()">Reset All</button>
			</div>
			<div>Filter is dirty: {{ filter.isDirty() }}</div>
			<pre>
Serialized params:
				{{ filter.serializedValue() | json }}</pre
			>
			<pre>
Value:
				{{ filter.value() | json }}</pre
			>
		</div>
	`,
})
export class AppComponent {
	filter = createFilter({
		q: textFilterField(),
		search: textFilterField(),
		visible: booleanFilterField(),
	})

	other = createFilter({
		q: textFilterField(),
	})

	updateQ(value: string) {
		this.filter.fields.q.set({ ...this.filter.fields.q.value(), value })
	}

	updateSearch(value: string) {
		this.filter.set({ search: { ...this.filter.fields.search.value(), value } })
	}

	nextPage() {
		this.filter.fields.page.nextPage()
	}
}
