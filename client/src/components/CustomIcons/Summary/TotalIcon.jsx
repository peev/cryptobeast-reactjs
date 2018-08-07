import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 115 120') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const TotalIcon = (
  <svg viewBox="0 0 341.333 341.333">
    <g id="svg_3" fill="#000000" fillOpacity="1">
      <path data-original="#000000" className="active-path" data-old_color="#FBFBFB" fill="#0000" d="M298.667 0h-256v42.667l138.666 128-138.666 128v42.666h256v-64H149.333L256 170.667 149.333 64h149.334z" />
    </g>
  </svg>
);

export default wrapSvgPath(TotalIcon);
