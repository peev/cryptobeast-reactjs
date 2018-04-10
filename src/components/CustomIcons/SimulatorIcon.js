import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
  <svg viewBox="0 0 32.43 27.93">
 <g data-name="Layer 2">
    <g data-name="Layer 1">
      <path d="M0 2.46L30.03 2.46M0 13.24L30.03 13.24M0 24.02L30.03 24.02" className="cls-1"/>
      <circle cx="7.17" cy="2.46" r="2.46" className="cls-2"/>
      <circle cx="22.85" cy="13.24" r="2.46" className="cls-2"/>
      <circle cx="10.82" cy="24.02" r="2.46" className="cls-2"/>
    </g>
  </g>
  </svg>
);
const SimulatorIcon = SimulatorPath;
export default wrapSvgPath(SimulatorIcon);
