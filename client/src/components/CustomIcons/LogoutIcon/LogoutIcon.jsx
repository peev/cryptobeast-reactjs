import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 20.96 22.5') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const LogoutIcon = (
  <React.Fragment>
    <defs>
      <linearGradient
        id="linear-gradient-5"
        x1="11.94"
        y1="11.25"
        x2="20.96"
        y2="11.25"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#7ac9b9" />
        <stop offset="1" stopColor="#0881be" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-6"
        x2="7.09"
        xlinkHref="#linear-gradient-5"
      />
      <linearGradient
        id="linear-gradient-7"
        x1="0.38"
        x2="13.37"
        xlinkHref="#linear-gradient-5"
      />
    </defs>
    <g>
      <g>
        <path className="cls-11" d="M11.94.38h8.65v21.75h-8.65" />
        <path className="cls-12" d="M6.88 16.48l-5.67-3.8a1.64 1.64 0 0 1 0-2.85L6.88 6" />
        <path className="cls-13" d="M.38 11.25h12.99" />
      </g>
    </g>
  </React.Fragment>
);

export default wrapSvgPath(LogoutIcon);
