import React from 'react';
import { shallow } from 'enzyme';
import Summary from './../Summary';

describe('Views/Summary.jsx', () => {
  const summary = shallow(<Summary />);

  it('should render without crashing', () => {
    expect(summary).toMatchSnapshot();
  });
});
