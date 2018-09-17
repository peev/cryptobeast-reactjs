import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 11.2 6.44') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const DropDownArrow = (
  <g>
    <polyline
      className="cls-10"
      points="0.36 0.35 5.49 5.73 10.84 0.35"
    />
  </g>
);

export default wrapSvgPath(DropDownArrow);
