import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	signal,
} from '@angular/core'
import { BooleanFilterValue } from '../filters/boolean-filter'

@Component({
	selector: 'app-boolean-filter-field',
	imports: [],
	template: `
		<button></button>
	`,
	styles: ``,
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
