import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(ticker, alpha, Rsq, adjR, variance) {
  id += 1;
  return {
    id, ticker, alpha, Rsq, adjR, variance,
  };
}

const data = [
  createData('BTC', `${0.0000  }%`, 0.71286, 0.71015, 0.00350),
  createData('ETH', `${0.0012  }%`, 0.71286, 0.71015, 0.00350),
  createData('XRP', `${0.0012  }%`, 0.71286, 0.71015, 0.00350),
  createData('NEO', `${0.0012  }%`, 0.71286, 0.71015, 0.00350),
  createData('XRP', `${0.0012  }%`, 0.71286, 0.71015, 0.00350),
  createData('NEO', `${0.0012  }%`, 0.71286, 0.71015, 0.00350),

];

function VolatilityTable(props) {
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
          {data.map(n => (
            <TableRow key={n.id}>
              <TableCell>{n.ticker}</TableCell>
              <TableCell numeric>{n.alpha}</TableCell>
              <TableCell numeric>{n.Rsq}</TableCell>
              <TableCell numeric>{n.adjR}</TableCell>
              <TableCell numeric>{n.variance}</TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

VolatilityTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VolatilityTable);
