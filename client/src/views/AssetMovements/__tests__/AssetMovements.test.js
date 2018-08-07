import React from 'react';
import { shallow } from 'enzyme';
import AssetMovements from './../AssetMovements';

describe('Views/AssetMovements.jsx', () => {
  const assetMovements = shallow(<AssetMovements />);

  it('should render without crashing', () => {
    expect(assetMovements).toMatchSnapshot();
  });
});
