export const createDataSpec = (values) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
  width: 300,
  height: 300,
  data: { values },
  layer: [
    {
      mark: 'point',
      encoding: {
        x: {field: 'x', type: 'quantitative'},
        y: {field: 'y', type: 'quantitative'}
      }
    },
    {
      mark: 'line',
      encoding: {
        x: {field: 'x', type: 'quantitative'},
        y: {field: 'pred', type: 'quantitative'},
        color: {value: 'tomato'}
      },
    }
  ]
});

export const createErrorSpec = (values) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
  width: 150,
  height: 150,
  data: { values },
  layer: [
    {
      mark: 'line',
      encoding: {
        x: {field: 'iterations', type: 'quantitative'},
        y: {field: 'error_value', type: 'quantitative'},
        color: {value: 'blue'}
      },
    }
  ]
});