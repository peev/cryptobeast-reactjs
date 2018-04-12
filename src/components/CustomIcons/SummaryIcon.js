import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SummaryPath = (
  <svg viewBox="0 0 32.43 27.93">
    <g data-name="Layer 2">
      <g data-name="Layer 1">
        <circle cx="11" cy="11" r="10" className="cls-1" fill="none"  />
        <path fill="#000" d="M8 4a7 7 0 0 1 5 0m5 14l4 4" className="cls-1" />
        <path fill="#000" d="M20 22l2-2 10 11-1 1z" className="cls-2" />
      </g>
    </g>
  </svg>
);
const SummaryIcon = SummaryPath;
export default wrapSvgPath(SummaryIcon);
