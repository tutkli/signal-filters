import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	signal,
} from '@angular/core'
import { MatChipListbox, MatChipOption } from '@angular/material/chips'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { BooleanFilterValue } from '../filters/boolean-filter'

@Component({
	selector: 'app-boolean-filter-field',
	imports: [MatChipListbox, MatChipOption, MatSlideToggle],
	template: `
		<mat-chip-listbox hideSingleSelectionIndicator>
			<mat-chip-option
				disableRipple
				[selected]="selected()"
				(selectionChange)="selected.set($event.selected); toggleSelected()">
				<mat-slide-toggle
					hideIcon
					[disabled]="!fieldValue().selected"
					[checked]="fieldValue().value"
					(change)="updateValue($event.checked)"
					(click)="$event.stopPropagation()"></mat-slide-toggle>
				<span class="label">{{ label() }}</span>
			</mat-chip-option>
		</mat-chip-listbox>
	`,
	styles: `
		mat-chip-option {
			height: auto;
			padding: 5px 0;
			margin: 0;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFilterFieldComponent {
	fieldName = input.required<string>()
	fieldValue = input.required<BooleanFilterValue>()
	label = input.required<string>()
	labelPrefix = input<string>()
	selector = input<boolean>(false)

	valueChange = output<BooleanFilterValue>()
	reseted = output<void>()

	selected = signal(false)

	constructor() {
		afterNextRender(() => {
			this.selected.set(this.fieldValue().selected)
		})
	}

	updateValue(value: boolean) {
		this.valueChange.emit({ ...this.fieldValue(), value })
	}

	toggleSelected() {
		this.valueChange.emit({
			...this.fieldValue(),
			selected: this.selected(),
		})
	}
}
