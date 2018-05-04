import React from 'react';
import NumericParameter from './NumericParameter';

const ParametersInfo = ({ a, b, c, d, error, iteration, testError }) =>
  <div>
    <NumericParameter label="a" value={a} />
    <NumericParameter label="b" value={b} />
    <NumericParameter label="c" value={c} />
    <NumericParameter label="d" value={d} />
    <NumericParameter label="training error" value={iteration === 0 ? 'N/A': error[error.length - 1]} />
    <NumericParameter label="test error" value={iteration === 0 ? 'N/A': testError[testError.length - 1]} />
    <NumericParameter label="iteration" value={iteration} />
  </div>;

export default ParametersInfo;
