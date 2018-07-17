import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const ChevronRightIcon = (
  <g className="cls-2" >
    <path className="cls-2" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </g>
);

export default wrapSvgPath(ChevronRightIcon);
