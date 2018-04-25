import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';

const styles = () => ({
  container: {
    width: '100%',
    color: 'red',
  },
});

class Portfolio extends Component {
  state = {};

  render() {
    const { classes, tableHead } = this.props;

    const tableHeader = (
      <TableHead>
        <TableRow>
          {tableHead.map((prop, key) => (
            <TableCell
              className={`${classes.tableCell} ${classes.tableHeadCell}`}
              key={key}
            >
              {prop}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    return (
      <Grid container>
        <Table className={classes.table}>
          {tableHead !== undefined ? tableHeader : null}
          {/* <TableBody>{tableInfo}</TableBody> */}
        </Table>
      </Grid>
    );
  }
}

export default withStyles(styles)(Portfolio);
