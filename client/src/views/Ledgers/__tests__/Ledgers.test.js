import React from 'react';
import { shallow } from 'enzyme';
import Ledgers from './../Ledgers';

describe('Views/Ledgers.jsx', () => {
  const ledgers = shallow(<Ledgers />);

  it('should render without crashing', () => {
    expect(ledgers).toMatchSnapshot();
  });
});
