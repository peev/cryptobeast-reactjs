// @flow
import React from 'react';
import { withStyles, Grid } from 'material-ui';

import { ItemGrid } from './../../components';
import TradeHistory from '../../components/Cards/History/TradeHistory';
import NotificationSnackbar from '../../components/Modal/NotificationSnackbar';


const style = {
  typo: {
    paddingLeft: '25%',
    marginBottom: '40px',
    position: 'relative',
  },
  note: {
    fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
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
const TransactionHistory = ({ classes }: Object) =>
  (<Grid container>
      <ItemGrid xs={12} sm={12} md={12}>
        <p>FILTERS</p>
      </ItemGrid>
      <Grid container className={classes.itemsCardPosition}>
      <Grid item xs={12} sm={12} md={12}>
        <TradeHistory />
      </Grid>
      </Grid>
      <NotificationSnackbar />
   </Grid>);


export default withStyles(style)(TransactionHistory);
