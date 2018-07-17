import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 30.18 15.16') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const AssetMovementsIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <circle className="cls-1" cx="4.01" cy="11.16" r="3.51" />
        <circle className="cls-1" cx="11.02" cy="2.93" r="2.43" />
        <circle className="cls-1" cx="20.27" cy="7.41" r="1.72" />
        <circle className="cls-1" cx="28.32" cy="2.93" r="1.36" />
        <line className="cls-1" x1="6.17" y1="8.41" x2="9.47" y2="4.79" />
        <line className="cls-1" x1="13.03" y1="4.29" x2="18.55" y2="7.41" />
        <line className="cls-1" x1="21.99" y1="6.97" x2="27.11" y2="3.52" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(AssetMovementsIcon);
