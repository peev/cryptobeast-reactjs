// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid/v4';
import AssetStore from '../../stores/AssetStore';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

// const data = [
//   { ticker: 'BTC', alpha: `${0.0000}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
//   { ticker: 'ETH', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
//   { ticker: 'XRP', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
//   { ticker: 'NEO', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
//   { ticker: 'XRP', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
//   { ticker: 'NEO', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
// ];

type Props = {
  classes: Object,
};

function VolatilityTable(props: Props) {
  const { classes } = props;
  const data = AssetStore.assetsVariance;
  console.log(data);
  
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>TICKER</TableCell>
            <TableCell className={classes.right}>ALPHA</TableCell>
            <TableCell className={classes.right}>R^2</TableCell>
            <TableCell className={classes.right}>ADJUSTED R</TableCell>
            <TableCell className={classes.right}>EST.VARIANCE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((ROW: Object) => (
            <TableRow key={uuid()}>
              <TableCell>{ROW.ticker}</TableCell>
              <TableCell numeric>{ROW.alpha}</TableCell>
              <TableCell numeric>{ROW.rsq}</TableCell>
              <TableCell numeric>{ROW.adjR}</TableCell>
              <TableCell numeric>{ROW.variance}</TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(VolatilityTable);
