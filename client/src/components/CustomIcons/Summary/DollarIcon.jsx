import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 115 120') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const DollarIcon = (
  <svg viewBox="0 0 79.536 79.536">
    <path d="M36.081 60.766V42.145c-6.892-1.662-11.94-4.173-15.159-7.537-3.213-3.366-4.826-7.449-4.826-12.249 0-4.868 1.82-8.951 5.456-12.252 3.643-3.304 8.479-5.209 14.529-5.706V0h7.643v4.401c5.588.557 10.036 2.162 13.334 4.821 3.309 2.651 5.411 6.198 6.333 10.641l-13.344 1.468c-.803-3.5-2.915-5.864-6.323-7.109v17.38c8.436 1.926 14.184 4.422 17.233 7.498 3.065 3.065 4.588 6.996 4.588 11.801 0 5.364-1.927 9.89-5.773 13.561-3.843 3.682-9.202 5.93-16.048 6.758v8.316h-7.643v-8.088C30 70.815 25.062 68.905 21.267 65.7c-3.798-3.2-6.219-7.716-7.275-13.551l13.756-1.248c.562 2.366 1.616 4.422 3.169 6.136 1.542 1.724 3.267 2.967 5.164 3.729zm0-46.682c-2.079.598-3.733 1.61-4.958 3.027-1.225 1.421-1.846 2.99-1.846 4.714 0 1.569.557 3.027 1.688 4.373 1.124 1.359 2.825 2.439 5.111 3.267V14.084h.005zm7.643 47.308c2.631-.409 4.774-1.439 6.422-3.086 1.656-1.657 2.479-3.583 2.479-5.81 0-1.979-.698-3.697-2.076-5.137-1.388-1.43-3.661-2.538-6.825-3.294v17.327z" data-original="#010002" className="active-path" data-old_color="#ffffff" fill="#fff" />
  </svg>
);

export default wrapSvgPath(DollarIcon);
