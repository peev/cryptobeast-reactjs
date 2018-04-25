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
  tableCell: {
    paddingRight: '18px',
    borderBottom: 'none',
  },
});

class Trending extends Component {
  state = {};

  render() {
    const { classes, tableHead } = this.props;

    const tableHeader = (
      <TableHead>
        <TableRow>
          {tableHead.map((prop, key) => (
            <TableCell
              className={classes.tableCell}
              key={key}
            >
              {prop}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );

    return (
      <Grid container className={classes.container}>
        <Grid item xs={6} sm={6} md={6}>
          <p>Best Performing Assets</p>

          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeader : null}
            {/* <TableBody>{tableInfo}</TableBody> */}
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </Table>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <p>Worst Performing Assets</p>
          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeader : null}
            {/* <TableBody>{tableInfo}</TableBody> */}
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Trending);
