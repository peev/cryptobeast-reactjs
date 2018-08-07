import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox} >
    {path}
  </SvgIcon>
);

const UpArrowIcon = (
  // <path
  //   fill="#3ec39d"
  //   id="up-arrow"
  //   data-name="up arrow"
  //   d="M1070.38,804V795.61H1074L1067,788l-7,7.612h3.62V804h6.76Z"
  //   transform="translate(-1060 -788)"
  // />
  <svg viewBox="0 0 145.17 72.5">
    <g id="Layer_2" data-name="Layer 2">
      <polygon
        className="cls-8"
        points="0 72.5 72.5 0 145.17 72.5 0 72.5"
        id="Layer_1-2"
        data-name="Layer 1"
      />
    </g>
  </svg>
);

export default wrapSvgPath(UpArrowIcon);
