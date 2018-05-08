import React from 'react';
import { shallow } from 'enzyme';
import Settings from './../Settings';

describe('Views/Settings.jsx', () => {
  const settings = shallow(<Settings />);

  it('should render without crashing', () => {
    expect(settings).toMatchSnapshot();
  });
});
