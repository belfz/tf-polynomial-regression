import React, { Component } from 'react';
import renderChart from 'vega-embed';
import { createDataSpec, createErrorSpec } from '../vega/vegaSpecs';

class DataPlot extends Component {
  componentDidUpdate () {
    this.createChart();
    this.createErrorChart();
  }

  createChart () {
    const { xs, ys, predictions } = this.props;
    const values = Array.from(ys).map((y, i) => ({x: xs[i], y: ys[i], pred: predictions[i]}));
 
    return renderChart(this.chart, createDataSpec(values), { actions: false });
  }

  createErrorChart () {
    const { error } = this.props;
    const values = error.map((e, i) => ({iterations: i, error_value: e}));

    return renderChart(this.errorChart, createErrorSpec(values), { actions: false });
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
          <span className="caption">error: </span><span>{iteration === 0 ? 'N/A': error[error.length - 1].toFixed(3)}, </span>
          <span className="caption">iteration: </span><span>{iteration}</span>
        </div>
        <div className="charts-container">
          <div ref={chart => this.chart = chart}></div>
          <div ref={errorChart => this.errorChart = errorChart}></div>
        </div>
      </div>
    );
  }
}

export default DataPlot;
