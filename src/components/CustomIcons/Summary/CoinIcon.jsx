import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 15 20') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SimulatorPath = (
    <svg viewBox="0 0 401.601 401.6">
    <path d="M116.682 229.329c11.286 0 22.195-.729 32.518-2.086V114.094c-10.322-1.356-21.232-2.085-32.518-2.085C52.241 112.009.001 135.702.001 164.93v11.477c0 29.227 52.24 52.922 116.681 52.922zM116.682 288.411c11.286 0 22.195-.729 32.518-2.084v-33.166c-10.325 1.356-21.229 2.095-32.518 2.095-56.25 0-103.199-18.054-114.227-42.082-1.606 3.5-2.454 7.124-2.454 10.839v11.477c0 29.228 52.24 52.921 116.681 52.921zM149.199 314.823v-2.578c-10.325 1.356-21.229 2.095-32.518 2.095-56.25 0-103.199-18.054-114.227-42.082C.848 275.757 0 279.381 0 283.096v11.477c0 29.229 52.24 52.922 116.681 52.922 12.887 0 25.282-.95 36.873-2.7-2.873-5.877-4.355-12.075-4.355-18.496v-11.476zM284.92 22.379c-64.441 0-116.681 23.693-116.681 52.921v11.477c0 29.228 52.24 52.921 116.681 52.921 64.44 0 116.681-23.693 116.681-52.921V75.3c0-29.228-52.241-52.921-116.681-52.921z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
    <path d="M284.92 165.626c-56.25 0-103.199-18.053-114.227-42.082-1.606 3.499-2.454 7.123-2.454 10.839v11.477c0 29.228 52.24 52.921 116.681 52.921 64.44 0 116.681-23.693 116.681-52.921v-11.477c0-3.716-.848-7.34-2.454-10.839-11.028 24.029-57.977 42.082-114.227 42.082z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
    <path d="M284.92 224.71c-56.25 0-103.199-18.054-114.227-42.082-1.606 3.499-2.454 7.123-2.454 10.839v11.477c0 29.229 52.24 52.922 116.681 52.922 64.44 0 116.681-23.693 116.681-52.922v-11.477c0-3.716-.848-7.34-2.454-10.839-11.028 24.029-57.977 42.082-114.227 42.082z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
    <path d="M284.92 286.983c-56.25 0-103.199-18.054-114.227-42.082-1.606 3.5-2.454 7.123-2.454 10.838v11.478c0 29.228 52.24 52.921 116.681 52.921 64.44 0 116.681-23.693 116.681-52.921v-11.478c0-3.715-.848-7.34-2.454-10.838-11.028 24.027-57.977 42.082-114.227 42.082z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
    <path d="M284.92 346.066c-56.25 0-103.199-18.053-114.227-42.081-1.606 3.5-2.454 7.125-2.454 10.838V326.3c0 29.228 52.24 52.921 116.681 52.921 64.44 0 116.681-23.693 116.681-52.921v-11.478c0-3.715-.848-7.34-2.454-10.838-11.028 24.028-57.977 42.082-114.227 42.082z" data-original="#000000" className="active-path" data-old_color="#ffffff" fill="#fff"/>
  </svg>
);

export default wrapSvgPath(SimulatorPath);
