import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 141.42 123.77') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const Logo = (
  <React.Fragment>
    <defs>
      <linearGradient
        id="linear-gradient"
        x1="-3365.95"
        y1="1444.56"
        x2="-3290.59"
        y2="1444.56"
        gradientTransform="rotate(90 -934.73 2479.63)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#133140" />
        <stop offset="1" stopColor="#3c787e" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-2"
        x1="-3414.36"
        y1="1434.36"
        x2="-3290.6"
        y2="1434.36"
        gradientTransform="rotate(90 -934.73 2479.63)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#3c787e" />
        <stop offset="1" stopColor="#133140" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-3"
        x1="7926.68"
        y1="5266.8"
        x2="8002.04"
        y2="5266.8"
        gradientTransform="rotate(-90 1388.15 6613.89)"
        xlinkHref="#linear-gradient"
      />
      <linearGradient
        id="linear-gradient-4"
        x1="7878.26"
        y1="5256.56"
        x2="8002.03"
        y2="5256.56"
        gradientTransform="rotate(-90 1388.15 6613.89)"
        xlinkHref="#linear-gradient-2"
      />
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className="cls-3"
          d="M79.65,123.77V93.27a31.29,31.29,0,0,0,28.17-44.85A44.28,44.28,0,0,1,121,80.22c0,23.62-17.93,42.85-40.44,43.54Z"
        />
        <path
          className="cls-4"
          d="M80.46,123.76C103,123.07,121,103.84,121,80.22a44.21,44.21,0,0,0-13.12-31.81,31.78,31.78,0,0,0-28.23-17.9V0a61.89,61.89,0,0,1,.81,123.76Z"
        />
        <path
          className="cls-5"
          d="M61.65,0V30.51c-16,0-31.14,14-31.14,31.38a31.36,31.36,0,0,0,3.15,13.47A44.26,44.26,0,0,1,20.48,43.55C20.48,19.93,38.3.71,60.81,0Z"
        />
        <path
          className="cls-6"
          d="M61.08,0c-22.5.7-40.54,19.93-40.54,43.54,0,12.55,5.3,21.72,13,31.81a31.6,31.6,0,0,0,28.11,17.9v30.51C28.65,123.77,0,96.07,0,61.89A62.06,62.06,0,0,1,61.08,0Z"
        />
      </g>
    </g>
  </React.Fragment>
);

export default wrapSvgPath(Logo);
