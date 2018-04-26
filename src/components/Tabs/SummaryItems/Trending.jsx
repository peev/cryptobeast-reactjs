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
import { inject, observer } from 'mobx-react';
import UpArrowIcon from '../../CustomIcons/Summary/UpArrowIcon';
import DownArrowIcon from '../../CustomIcons/Summary/DownArrowIcon';

const styles = () => ({
  container: {
    width: '100%',
    margin: '0',
    backgroundColor: '#FFFFFF',
  },
  containerTable: {
    textAlign: 'center',
  },
  tableCell: {
    paddingRight: '18px',
    paddingLeft: '18px',
    borderBottom: 'none',
  },
  upArrow: {
    paddingTop: '7px',
    fill: '#0eff00',
  },
  downArrow: {
    paddingTop: '7px',
    fill: '#ca3f58',
  },
  change: {
    margin: '0',
    display: 'inline-block',
    verticalAlign: 'text-bottom',
  },
  titleBest: {
    marginTop: '0',
    color: '#0eff00',
  },
  titleWorst: {
    marginTop: '0',
    color: '#ca3f58',
  },
});

@inject('PortfolioStore')
@observer
class Trending extends Component {
  state = {};

  render() {
    const { classes, tableHead, PortfolioStore } = this.props;
    const array = PortfolioStore.currentMarketSummaryPercentageChange;
    const fistItems = array.slice(0, 4);
    const lastItems = array.slice(array.length - 4).reverse();

    const tableHeaderGeneral = (
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

    const tableBodyFirstItems = fistItems.map((prop, key) => (
      <TableRow key={key}>
        {prop.map((item, ind) => {
          if (ind > 0) {
            return (
              <TableCell className={classes.tableCell} key={ind} >
                <UpArrowIcon className={classes.upArrow} />
                <p className={classes.change}> {`${item}%`}</p>
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

    const tableBodyLastItems = lastItems.map((prop, key) => (
      <TableRow key={key}>
        {prop.map((item, ind) => {
          if (ind > 0) {
            return (
              <TableCell className={classes.tableCell} key={ind} >
                <DownArrowIcon className={classes.downArrow} />
                <p className={classes.change}> {`${item}%`}</p>
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

    return (
      <Grid container className={classes.container}>
        <Grid item xs={6} sm={6} md={6} className={classes.containerTable}>
          <p className={classes.titleBest}>Best Performing Assets</p>

          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeaderGeneral : null}
            <TableBody>{tableBodyFirstItems}</TableBody>
          </Table>
        </Grid>

        <Grid item xs={6} sm={6} md={6} className={classes.containerTable}>
          <p className={classes.titleWorst}>Worst Performing Assets</p>
          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeaderGeneral : null}
            <TableBody>{tableBodyLastItems}</TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

Trending.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHead: PropTypes.array.isRequired,
  PortfolioStore: PropTypes.object,
};

export default withStyles(styles)(Trending);
