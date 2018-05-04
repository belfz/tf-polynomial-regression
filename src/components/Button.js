import React from 'react';

const Button = ({ children, ...otherProps }) =>
  <button {...otherProps}>{children}</button>;

export default Button;
