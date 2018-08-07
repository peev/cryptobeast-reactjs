import React from 'react';
import { shallow } from 'enzyme';
import Investors from './../Investors';

describe('Views/Investors.jsx', () => {
  const investors = shallow(<Investors />);

  it('should render without crashing', () => {
    expect(investors).toMatchSnapshot();
  });
});
