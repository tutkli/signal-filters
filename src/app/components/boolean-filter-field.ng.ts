import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { BooleanFilterField } from '../filters/filter-fields/boolean-filter'
import { FilterFieldWrapperComponent } from './filter-field-wrapper.ng'

@Component({
	selector: 'app-boolean-filter-field',
	imports: [MatSlideToggle, FilterFieldWrapperComponent],
	template: `
		@let field = filterField();
		@let fieldValue = field.value();
		<app-filter-field-wrapper
			[selected]="fieldValue.selected"
			(toggleSelected)="field.update({ selected: !fieldValue.selected })">
			<span ngProjectAs="label">{{ labelPrefix() + label() }}</span>

			<mat-slide-toggle
				hideIcon
				(click)="onSliderClick($event)"
				[checked]="fieldValue.value"
				(change)="field.update({ value: $event.checked })" />
		</app-filter-field-wrapper>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFilterFieldComponent {
	filterField = input.required<BooleanFilterField>()
	fieldName = input.required<string>()
	label = input.required<string>()
	labelPrefix = input<string>('')
	selector = input<boolean>(false)

	onSliderClick(event: MouseEvent): void {
		if (this.filterField().value().selected) {
			event.stopPropagation()
		}
	}
}
