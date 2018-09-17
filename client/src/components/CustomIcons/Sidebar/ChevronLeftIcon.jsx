import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const ChevronLeftIcon = (
  <g className="cls-2">
    <path className="cls-2" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </g>
);

export default wrapSvgPath(ChevronLeftIcon);
