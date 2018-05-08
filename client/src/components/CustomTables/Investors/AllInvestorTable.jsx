// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';


import tableStyle from '../../../variables/styles/tableStyle';

type Props = {
  classes: Object,
  tableHead: Array<Object>,
  tableData: Array<Object>,
  tableHeaderColor: string,
};

const AllInvestorTable = inject('PortfolioStore')(observer(({ ...props }: Props) => {
  const { classes, tableHead, tableData, tableHeaderColor } = props;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
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
        ) : null}
        <TableBody>
          {tableData.map((prop: Object) => (
            <TableRow key={uuid()}>
              {Object.keys(prop).map((el: Object, key: number) => {
                if (key <= 6) {
                  return (
                    <TableCell className={classes.tableCell} key={uuid()}>
                      {prop[el]}
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}));

export default withStyles(tableStyle)(AllInvestorTable);
