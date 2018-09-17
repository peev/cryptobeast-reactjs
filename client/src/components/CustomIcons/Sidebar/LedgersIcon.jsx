import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const LedgersIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <rect className="cls-1" x="0.5" y="0.8" width="3.95" height="18.47" />
        <rect className="cls-1" x="6.84" y="0.8" width="3.95" height="18.47" />
        <rect className="cls-1" x="14.24" y="0.74" width="3.95" height="18.47" transform="translate(-2.51 6.52) rotate(-21.16)" />
        <line className="cls-1" x1="0.55" y1="14.14" x2="4.49" y2="14.14" />
        <line className="cls-1" x1="0.5" y1="16.58" x2="4.45" y2="16.58" />
        <line className="cls-1" x1="6.93" y1="14.14" x2="10.88" y2="14.14" />
        <line className="cls-1" x1="6.84" y1="16.58" x2="10.79" y2="16.58" />
        <line className="cls-1" x1="16.15" y1="14.86" x2="19.83" y2="13.43" />
        <line className="cls-1" x1="16.81" y1="17.25" x2="20.49" y2="15.83" />
        <circle className="cls-2" cx="2.47" cy="3.01" r="0.9" />
        <circle className="cls-2" cx="8.81" cy="3.01" r="0.9" />
        <circle className="cls-2" cx="13.62" cy="3.27" r="0.9" />
      </g></g>
  </svg>
);

export default wrapSvgPath(LedgersIcon);
