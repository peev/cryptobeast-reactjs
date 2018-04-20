import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import './icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
  <path
    id="down-arrow"
    data-name="down arrow"
    d="M1204.62,788v8.392H1201l7,7.611,7-7.611h-3.62V788h-6.76Z"
    transform="translate(-1201 -788)"
  />
);

export default wrapSvgPath(SimulatorPath);
