import {FilterField} from "./types";
import {signal} from "@angular/core";

export class PageFilterValue {
  value: number;
  selected: boolean;

  constructor({ value = 1, selected = true }: Partial<PageFilterValue> = {}) {
    this.value = value;
    this.selected = selected;
  }
}
export interface PageFilterFieldConfig {
  initialValue: PageFilterValue;
  defaultValue: PageFilterValue;
  active: boolean;
}


export class PageFilterField implements FilterField<PageFilterValue> {
    defaultValue = new PageFilterValue();

    private readonly _active = signal(false);
    active = this._active.asReadonly();

    private readonly _value = signal(this.defaultValue);
    value = this._value.asReadonly();

    constructor({
    initialValue = new PageFilterValue(),
    defaultValue = new PageFilterValue(),
    active = false,
  }: Partial<PageFilterFieldConfig> = {}) {
    this._value.set(initialValue);
    this.defaultValue = defaultValue;
    this._active.set(active);
  }

    set(value: PageFilterValue): void {
        this._value.set(value);
    }

    reset(): void {
        this._value.set(this.defaultValue);
    }

    serialize(fieldName: string): void {
    }

    nextPage() {
        this.set(new PageFilterValue({ value: this.value().value + 1 }));
    }
}