// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

import uuid from 'uuid/v4';

const styles = (theme: Object) => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
  },
  table: {
    tableLayout: 'auto'
  },
  center: {
    textAlign: 'center'
  },
  right: {
    textAlign: 'right'
  },
  bigMarginLeft: {
    marginLeft: '22px'
  },
  smallPaddingTop: {
    paddingTop: '15px'
  }
});

const data = [
  { ticker: 'BTC', alpha: `${0.0000}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
  { ticker: 'ETH', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
  { ticker: 'XRP', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
  { ticker: 'NEO', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
  { ticker: 'XRP', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
  { ticker: 'NEO', alpha: `${0.0012}%`, Rsq: 0.71286, adjR: 0.71015, variance: 0.00350 },
];

type Props = {
  classes: Object,
};

function ProfitLossTable(props: Props) {
  const { classes, asc } = props;
  return (
    <Paper className={[classes.root, classes.smallPaddingTop].join(' ')}>
      <label className={classes.bigMarginLeft}>{asc ? 'BEST PERFORMING COINS' : 'WORST PERFORMING COINS'}</label>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>COIN</TableCell>
            <TableCell className={classes.right}>MONTH</TableCell>
            <TableCell className={classes.right}>MARKET CAP DIFF</TableCell>
            <TableCell className={classes.right}>MARKET CAP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((ROW: Object) => (
            <TableRow key={uuid()}>
              <TableCell>{ROW.ticker}</TableCell>
              <TableCell numeric>{ROW.alpha}</TableCell>
              <TableCell numeric>{ROW.Rsq}</TableCell>
              <TableCell numeric>{ROW.adjR}</TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(ProfitLossTable);
