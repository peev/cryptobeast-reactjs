import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const DownArrowIcon = (
  // <path
  //   fill="#ca3f58"
  //   id="down-arrow"
  //   data-name="down arrow"
  //   d="M1204.62,788v8.392H1201l7,7.611,7-7.611h-3.62V788h-6.76Z"
  //   transform="translate(-1201 -788)"
  // />

  <svg viewBox="0 0 145.17 72.5">
    <defs />
    <g id="Layer_2" data-name="Layer 2">
      <polygon
        className="cls-9"
        points="145.17 0 72.67 72.5 0 0 145.17 0"
        id="Layer_1-2"

        data-name="Layer 1" />
    </g>
  </svg>
);

export default wrapSvgPath(DownArrowIcon);
