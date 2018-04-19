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
    <path id="up_arrow_copy" data-name="up arrow copy" d="M1204.62,788v8.392H1201l7,7.611,7-7.611h-3.62V788h-6.76Z" transform="translate(-1201 -788)" />
  </svg>
);

export default wrapSvgPath(SimulatorPath);