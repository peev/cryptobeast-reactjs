import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const AnalyticsIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path className="cls-1" d="M19.44,13H10V3.55A9.47,9.47,0,1,0,19.44,13Z" />
        <path className="cls-1" d="M21.65,10H12.19V.5A9.47,9.47,0,0,1,21.65,10Z" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(AnalyticsIcon);
