import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const MarketPath = (
  <svg viewBox="0 0 32.43 27.93">
   <g data-name="Layer 2">
    <g data-name="Layer 1">
      <circle cx="12.15" cy="25.57" r="2.97" className="cls-1"/>
      <circle cx="24.09" cy="25.57" r="2.97" className="cls-1"/>
      <path d="M5.45 6.33L30.82 6.33 27.89 19.3 8.38 19.3 4.02.51.02.65M6.2 10.63L30.01 10.63M7.38 15L28.86 15" className="cls-1"/>
    </g>
  </g>
  </svg>
);
const MarketIcon = MarketPath;
export default wrapSvgPath(MarketIcon);
