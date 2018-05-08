// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from 'material-ui';
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import tableStyle from '../../variables/styles/tableStyle';
import UpArrowIcon from '../CustomIcons/Summary/UpArrowIcon';
import DownArrowIcon from '../CustomIcons/Summary/DownArrowIcon';


const styles = () => ({
  paper: {
    margin: '40px 30px 0',
    padding: '20px 25px',
  },
  tableHead: {
    borderBottom: '1px solid black',
  },
  tableCell: {
    paddingRight: '24px',
    borderBottom: 'none',
  },
  progressBar: {
    width: '100px',
    height: '25px',
    backgroundColor: '#092749',
    position: 'relative',
    '&:before': {
      top: '2px',
      left: '0',
      right: '0',
      content: 'attr(data-label)',
      color: 'white',
      position: 'absolute',
      textAlign: 'center',
    },
  },
  value: {
    backgroundColor: '#3ab693',
    display: 'inline-block',
    height: '100%',
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
  changeNoIcon: {
    margin: '0',
    display: 'inline-block',
    verticalAlign: 'text-bottom',
    paddingLeft: '25px',
  },
});

type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  tableData: Array<Array<string>>,
};

const PortfolioSummaryTable = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, tableHead, PortfolioStore } = props;

  const tableHeadContent = (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {tableHead.map((prop: Object) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableHeadCell}`}
            key={uuid()}
          >
            {prop}
          </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
  const currentDisplayAssets = (PortfolioStore.selectedPortfolio &&
    PortfolioStore.summaryPortfolioAssets.length > 0) ?
    PortfolioStore.summaryPortfolioAssets :
    [[' ', 0, 0, 0, 0, 0, 0, 0]];

  const tableBodyContent = currentDisplayAssets.map((ROW: Array<Object>) => (
    <TableRow key={uuid()}>
      {ROW.map((COL: Object, i: number) => {
          if (i === 5) {
            return (
              <TableCell className={classes.tableCell} key={uuid()}>
                <div className={classes.progressBar} data-label={`${COL}%`}>
                  <span className={classes.value} style={{ width: `${COL}px` }} />
                </div>
              </TableCell>
            );
          }
          if ((i === 6 || i === 7) && parseFloat(COL) !== 0 && COL !== undefined) {
            if (COL === 'n/a') {
              return (
                <TableCell className={classes.tableCell} key={uuid()} >
                  <p className={classes.changeNoIcon}>{COL}</p>
                </TableCell>
              );
            }

            return (
              <TableCell className={classes.tableCell} key={uuid()} >
                {/* sets the arrow based on the passed value */}
                {parseFloat(COL) > 0 ?
                  <UpArrowIcon className={classes.upArrow} /> :
                  <DownArrowIcon className={classes.downArrow} />}
                <p className={classes.change}>{COL}</p>
              </TableCell>
            );
          }

          return (
            <TableCell className={classes.tableCell} key={uuid()}>
              {COL}
            </TableCell>
          );
        })}
    </TableRow >
  ));

  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} style={{ tableLayout: 'auto' }} >
        {tableHead !== undefined ? tableHeadContent : null}
        <TableBody>
          {tableBodyContent}
        </TableBody>
      </Table>
    </Paper >
  );
}));

export default withStyles(styles, tableStyle)(PortfolioSummaryTable);
