import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const HistoryPath = (
  <svg viewBox="0 0 32.43 27.93">
    <g data-name="Layer 2">
    <g data-name="Layer 1">
      <path d="M7.79 2.9a14.42 14.42 0 1 1-6.55 8M22.61 17.55L14.13 17.55 14.13 9.07" className="cls-1"/>
      <path d="M3.98 6.34L6.22 0 10.36 6.1 3.98 6.34z" className="cls-2"/>
    </g>
  </g>
  </svg>
);
const HistoryIcon = HistoryPath;
export default wrapSvgPath(HistoryIcon);
