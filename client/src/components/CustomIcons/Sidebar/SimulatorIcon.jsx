import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 21 21') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path className="cls-1" d="M1.24,12.39a.75.75,0,0,0-.53,1.27L6,19a5.47,5.47,0,0,0,3.9,1.62,4.5,4.5,0,0,0,4.5-4.5v-7a.82.82,0,0,0-1.64,0v2a.41.41,0,1,1-.82,0V8.3a.82.82,0,1,0-1.64,0v2.86a.41.41,0,1,1-.82,0V7.48a.82.82,0,0,0-1.64,0v3.68a.41.41,0,1,1-.82,0V3.39a.82.82,0,0,0-1.64,0V13.62a.41.41,0,0,1-.59.37L2,12.56a1.65,1.65,0,0,0-.73-.17Z" />
        <path className="cls-1" d="M2.64,4.88C2.64,2.46,4.27.5,6.26.5s3.62,2,3.62,4.38" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(SimulatorIcon);
