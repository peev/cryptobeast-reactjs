import React from 'react';
import { Grid } from 'material-ui';
import { ItemGrid } from 'components';



function Simulator({ ...props }) {
  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <p>Simulator is under construction...</p>
      </ItemGrid>
    </Grid>
  );
}

export default Simulator;
