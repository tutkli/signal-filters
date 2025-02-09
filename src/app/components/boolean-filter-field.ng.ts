import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	signal,
} from '@angular/core'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { BooleanFilterValue } from '../filters/boolean-filter'
import { FilterFieldWrapperComponent } from './filter-field-wrapper.ng'

@Component({
	selector: 'app-boolean-filter-field',
	imports: [MatSlideToggle, FilterFieldWrapperComponent],
	template: `
		<app-filter-field-wrapper
			[selected]="fieldValue().selected"
			(toggleSelected)="toggleSelected()">
			<span ngProjectAs="label">{{ label() }}</span>

			<mat-slide-toggle
				hideIcon
				(click)="onSliderClick($event)"
				[checked]="fieldValue().value"
				(change)="updateValue($event.checked)" />
		</app-filter-field-wrapper>
	`,
	styles: `
		@use '@angular/material' as mat;

		:host {
			@include mat.slide-toggle-overrides(
				(
					selected-hover-handle-color: var(--mat-sys-on-primary),
					selected-focus-handle-color: var(--mat-sys-on-primary),
					selected-pressed-handle-color: var(--mat-sys-on-primary),
				)
			);
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
			selected: !this.fieldValue().selected,
		})
	}

	onSliderClick(event: MouseEvent): void {
		if (this.fieldValue().selected) {
			event.stopPropagation()
		}
	}
}
