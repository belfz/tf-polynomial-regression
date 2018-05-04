import React, { Component } from 'react';
import { createErrorSpec } from '../vega/vegaSpecs';
import renderChart from 'vega-embed';

class ErrorChart extends Component {
  componentDidUpdate () {
    this.createErrorChart();
  }

  createErrorChart () {
    const { error, label } = this.props;
    const values = error.map((e, i) => ({iterations: i, [label]: e}));

    return renderChart(this.errorChart, createErrorSpec(label, values), { actions: false });
  }

  render () {
    return <div ref={errorChart => this.errorChart = errorChart}></div>
  }
}

export default ErrorChart;
