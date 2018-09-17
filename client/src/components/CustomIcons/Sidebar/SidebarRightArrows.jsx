import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 20 15') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SidebarRightArrows = (
  <svg width="15" height="10" >
    <image
      id="Arrow"
      width="15"
      height="10"
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAKCAMAAABcxfTLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABZVBMVEVktb1VqMBAmsBMpL6H0rphs75Tp8BCnL8wkb8dh8BCnMA9mr9Hpb12xrp6yboykr8XgsAxlL90xbtywbxjtL0Uf8BFo755x7xgsr5UqMAli79htL1Sp8BxwbxEnsAPe8FTq75mtb0iicBSrL1luL1is74ji8BovLuE0LtxwL1BnMA2lL9qvryCz7lTqMBDncBtv7uAzbp7yrpywrx8y7p6ybtwwL16ybpywbxktb1VqMB9y7twwL1hs75ywbxjtL1VqMBEnsBxwb1gsr5Tp8BCnL9UqMBEnsA0k78hicBSp8BCnL8wkb8dh8BEnsA0k78hicAbhMBCnL8wkb8dh8A0k78hicAchMAwkb8dh8BEnsA0k78dh8BCnL8wkb8dh8BjtL1UqMBEnsAxkb9gsr5Sp8BCnL8wkb9xwbxjtL1UqMB6ybtvv71gsr5Rp8B6ybpxwLxis716yrp6ybtuv71gsb4AAADEI2tpAAAAdnRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADI1Az0nLHtlBzqBUwdUhjIPZH0jH3xlDDKDUwMBWGgHDWlWHYARN3RChjRUgSQYcXMYJHxkEEiDQwVYfzFRbhcIYmAKtCLRtwAAAAFiS0dEdjFjyUEAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfiBxEJBx3uSz1SAAAAl0lEQVQI12MwMmZgZGJmMTE1Y2Vj5+BkMLewtOLi5uG1trEF8/ns7B0c+QUEhZycXVxBfGERN3cPT1ExcQkvbx9fEF/Szz8gUEqaQSYoOISBT1ZEUi40LFxeQVGGPSISzI+KjlFSVlGViY2LB/ITEpOS1dQ1NFNS09KB5mVkZmlp6+hm5+TmgezLLyjU0zcwLCouKZUB8gGFchzKY/niRwAAAABJRU5ErkJggg=="
    />
  </svg>
);

export default wrapSvgPath(SidebarRightArrows);
