import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
<svg viewBox="0 0 489.739 489.739">
  <path data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff" d="M0 244.87h89.043v244.87H0zM400.696 89.043h89.043v400.696h-89.043zM133.565 356.174h89.043v133.565h-89.043zM267.13 0h89.044v489.739H267.13z"/>
</svg>
);

export default wrapSvgPath(SimulatorPath);
