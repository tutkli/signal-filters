import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconButton } from '@angular/material/button'
import { MatFormField, MatSuffix } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { TextFilterField } from '../filters/filter-fields/text-filter'

@Component({
	selector: 'app-text-filter-field',
	imports: [MatFormField, MatInput, MatIconButton, MatIcon, MatSuffix, FormsModule],
	template: `
		@let field = filterField();
		@let fieldValue = field.value();
		<mat-form-field appearance="outline" subscriptSizing="dynamic">
			<input
				matInput
				[type]="type()"
				[placeholder]="placeholder()"
				[ngModel]="fieldValue.value"
				(ngModelChange)="field.set({ value: $event })" />
			@if (fieldValue.value) {
				<button mat-icon-button matSuffix (click)="field.reset()">
					<mat-icon>close</mat-icon>
				</button>
			} @else {
				<button mat-icon-button matSuffix disabled>
					<mat-icon matSuffix>search</mat-icon>
				</button>
			}
		</mat-form-field>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFilterFieldComponent {
	filterField = input.required<TextFilterField>()
	placeholder = input.required<string>()
	type = input<'text' | 'number'>('text')
}
