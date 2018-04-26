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
import { inject, observer } from 'mobx-react';

const styles = () => ({
  container: {
    width: '100%',
    margin: '0',
    backgroundColor: '#FFFFFF',
  },
  tableCell: {
    paddingRight: '18px',
    borderBottom: 'none',
  },
});

@inject('PortfolioStore')
@observer
class Trending extends Component {
  state = {};

  render() {
    const { classes, tableHead, PortfolioStore } = this.props;
    const array = PortfolioStore.currentMarketSummaryPercentageChange;
    const topFive = array.slice(0, 5);
    const lastFive = array.slice(array.length - 5).reverse();

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

    const tableBodyTopFive = topFive.map((prop, key) => (
      <TableRow key={key}>
        {prop.map((item, ind) => {

          console.log(item);
          if (ind === 1) {
            return (
              <TableCell className={classes.tableCell} key={ind}>
                {item}
              </TableCell>
            );
          }

          return (
            <TableCell className={classes.tableCell} key={ind}>
              {item}
            </TableCell>
          );
        })}
      </TableRow>
    ));

    const tableBodyLastFive = lastFive.map((prop, key) => (
      <TableRow key={key}>
        {prop.map((item, ind) => {

          console.log(item);

          return (
            <TableCell className={classes.tableCell} key={ind}>
              {item}
            </TableCell>
          );
        })}
      </TableRow>
    ));

    return (
      <Grid container className={classes.container}>
        <Grid item xs={6} sm={6} md={6}>
          <p>Best Performing Assets</p>

          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeader : null}
            <TableBody>{tableBodyTopFive}</TableBody>
          </Table>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <p>Worst Performing Assets</p>
          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeader : null}
            <TableBody>{tableBodyLastFive}</TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Trending);
