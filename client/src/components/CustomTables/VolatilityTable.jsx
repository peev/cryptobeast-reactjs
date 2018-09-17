// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid/v4';

const styles = (theme: Object) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
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

function VolatilityTable(props: Props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>TICKER</TableCell>
            <TableCell numeric>ALPHA</TableCell>
            <TableCell numeric>R^2</TableCell>
            <TableCell numeric>ADJUSTED R</TableCell>
            <TableCell numeric>EST.VARIANCE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((ROW: Object) => (
            <TableRow key={uuid()}>
              <TableCell>{ROW.ticker}</TableCell>
              <TableCell numeric>{ROW.alpha}</TableCell>
              <TableCell numeric>{ROW.Rsq}</TableCell>
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
