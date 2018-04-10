import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const InvestorsPath = (
  <svg viewBox="0 0 32.43 27.93">
  <g data-name="Layer 2">
    <g data-name="Layer 1">
      <path d="M31.47 14.27L23.51 19.62 19.66 22.2 19.66 22.21 12.03 27.33 0.93 20.21 3.72 18.44 12.03 23.77 19.66 18.64 19.9 18.49 19.9 21.79 23.28 19.5 23.32 16.19 23.53 16.05 28.59 12.65 31.47 14.27z" class="cls-1"/>
      <path d="M23.55 12.2L23.53 16.05 23.32 16.19 23.36 12.6 19.9 14.91 19.9 18.49 19.66 18.64 12.03 23.77 3.72 18.44 0.93 16.66 3.94 14.75 6.73 16.54 12.03 19.93 19.74 14.75 23.55 12.2z" class="cls-1"/>
      <path d="M31.47 10.72L28.59 12.65 23.53 16.05 23.55 12.2 25.48 10.9 28.36 8.97 31.47 10.72zM19.74 14.75L12.03 19.93 6.73 16.54 3.94 14.75.93 12.82 8.57 7.97 8.58 7.97 11.67 9.85 14.54 11.59 19.74 14.75z" class="cls-1"/>
      <path d="M25.48 10.9L23.55 12.2 19.74 14.75 14.54 11.59 11.67 9.85 8.58 7.97 12.52 5.48 15.61 7.36 18.47 9.09" class="cls-1"/>
      <path d="M18.47 9.09L15.61 7.36 12.52 5.48 20.25.58 31.47 6.88 28.36 8.97 25.48 10.9M23.51 12.15L18.48 9.09" class="cls-1"/>
    </g>
  </g>
  </svg>
);
const InvestorsIcon = InvestorsPath;
export default wrapSvgPath(InvestorsIcon);
