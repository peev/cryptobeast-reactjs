import React from 'react';
import { shallow } from 'enzyme';
import Settings from './../Settings';

describe('Views/Settings.jsx', () => {
  const props = {
    MarketStore: jest.fn(),
  };
  const settings = shallow(<Settings {...props} />);

  it('should render without crashing', () => {
    expect(settings).toMatchSnapshot();
  });
});
