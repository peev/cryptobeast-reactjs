import React from 'react';
import { shallow } from 'enzyme';
import TransactionHistory from './../TransactionHistory';

describe('Views/TransactionHistory.jsx', () => {
  const transactionHistory = shallow(<TransactionHistory />);

  it('should render without crashing', () => {
    expect(transactionHistory).toMatchSnapshot();
  });
});
