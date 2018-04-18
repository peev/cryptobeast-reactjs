import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';

import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import tableStyle from '../../variables/styles/tableStyle';

const data = [
  [1, 2, 2, 2, 23, 4, 5, 3],
  [1, 2, 2, 2, 23, 4, 5, 3],
  [1, 2, 2, 2, 23, 4, 5, 3],
];

const styles = () => ({
  warningText: {
    marginTop: '35%',
    textAlign: 'center',
  },
});

const AllInvestorTable = inject('PortfolioStore')(observer(({ ...props }) => {
  const { classes, tableHead, tableData, tableHeaderColor, PortfolioStore } = props;

  const tableHeadContent = (
    <TableHead className={classes[tableHeaderColor + 'TableHeader']}>
      <TableRow>
        {tableHead.map((prop, key) => {
          return (
            <TableCell
              className={classes.tableCell + ' ' + classes.tableHeadCell}
              key={key}
            >
              {prop}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );

  let tableBodyContent;
  if (PortfolioStore.selectedPortfolio) {
    const currentAssets = PortfolioStore.summaryPortfolioAssets;

    tableBodyContent = currentAssets.map((el, key) => {
      return (
        <TableRow key={key}>
          {el.map((prop, i) => {
            return (
              <TableCell className={classes.tableCell} key={i}>
                {prop}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  }

  return (
    <div className={classes.tableResponsive} >
      <Table className={classes.table}>
        {tableHead !== undefined ? tableHeadContent : null}
        <TableBody>
          {PortfolioStore.selectedPortfolio ? tableBodyContent : ''}
        </TableBody>
      </Table>
    </div>
  );
}))

AllInvestorTable.defaultProps = {
  tableHeaderColor: 'gray'
};

AllInvestorTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray'
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(styles, tableStyle)(AllInvestorTable);
