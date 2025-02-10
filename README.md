# SignalFilters

> Overengineered filter solution based on Signals.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

## Usage

```ts
const filter = createFilter({
    q: textFilterField(),
    visible: booleanFilterField(),
    status: arrayFilterField()
})

// Update filter values
filter.set({ q: { value: 'query' } })
filter.fields.q.set({ value: 'query' })

// Get current values
filter.value()

// Get serialized values
filter.serializedPairs()

// Reset all filters
filter.reset()

// Reset specific filters
filter.reset([FilterFieldName.q])
filter.fields.q.reset()
```

