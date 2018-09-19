import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const TransactionHistoryIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path className="cls-1" d="M20.14,9.9a9.82,9.82,0,0,1,.3,2.4,10,10,0,0,1-.32,2.49" />
        <path className="cls-1" d="M8.63,21.36A9.43,9.43,0,0,1,4.4,18.89" />
        <path className="cls-1" d="M8.71,3.22h0A9.41,9.41,0,0,0,4.46,5.65" />
        <path className="cls-1" d="M2,10H2a9.41,9.41,0,0,0,.08,4.88" />
        <path className="cls-1" d="M13.43,21.39a9.36,9.36,0,0,0,4.25-2.44s0,0,0,0" />
        <circle className="cls-1" cx="11.12" cy="2.93" r="2.43" />
        <circle className="cls-1" cx="2.98" cy="7.58" r="2.43" transform="translate(-5.07 6.37) rotate(-60)" />
        <circle className="cls-1" cx="2.93" cy="16.95" r="2.43" transform="translate(-8.08 3.74) rotate(-30)" />
        <circle className="cls-1" cx="11.03" cy="21.68" r="2.43" />
        <circle className="cls-1" cx="19.17" cy="17.03" r="2.43" transform="translate(-5.17 25.11) rotate(-60)" />
        <circle className="cls-1" cx="19.21" cy="7.66" r="2.43" transform="translate(-1.25 10.63) rotate(-30)" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(TransactionHistoryIcon);
