import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import '../icon.css';


const wrapSvgPath = (path, viewBox = '0 0 21 15') => props => (
  <SvgIcon {...props} viewBox={viewBox}>
    {path}
  </SvgIcon>
);

const SidebarLeftArrows = (
  <svg
    width="16"
    height="10"
  >
    <image
      id="arrow"
      width="16"
      height="10"
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABSlBMVEUdh8AukMBAmr9OpMBdr76Bz7pkuLs5lb9IocBYqr+D0Llbs7wli8B7yrpru71+zLtXr7wZgsFywrtsvb1NqL4YgsBltr1rvL0ehcAchcA6lr9svL04mb8XgcB6yLw+nb4WgMF4yLyAzrlCob4gh8CAzrpQqr04lL98y7p5yLpqu712xrx6yrpltr1ywrt7yrpOpMBdr75qu712xrxIocBYqr9ltr1ywrsukMBAmr9OpMBdr746lr9IocBltr0dh8AukMBAmr9OpMAchcAojcA6lr9IocAdh8AukMAdhsAojcAdh8AukMBAmr8ehsAojcA6lr8ukMBAmr9OpMAojcA6lr9IocBYqr9Amr9OpMBdr75qu706lr9IocBYqr9ltr1ywrtdr75qu712xrx8y7pYqr9ltr17yrpqu712xrx7yrpywrt7yroAAAAl/dnjAAAAbXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAeyYkd0kcdXMfA1yBPQtUiTkzhA8gfmIHBmZ7InNFSXNRchgrgDBIhUssfWkNF2x8JQdJi0QDNIFiDxJwKwdKGToymRdvIAAAAAFiS0dEbbsGAK0AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQfiBxEJCiQE4MsXAAAAnklEQVQI12NgYGRiZtHS1mFlY+fg1NXTZwAKGBgaGXNx87CbmJqZ8zIwWFhaWfPxCwjy2Nia2gnxMtg7ODqxCIuIOru4unGKAQXcPYBmiEtIenpJcYAFvH18mVmkZWT9/AMgAgyBQcEs4nLyCiGhYeFgAcaIyKhoRSVllZjYuPgEkAATc2JScoqqmjpHappeOliAJSMzS0MT6DCx7BwAInUY8TKc1aAAAAAASUVORK5CYII="
    />
  </svg>
);

export default wrapSvgPath(SidebarLeftArrows);
