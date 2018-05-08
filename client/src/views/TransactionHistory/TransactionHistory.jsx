import React from 'react';
import { withStyles, Grid } from 'material-ui';

import { ItemGrid } from './../../components';


const style = {
  typo: {
    paddingLeft: '25%',
    marginBottom: '40px',
    position: 'relative',
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: '10px',
    color: '#c0c1c2',
    display: 'block',
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '13px',
    left: '0',
    marginLeft: '20px',
    position: 'absolute',
    width: '260px',
  },
};
function TransactionHistory() {
  return (
    <Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <p>Transaction History is under construction...</p>
      </ItemGrid>
    </Grid>
  );
}

export default withStyles(style)(TransactionHistory);
