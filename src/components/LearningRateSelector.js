import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const LearningRateSelector = ({ learningRate, onChange }) =>
  <SelectField floatingLabelText="learning rate" value={learningRate} onChange={onChange}>
    <MenuItem value={3} primaryText="3" />
    <MenuItem value={1} primaryText="1" />
    <MenuItem value={0.5} primaryText="0.5" />
    <MenuItem value={0.3} primaryText="0.3" />
    <MenuItem value={0.1} primaryText="0.1" />
    <MenuItem value={0.05} primaryText="0.05" />
    <MenuItem value={0.03} primaryText="0.03" />
    <MenuItem value={0.01} primaryText="0.01" />
  </SelectField>;

export default LearningRateSelector;
