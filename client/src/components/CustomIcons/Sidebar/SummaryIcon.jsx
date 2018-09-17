import React from 'react';
// import pure from 'recompose/pure';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 29.76 20.67') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SummaryIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <circle className="cls-1" cx="14.88" cy="10.33" r="9.83" transform="translate(-2.43 5) rotate(-17.67)" />
        <path className="cls-1" d="M5.06,10.66C2,12.29.21,13.87.54,14.9s2.69,1.28,6.14.85a54.47,54.47,0,0,0,9.25-2.14A54.38,54.38,0,0,0,24.71,10c3.05-1.63,4.83-3.21,4.51-4.24s-2.69-1.28-6.13-.85" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(SummaryIcon);
