import React from 'react';

const LearningRateSelector = ({ learningRate, onChange }) =>
  <select value={learningRate} onChange={onChange}>
    <option value={3}>3</option>
    <option value={1}>1</option>
    <option value={0.5}>0.5</option>
    <option value={0.3}>0.3</option>
    <option value={0.1}>0.1</option>
    <option value={0.05}>0.05</option>
    <option value={0.03}>0.03</option>
    <option value={0.01}>0.01</option>
  </select>;

export default LearningRateSelector;
