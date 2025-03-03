# SignalFilters

> Overengineered filter solution based on Signals.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.6.

## Usage

```ts
const filter = createFilter({
  q: textFilterField(),
  visible: booleanFilterField(),
  status: arrayFilterField({ serializer: arrayFilterCommaSerializer }),
});

// Update filter values
filter.set({q: textFilterValue({ value: 'query' })})
filter.fields.q.set(textFilterValue({ value: 'query' }))
filter.fields.q.update({ value: 'query' }) // Partial change

// Get endpoint data based on selected fields
const data = filter.data('https://api.example.com')

// Get filter value
filter.value()

// Check if filter is dirty
filter.isDirty()
filter.fields.q.isDirty()

// Get current page
filter.page()

// Set next page
filter.nextPage()

// Get serialized queryParams
filter.serializedParams()

// Reset fields
filter.reset()
filter.reset([FilterFieldName.q])
```

