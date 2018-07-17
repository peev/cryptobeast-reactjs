import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 24 24') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const InvestorsIcon = (
  <svg>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path className="cls-1" d="M20.1,15.66s.66-1.81-.28-2.89c0,0-.2-.48-3.59-1.29a3.09,3.09,0,0,1-1.89-1.12,5.38,5.38,0,0,0,1.73-3.67S16.43,2.92,13,3C9.5,2.92,9.86,6.69,9.86,6.69a5.38,5.38,0,0,0,1.73,3.67,3.09,3.09,0,0,1-1.89,1.12c-3.39.81-3.59,1.29-3.59,1.29-.95,1.08-.28,2.89-.28,2.89" />
        <path className="cls-1" d="M15,3.1A2.79,2.79,0,0,1,18.09.5C21.56.4,21.2,4.17,21.2,4.17a5.39,5.39,0,0,1-1.73,3.67A3.08,3.08,0,0,0,21.35,9c3.39.82,3.59,1.29,3.59,1.29.94,1.08.28,2.89.28,2.89" />
        <path className="cls-1" d="M.72,13.14S.06,11.33,1,10.25c0,0,.2-.48,3.59-1.29A3.09,3.09,0,0,0,6.49,7.84,5.36,5.36,0,0,1,4.75,4.17S4.4.4,7.86.5a2.77,2.77,0,0,1,3,2.53" />
      </g>
    </g>
  </svg>
);

export default wrapSvgPath(InvestorsIcon);
