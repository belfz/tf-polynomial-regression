import React, { Component } from 'react';
import { createDataSpec } from '../vega/vegaSpecs';
import renderChart from 'vega-embed';

class DataChart extends Component {
  componentDidUpdate () {
    this.createDataChart();
  }

  createDataChart () {
    const { testData, trainingData, predictions, showTestData } = this.props;
    const trainXs = trainingData.xs.dataSync();
    const trainYs = trainingData.ys.dataSync();
    const testXs = testData.xs.dataSync();
    const testYs = testData.ys.dataSync();
    const trainValues = Array.from(trainYs).map((y, i) => ({trainX: trainXs[i], trainY: trainYs[i], pred: predictions[i]}));
    const values = showTestData ?
      trainValues.concat(Array.from(testYs).map((y, i) => ({testX: testXs[i], testY: testYs[i]})))
      : trainValues;
 
    return renderChart(this.dataChart, createDataSpec(values, showTestData), { actions: false });
  }

  render () {
    return <div ref={dataChart => this.dataChart = dataChart}></div>
  }
}

export default DataChart;
