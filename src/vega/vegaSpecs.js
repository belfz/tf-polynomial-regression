const $schema = 'https://vega.github.io/schema/vega-lite/v2.json';

export const createDataSpec = (values) => ({
  $schema,
  width: 300,
  height: 300,
  data: { values },
  layer: [
    {
      mark: 'point',
      encoding: {
        x: {field: 'testX', type: 'quantitative'},
        y: {field: 'testY', type: 'quantitative'},
        color: {value: 'green'}
      },
    },
    {
      mark: 'point',
      encoding: {
        x: {field: 'trainX', type: 'quantitative'},
        y: {field: 'trainY', type: 'quantitative'},
        color: {value: 'grey'}
      }
    },
    {
      mark: 'line',
      encoding: {
        x: {field: 'trainX', type: 'quantitative'},
        y: {field: 'pred', type: 'quantitative'},
        color: {value: 'tomato'}
      },
    }
  ]
});

export const createErrorSpec = (errorFieldName, values) => ({
  $schema,
  width: 100,
  height: 100,
  data: { values },
  layer: [
    {
      mark: 'line',
      encoding: {
        x: {field: 'iterations', type: 'quantitative'},
        y: {field: errorFieldName, type: 'quantitative'},
        color: {value: 'blue'}
      },
    }
  ]
});
