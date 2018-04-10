import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";

  
const wrapSvgPath = (path, viewBox = "0 0 24 24") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const LedgersPath = (
  <svg viewBox="0 0 32.43 27.93">
   <g data-name="Layer 2">
    <g data-name="Layer 1">
      <path d="M.5.89H6.6V29.44H.5zM10.3.89H16.4V29.44H10.3z" class="cls-1"/>
      <path d="M21.74 0.79H27.839999999999996V29.34H21.74z" class="cls-1" transform="translate(-3.77 9.96) rotate(-21.16)"/>
      <path d="M.57 21.52L6.67 21.52M.5 25.29L6.6 25.29M10.44 21.52L16.55 21.52M10.3 25.29L16.4 25.29M24.69 22.62L30.38 20.41M25.72 26.32L31.41 24.12" class="cls-1"/>
      <circle cx="3.55" cy="4.3" r="1.39" class="cls-2"/>
      <circle cx="13.35" cy="4.3" r="1.39" class="cls-2"/>
      <circle cx="20.78" cy="4.7" r="1.39" class="cls-2"/>
    </g>
  </g>
  </svg>
);
const LedgersIcon = LedgersPath;
export default wrapSvgPath(LedgersIcon);
