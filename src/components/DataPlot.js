import React, { Component } from 'react';
import styled from 'styled-components';
import renderChart from 'vega-embed';
import InlineCaption from './InlineCaption';
import { createDataSpec, createErrorSpec } from '../vega/vegaSpecs';

class DataPlot extends Component {
  componentDidUpdate () {
    this.createChart();
    this.createErrorChart();
    this.createTestErrorChart();
  }

  createChart () {
    const { trainXs, trainYs, testXs, testYs, predictions, showTestData } = this.props;
    const trainValues = Array.from(trainYs).map((y, i) => ({trainX: trainXs[i], trainY: trainYs[i], pred: predictions[i]}));
    const values = showTestData ?
      trainValues.concat(Array.from(testYs).map((y, i) => ({testX: testXs[i], testY: testYs[i]})))
      : trainValues;
 
    return renderChart(this.chart, createDataSpec(values), { actions: false });
  }

  createErrorChart () {
    const { error } = this.props;
    const values = error.map((e, i) => ({iterations: i, error_value: e}));

    return renderChart(this.errorChart, createErrorSpec('error_value', values), { actions: false });
  }

  createTestErrorChart () {
    const { testError } = this.props;
    const values = testError.map((e, i) => ({iterations: i, test_error_value: e}));

    return renderChart(this.testErrorChart, createErrorSpec('test_error_value', values), { actions: false });
  }

  render () {
    const { a, b, c, d, error, iteration, testError, className } = this.props;
    return (
      <div className={className}>
        <div>
          <InlineCaption>coefficients: </InlineCaption>
          <span>a={a.toFixed(3)}, </span>
          <span>b={b.toFixed(3)}, </span>
          <span>c={c.toFixed(3)}, </span>
          <span>d={d.toFixed(3)}, </span>
          <InlineCaption>training error: </InlineCaption><span>{iteration === 0 ? 'N/A': error[error.length - 1].toFixed(3)}, </span>
          <InlineCaption>test error: </InlineCaption><span>{iteration === 0 ? 'N/A': testError[testError.length - 1].toFixed(3)}, </span>
          <InlineCaption>iteration: </InlineCaption><span>{iteration}</span>
        </div>
        <div className="charts-container">
          <div ref={chart => this.chart = chart}></div>
          <div ref={errorChart => this.errorChart = errorChart}></div>
          <div ref={testErrorChart => this.testErrorChart = testErrorChart}></div>
        </div>
      </div>
    );
  }
}

export default styled(DataPlot)`
  .charts-container {
    display: flex;
  }
`;
