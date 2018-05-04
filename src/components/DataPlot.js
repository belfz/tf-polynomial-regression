import React, { Component } from 'react';
import renderChart from 'vega-embed';

const createVegaSpec = (values) => ({
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

class DataPlot extends Component {
  componentDidUpdate () {
    this.createView();
  }

  createView () {
    const { xs, ys, predictions } = this.props;

    const values = Array.from(ys).map((y, i) => {
      return {'x': xs[i], 'y': ys[i], pred: predictions[i]};
    });
 
    return renderChart(this.chart, createVegaSpec(values), { actions: false });
  }

  render () {
    const { a, b, c, d, error, iteration } = this.props;
    return (
      <div>
        <div>
          <span className="caption">coefficients: </span>
          <span>a={a.toFixed(3)}, </span>
          <span>b={b.toFixed(3)}, </span>
          <span>c={c.toFixed(3)}, </span>
          <span>d={d.toFixed(3)}, </span>
          <span className="caption">error: </span><span>{iteration === 0 ? 'N/A': error}, </span>
          <span className="caption">iteration: </span><span>{iteration}</span>
        </div>
        <div ref={chart => this.chart = chart}></div>
      </div>
    );
  }
}

export default DataPlot;
