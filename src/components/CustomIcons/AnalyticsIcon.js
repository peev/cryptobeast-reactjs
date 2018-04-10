import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const AnalyticsPath = (
  <svg viewBox="0 0 32.43 30.93">
   <g data-name="Layer 2">
    <g data-name="Layer 1">
      <path d="M26.78,17.88H13.64V4.74A13.14,13.14,0,1,0,26.78,17.88Z" className="cls-1"/>
      <path d="M29.86,13.64H16.72V.5A13.14,13.14,0,0,1,29.86,13.64Z" className="cls-1"/>
    </g>
  </g>
  </svg>
);
const AnalyticsIcon = AnalyticsPath;
export default wrapSvgPath(AnalyticsIcon);
