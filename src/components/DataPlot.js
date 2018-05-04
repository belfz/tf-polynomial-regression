import React from 'react';
import styled from 'styled-components';
import DataChart from './DataChart';
import ErrorChart from './ErrorChart';
import ParametersInfo from './ParametersInfo';

const DataPlot = ({ a, b, c, d, error, iteration, testError, className,
  trainXs, trainYs, testXs, testYs, predictions, showTestData }) => {
  return (
    <div className={className}>
      <ParametersInfo a={a} b={b} c={c} d={d} error={error} iteration={iteration} testError={testError} />
      <div className="charts-container">
        <DataChart trainXs={trainXs} trainYs={trainYs} testXs={testXs} testYs={testYs} predictions={predictions} showTestData={showTestData} />
        <ErrorChart label="train_error" error={error} />
        <ErrorChart label="test_error" error={testError} />
      </div>
    </div>
  );
}

export default styled(DataPlot)`
  .charts-container {
    display: flex;
  }
`;
