import React from 'react';
import { shallow } from 'enzyme';
import Analytics from './../Analytics';

describe('Views/Analytics.jsx', () => {
  const analytics = shallow(<Analytics />);

  it('should render without crashing', () => {
    expect(analytics).toMatchSnapshot();
  });
});
