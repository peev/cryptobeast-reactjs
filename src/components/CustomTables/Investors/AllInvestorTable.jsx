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

import { Edit } from 'material-ui-icons';
import IconButton from '../../CustomButtons/IconButton';

import tableStyle from '../../../variables/styles/tableStyle';

const AllInvestorTable = inject('PortfolioStore')(observer(({ ...props }) => {
  const { classes, tableHead, tableData, tableHeaderColor } = props;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
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
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key}>
                {Object.keys(prop).map((el, key) => {
                  if (6 >= key) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop[el]}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}))

AllInvestorTable.defaultProps = {
  tableHeaderColor: 'gray',
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
    'gray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
};

export default withStyles(tableStyle)(AllInvestorTable);
