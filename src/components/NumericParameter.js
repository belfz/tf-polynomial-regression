import React from 'react';
import InlineCaption from './InlineCaption';
import styled from 'styled-components';

const roundNumber = (number, round) => round === 0 ? number : number.toFixed(round);

const NumericParameter = ({ children, className, label, value, round = 3 }) => {
  const sanitizedValue = typeof value === 'number' ?
  roundNumber(value, round)
  : value;
  return (
    <span className={className}>
      <InlineCaption>{label}: </InlineCaption>
      <span>{sanitizedValue}{children}</span>
    </span>
  );
};

export default styled(NumericParameter)`
  margin: 0 .25em;
`;
