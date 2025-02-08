import {computed, Signal, signal, WritableSignal} from "@angular/core";

// Filter field types
type FilterFieldName = 'q' | 'visible' | 'status' | 'category'; // add more as needed

// Base interface for all filter fields
interface BaseFilterField<T> {
  value: Signal<T>;
  defaultValue: T;
  active: Signal<boolean>;
  selected: Signal<boolean>;
  serialize: () => string | null;
}

// Specific filter field types
interface TextFilterField extends BaseFilterField<string> {
  type: 'text';
}

interface BooleanFilterField extends BaseFilterField<boolean> {
  type: 'boolean';
}

interface NumberFilterField extends BaseFilterField<number> {
  type: 'number';
}

// Combined type for all possible filter fields
type FilterField = TextFilterField | BooleanFilterField | NumberFilterField;

// Filter configuration type
type FilterConfig = {
  [K in FilterFieldName]?: {
    type: FilterField['type'];
    defaultValue: any;
  };
}

export function createFilter<T extends FilterConfig>(config: T) {
  // Create signals for each filter field
  const fields = new Map<FilterFieldName, FilterField>();

  // Create the filter state
  const isDirtySignal = signal(false);

  // Initialize fields based on config
  for (const [fieldName, fieldConfig] of Object.entries(config)) {
    const valueSignal = signal(fieldConfig.defaultValue);
    const activeSignal = signal(true);
    const selectedSignal = signal(false);

    const field = {
      type: fieldConfig.type,
      value: valueSignal,
      defaultValue: fieldConfig.defaultValue,
      active: activeSignal,
      selected: selectedSignal,
      serialize: () => {
        const value = valueSignal();
        if (!activeSignal() || value === fieldConfig.defaultValue) {
          return null;
        }
        return String(value);
      }
    } as FilterField;

    fields.set(fieldName as FilterFieldName, field);
  }

  // Create computed signal for combined filter values
  const filterValue = computed(() => {
    const result: Record<string, any> = {};
    fields.forEach((field, name) => {
      if (field.active()) {
        result[name] = field.value();
      }
    });
    return result;
  });

  return {
    value: filterValue,
    isDirty: isDirtySignal,

    // Update a specific field value
    updateField: (fieldName: FilterFieldName, value: any) => {
      const field = fields.get(fieldName);
      if (field) {
        (field.value as WritableSignal<any>).set(value);
        isDirtySignal.set(true);
      }
    },

    // Reset all fields or a specific field
    reset: (fieldName?: FilterFieldName) => {
      if (fieldName) {
        const field = fields.get(fieldName);
        if (field) {
          (field.value as WritableSignal<any>).set(field.defaultValue);
        }
      } else {
        fields.forEach(field => {
          (field.value as WritableSignal<any>).set(field.defaultValue);
        });
      }
      isDirtySignal.set(false);
    },

    // Serialize all fields
    serialize: () => {
      const params = new URLSearchParams();
      fields.forEach((field, name) => {
        const serialized = field.serialize();
        if (serialized !== null) {
          params.set(name, serialized);
        }
      });
      return params.toString();
    },

    // Get a specific field
    getField: (fieldName: FilterFieldName) => fields.get(fieldName),
  };
}