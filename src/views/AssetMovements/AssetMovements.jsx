import React from 'react';
import { Grid } from 'material-ui';
import AssetInput from '../../components/Cards/Assets/AssetInput';
import AssetAllocation from '../../components/Cards/Assets/AssetAllocation';
import AssetsTable from '../../components/CustomTables/AssetsTable';

class AssetMovements extends React.Component {
  state = {
    direction: 'row',
  };

  render() {
    return (
      <div>
        <Grid container>
          <AssetInput />

          <AssetAllocation />

          <AssetsTable />
        </Grid>
      </div>
    );
  }
}

export default AssetMovements;
