import React from 'react';
import NumericParameter from './NumericParameter';
import Equation from './Equation';
import styled from 'styled-components';

const ParametersInfo = ({ className, a, b, c, d, error, iteration, testError }) =>
  <div className={className}>
    <Equation a={a} b={b} c={c} d={d} />
    <div className="parameters">
      <NumericParameter label="training error" value={error[error.length - 1]} />
      <NumericParameter label="test error" value={testError[testError.length - 1]} />
      <NumericParameter label="iteration" value={iteration} round={0} />
    </div>
  </div>;

export default styled(ParametersInfo)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;

  .parameters {
    margin: .25em 0;
  }
`;
