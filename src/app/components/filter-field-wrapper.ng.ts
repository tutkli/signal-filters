import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'

@Component({
	selector: 'app-filter-field-wrapper',
	template: `
		<button
			(click)="toggleSelected.emit()"
			[attr.data-selected]="selected() ? true : undefined"
			class="data-selected:bg-secondary-container cursor-pointer inline-flex items-center justify-center pl-3 pr-2 py-1 gap-1.5 whitespace-nowrap text-base rounded-sm transition-colors disabled:pointer-events-none disabled:opacity-50 border border-gray-500 bg-background border-solid hover:bg-surface-dim focus-visible:outline-primary">
			<ng-content select="label" />

			@if (hasValue()) {
				<div class="shrink-0 bg-gray-500 relative w-px mx-2 h-6"></div>
			}

			<ng-content />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFieldWrapperComponent {
	selected = input.required<boolean>()
	hasValue = input(true)

	toggleSelected = output()
}
