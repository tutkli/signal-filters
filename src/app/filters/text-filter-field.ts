import {signal} from "@angular/core";
import {FilterField} from "./types";

export class TextFilterValue {
  value: string;
  selected: boolean;

  constructor({ value = '', selected = true }: Partial<TextFilterValue> = {}) {
    this.value = value;
    this.selected = selected;
  }
}

export interface TextFilterFieldConfig {
  initialValue: TextFilterValue;
  defaultValue: TextFilterValue;
  active: boolean;
}

export class TextFilterField implements FilterField<TextFilterValue> {
    defaultValue = new TextFilterValue();

    private readonly _active = signal(false);
    active = this._active.asReadonly();

    private readonly _value = signal(this.defaultValue);
    value = this._value.asReadonly();

    constructor({
    initialValue = new TextFilterValue(),
    defaultValue = new TextFilterValue(),
    active = false,
  }: Partial<TextFilterFieldConfig> = {}) {
    this._value.set(initialValue);
    this.defaultValue = defaultValue;
    this._active.set(active);
  }

    set(value: TextFilterValue): void {
        this._value.set(value);
    }

    reset(): void {
        this._value.set(this.defaultValue);
    }

    serialize(fieldName: string): void {
    }
}