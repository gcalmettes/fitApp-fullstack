import React from 'react';

const GridLayout = (props) => {
  const {children} = props
  return (
    <div className="grid-container">
      { children }
    </div>
  )
}

GridLayout.NavTop = ({children}) => (
  <div className='grid-nav-top'>
    { children }
  </div>
);

GridLayout.NavLeft = ({children}) => (
  <div className='grid-nav-left'>
    { children }
  </div>
);

GridLayout.Main = ({children}) => (
  <div className='grid-main'>
    { children }
  </div>
);

GridLayout.SubMain = ({children}) => (
  <div className='grid-submain'>
    { children }
  </div>
);

GridLayout.BlockRight1 = ({children}) => (
  <div className='grid-right-block1'>
    { children }
  </div>
);

GridLayout.BlockRight2 = ({children}) => (
  <div className='grid-right-block2'>
    { children }
  </div>
);

export default GridLayout