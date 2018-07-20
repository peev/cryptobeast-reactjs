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
  const { classes, tableHead, tableData, tableHeaderColor, PortfolioStore } = props;

  const findInvestorID = (transaction: Object) => PortfolioStore.currentPortfolioInvestors.findIndex((investor: Object) => investor.fullName === transaction.investorName);

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
                if (key > 0 && key <= 6) {
                  return (
                    <TableCell className={`${classes.tableCell} ${prop.amountInUSD > 0 ? classes.positive : classes.negative}`} key={uuid()}>
                      {prop[el]}
                    </TableCell>
                  );
                } else if (key === 7) {
                  return (
                    <TableCell className={`${classes.tableCell} ${prop.amountInUSD > 0 ? classes.positive : classes.negative}`} key={uuid()}>
                      {findInvestorID(prop) > -1 && prop.amountInUSD < 0
                        ? Math.abs((prop.amountInUSD * PortfolioStore.currentPortfolioInvestors[findInvestorID(prop)].managementFee) / 100)
                        : 0}
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
