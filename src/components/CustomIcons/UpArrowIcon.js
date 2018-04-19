import React from "react";
import pure from "recompose/pure";
import SvgIcon from "material-ui/SvgIcon";
import "./icon.css";


const wrapSvgPath = (path, viewBox = "0 0 15 20") => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
    <path id="up_arrow" data-name="up arrow" d="M1070.38,804V795.61H1074L1067,788l-7,7.612h3.62V804h6.76Z" transform="translate(-1060 -788)" />
  </svg>
);

export default wrapSvgPath(SimulatorPath);