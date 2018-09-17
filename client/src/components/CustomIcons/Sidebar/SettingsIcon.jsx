import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 22 22') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SettingsIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <circle className="cls-1" cx="10.27" cy="10.26" r="1.81" />
        <path className="cls-1" d="M15.76,10.26a5.49,5.49,0,1,1-5.49-5.49A5.5,5.5,0,0,1,15.76,10.26Z" />
        <path className="cls-1" d="M20,11.46V9.29L17.83,9A7.46,7.46,0,0,0,16.64,6L18,4.21,16.48,2.67,14.75,4.05a7.39,7.39,0,0,0-3-1.31L11.48.5H9.3L9,2.7A7.53,7.53,0,0,0,6,3.89L4.22,2.51,2.68,4.05,4.05,5.78a7.39,7.39,0,0,0-1.31,3L.5,9.06v2.18l2.2.25a7.39,7.39,0,0,0,1.2,3.06l-1.4,1.77,1.54,1.54L5.8,16.48a7.4,7.4,0,0,0,3,1.31L9.07,20h2.18l.25-2.2a7.32,7.32,0,0,0,3.06-1.2L16.33,18l1.54-1.54-1.38-1.73a7.44,7.44,0,0,0,1.31-3Z" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(SettingsIcon);
