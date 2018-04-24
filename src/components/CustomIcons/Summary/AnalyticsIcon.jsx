import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
  <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 489.739 489.739" space="preserve" width="20px" height="20px" className="">
    <g>
      <rect x="0" y="244.87" width="89.043" height="244.87" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#ffffff" />
      <rect x="400.696" y="89.043" width="89.043" height="400.696" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#ffffff" />
      <rect x="133.565" y="356.174" width="89.043" height="133.565" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#ffffff" />
      <rect x="267.13" width="89.044" height="489.739" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#ffffff" />
    </g>
  </svg>
);

export default wrapSvgPath(SimulatorPath);
