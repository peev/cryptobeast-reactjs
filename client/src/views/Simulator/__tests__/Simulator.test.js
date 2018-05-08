import React from 'react';
import { shallow } from 'enzyme';
import Simulator from './../Simulator';

describe('Views/Simulator.jsx', () => {
  const simulator = shallow(<Simulator />);

  it('should render without crashing', () => {
    expect(simulator).toMatchSnapshot();
  });
});
