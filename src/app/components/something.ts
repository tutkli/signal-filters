import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { BooleanFilterValue } from '../filters/boolean-filter'

@Component({
	selector: 'app-something',
	standalone: true,
	imports: [MatCardModule, MatButtonToggleModule, MatSlideToggleModule, FormsModule],
	template: `
		<mat-card>
			<mat-card-content>
				<div class="filter-container">
					<mat-button-toggle-group
						[(ngModel)]="state.value"
						(change)="onValueChange()"
						hideSingleSelectionIndicator>
						<mat-button-toggle [value]="true">True</mat-button-toggle>
						<mat-button-toggle [value]="false">False</mat-button-toggle>
					</mat-button-toggle-group>

					<mat-slide-toggle
						[(ngModel)]="state.selected"
						(change)="onSelectedChange()"
						class="selected-toggle">
						{{ state.selected ? 'Filter Active' : 'Filter Inactive' }}
					</mat-slide-toggle>
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: [
		`
			.filter-container {
				display: flex;
				align-items: center;
				gap: 20px;
			}
			.selected-toggle {
				margin-left: 16px;
			}
		`,
	],
})
export class BooleanFilterComponent {
	@Input() state: BooleanFilterValue = { value: false, selected: false }
	@Output() stateChange = new EventEmitter<BooleanFilterValue>()

	onValueChange() {
		this.stateChange.emit(this.state)
	}

	onSelectedChange() {
		this.stateChange.emit(this.state)
	}
}
