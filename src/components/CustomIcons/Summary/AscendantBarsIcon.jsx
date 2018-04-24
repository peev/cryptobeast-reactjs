import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
    <svg viewBox="0 0 512 512">
    <path d="M512 480v32H0V0h32v480h480zM228.906 177.719l130.719 32.656L404.875 135l41 24.625L448 32 336.406 93.938l41 24.625-33.031 55.063-125.281-31.344L84.688 276.688l22.625 22.625 121.593-121.594zM192 448h64V217.469l-17.281-4.312L192 259.875V448zM96 333.25V448h64V291.875l-52.688 52.688L96 333.25zM384 232v216h64V198.219l-32.156-19.281L384 232zm-32 216V241.469l-64-16V448h64z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
  </svg>
);

export default wrapSvgPath(SimulatorPath);
