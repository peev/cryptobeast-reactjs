import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    backgroundColor: '#FFFFFF',
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

Portfolio.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHead: PropTypes.array.isRequired,
};

export default withStyles(styles)(Portfolio);
