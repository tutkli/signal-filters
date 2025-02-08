import { JsonPipe } from '@angular/common'
import { Component } from '@angular/core'
import { Filter } from './filters/create-filter-tut'
import { TextFilterField, TextFilterValue } from './filters/text-filter-field'

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
			<!--			<div>-->
			<!--				Visible {{ filter.getField('visible')?.value() }}-->
			<!--				<button (click)="filter.updateField('visible', !filter.getField('visible')?.value())">Toggle</button>-->
			<!--				<button (click)="filter.reset('visible')">Reset</button>-->
			<!--			</div>-->

			<button (click)="nextPage()">Next page</button>

			<div>
				<button (click)="filter.reset()">Reset All</button>
			</div>
			<div>Filter is dirty: {{ filter.isDirty() }}</div>
			<div>Current filter value: {{ filter.value() | json }}</div>
		</div>
	`,
})
export class AppComponent {
	filter = new Filter({
		q: new TextFilterField(),
		search: new TextFilterField(),
	})

	updateQ(value: string) {
		this.filter.fields.q.set(new TextFilterValue({ value }))
	}

	updateSearch(value: string) {
		this.filter.set({ search: new TextFilterValue({ value }) })
	}

	nextPage() {
		this.filter.fields.page.nextPage()
	}
}
