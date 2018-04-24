import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
<svg xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" className="">
<g>
    <g>
	<g>
		<polygon points="298.667,0 42.667,0 42.667,42.667 181.333,170.667 42.667,298.667 42.667,341.333 298.667,341.333     298.667,277.333 149.333,277.333 256,170.667 149.333,64 298.667,64   " data-original="#000000" className="active-path" data-old_color="#FBFBFB" fill="#FDFDFD"/>
	</g>
</g>
</g> 
</svg>
);

export default wrapSvgPath(SimulatorPath);
