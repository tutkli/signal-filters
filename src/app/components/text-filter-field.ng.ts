import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconButton } from '@angular/material/button'
import { MatFormField, MatSuffix } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { TextFilterValue } from '../filters/text-filter'

@Component({
	selector: 'app-text-filter-field',
	imports: [MatFormField, MatInput, MatIconButton, MatIcon, MatSuffix, FormsModule],
	template: `
		<mat-form-field appearance="outline" subscriptSizing="dynamic">
			<input
				matInput
				[type]="type()"
				[placeholder]="placeholder()"
				[ngModel]="fieldValue().value"
				(ngModelChange)="updateValue($event)" />
			@if (fieldValue().value) {
				<button mat-icon-button matSuffix (click)="reseted.emit()">
					<mat-icon>close</mat-icon>
				</button>
			} @else {
				<button mat-icon-button matSuffix>
					<mat-icon matSuffix>search</mat-icon>
				</button>
			}
		</mat-form-field>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFilterFieldComponent {
	placeholder = input.required<string>()
	fieldValue = input.required<TextFilterValue>()
	type = input<'text' | 'number'>('text')

	valueChange = output<TextFilterValue>()
	reseted = output<void>()

	updateValue(value: string) {
		this.valueChange.emit({ ...this.fieldValue(), value })
	}
}
