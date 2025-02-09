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

@Component({
	selector: 'app-boolean-filter-field',
	imports: [MatSlideToggle],
	template: `
		<button
			(click)="toggleSelected()"
			[attr.data-selected]="fieldValue().selected ? true : undefined"
			class="data-selected:bg-secondary-container cursor-pointer inline-flex items-center justify-center pl-3 pr-2 py-1 gap-1.5 whitespace-nowrap text-base rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-50 border border-gray-500 bg-background border-solid hover:bg-surface-dim focus-visible:outline-primary">
			<span>{{ label() }}</span>
			<div class="shrink-0 bg-gray-500 relative w-px mx-2 h-6"></div>
			<mat-slide-toggle
				hideIcon
				(click)="onSliderClick($event)"
				[checked]="fieldValue().value"
				(change)="updateValue($event.checked)" />
		</button>
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
