import React from 'react'

const Checkbox = ({ children, ...otherProps }) =>
  <span>{children}
    <input type="checkbox" {...otherProps} />
  </span>;

export default Checkbox;
