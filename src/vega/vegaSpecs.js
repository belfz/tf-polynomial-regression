const $schema = 'https://vega.github.io/schema/vega-lite/v2.json';

export const createDataSpec = (values, showTestData = false) => {
  const spec = {
    $schema,
    width: 300,
    height: 300,
    data: { values },
    layer: [
      {
        mark: 'point',
        encoding: {
          x: {field: 'trainX', type: 'quantitative'},
          y: {field: 'trainY', type: 'quantitative'},
          color: {value: 'grey'}
        }
      },
      {
        mark: {
          orient: 'vertical',
          type: 'line' 
        },
        orient: 'vertical',
        encoding: {
          x: {field: 'trainX', type: 'quantitative'},
          y: {field: 'pred', type: 'quantitative'},
          color: {value: 'tomato'}
        },
      }
    ]
  };

  const testLayer = {
    mark: 'point',
    encoding: {
      x: {field: 'testX', type: 'quantitative'},
      y: {field: 'testY', type: 'quantitative'},
      color: {value: 'green'}
    },
  };

  if (showTestData) {
    spec.layer.push(testLayer);
  }

  return spec;
};

export const createErrorSpec = (errorFieldName, values) => ({
  $schema,
  width: 100,
  height: 100,
  data: { values },
  layer: [
    {
      mark: {
        orient: 'vertical',
        type: 'line' 
      },
      encoding: {
        x: {field: 'iterations', type: 'quantitative'},
        y: {field: errorFieldName, type: 'quantitative'},
        color: {value: 'blue'}
      },
    }
  ]
});
