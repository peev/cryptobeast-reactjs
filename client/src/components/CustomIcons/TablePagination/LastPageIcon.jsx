import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const LastPageIcon = (
  <g>
    <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
  </g>
);

export default wrapSvgPath(LastPageIcon);
