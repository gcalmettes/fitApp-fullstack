import React from 'react';

export const ColoredLine = ({color}) => (
  <hr
    style={{
      border: 0,
      clear: 'both',
      display: 'block',
      width: '96%',           
      backgroundColor: color,
      height: '1px'
    }}
  />
);

export const Divider = ({title}) => (
  <div className="strike">
    <span>{title}</span>
</div>
);