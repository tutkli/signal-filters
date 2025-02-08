import {TextFilterField, TextFilterFieldConfig, TextFilterValue} from "./text-filter-field";

export class LimitFilterField extends TextFilterField {
  constructor({
    initialValue = new TextFilterValue({ value: '20' }),
    defaultValue = new TextFilterValue({ value: '20' }),
    active = false,
  }: Partial<TextFilterFieldConfig> = {}) {
    super({ initialValue, defaultValue, active });
  }
}