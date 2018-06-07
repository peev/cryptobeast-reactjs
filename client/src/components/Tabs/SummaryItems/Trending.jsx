// @flow
import React from 'react';
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';
import uuid from 'uuid/v4';
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
  tableCellHead: {
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tableCell: {
    paddingRight: '10px !important',
    paddingLeft: '10px',
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
    color: '#3ab693',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  titleWorst: {
    marginTop: '0',
    color: '#eb4562',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
});

type Props = {
  classes: Object,
  tableHeader: Array<>,
  PortfolioStore: Object,
};

const Trending = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, tableHead, PortfolioStore } = props;
  const array = PortfolioStore.currentMarketSummaryPercentageChange || [];
  const fistItems = array.slice(0, 4);
  const lastItems = array.slice(array.length - 4).reverse();

  const tableHeaderGeneral = (
    <TableHead>
      <TableRow>
        {tableHead.map((prop: Object) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableCellHead}`}
            key={uuid()}
          >
            {prop}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const tableBodyFirstItems = fistItems.map((prop: Array<string>) => (
    <TableRow key={uuid()}>
      {prop.map((item: string, ind: number) => {
        if (ind > 0) {
          return (
            <TableCell className={classes.tableCell} key={uuid()} >
              {item ? <UpArrowIcon className={classes.upArrow} /> : ''}
              <p className={classes.change}> {item ? `${item}%` : 'n/a'}</p>
            </TableCell>
          );
        }

        return (
          <TableCell className={classes.tableCell} key={uuid()}>
            {item}
          </TableCell>
        );
      })}
    </TableRow>
  ));

  const tableBodyLastItems = lastItems.map((prop: Array<string>) => (
    <TableRow key={uuid()}>
      {prop.map((item: string, ind: number) => {
        if (ind > 0) {
          return (
            <TableCell className={classes.tableCell} key={uuid()} >
              {item ? <DownArrowIcon className={classes.downArrow} /> : ''}
              <p className={classes.change}> {item ? `${item}%` : 'n/a'}</p>
            </TableCell>
          );
        }

        return (
          <TableCell className={classes.tableCell} key={uuid()}>
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
}));

export default withStyles(styles)(Trending);
