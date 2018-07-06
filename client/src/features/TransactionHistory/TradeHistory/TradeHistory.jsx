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
import UpdateTradeModal from './elements/UpdateTrade';
import tableStyle from '../../../variables/styles/tableStyle';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';

type Props = {
  classes: Object,
  tableHead: Array<Object>,
  tableData: Array<Object>,
  tableHeaderColor: string,
};

const HistoryTable = inject('PortfolioStore', 'TradeHistoryStore')(observer(({ ...props }: Props) => {
  const { classes, tableHead, tableHeaderColor, PortfolioStore, TradeHistoryStore } = props;
  const { tradeHistory, mapApiTradeHistory } = TradeHistoryStore;
  const trades = PortfolioStore.currentPortfolioTrades;

  const handleRemove = (trade: Object) => {
    PortfolioStore.deleteTrade(trade);
  };

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
          {tradeHistory.map((prop: Object, i: number) => (
            <TableRow key={uuid()} >
              {Object.keys(prop).map((el: Object, ind: number) => {
                if (ind === 10
                  && prop[2] === 'Manually Added'
                  && i === ((tradeHistory.length - 1) - (mapApiTradeHistory.length))) {
                  return (
                    <TableCell className={classes.tableCellBuy} key={uuid()}>
                      {prop[el]}
                      <ConfirmationModal onSave={() => handleRemove(trades[i])} message="Are you sure you want to delete this transaction?" />
                    </TableCell>
                  );
                }
                if (ind === 9
                  && prop[2] === 'Manually Added'
                  && i === ((tradeHistory.length - 1) - (mapApiTradeHistory.length))) {
                  return (
                    <TableCell className={classes.tableCellBuy} key={uuid()}>
                      {prop[el]}
                      <UpdateTradeModal trade={trades[i]} />
                    </TableCell>
                  );
                } else if (ind === 9 && prop[2] !== 'Manually Added') {
                  return (
                    <TableCell className={classes.tableCellBuy} key={uuid()}>
                      {prop[el]}
                    </TableCell>
                  );
                } else if (prop[4] === 'BUY') {
                  return (
                    <TableCell className={classes.tableCellBuy} key={uuid()}>
                      {prop[el]}
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell className={classes.tableCellSell} key={uuid()}>
                      {prop[el]}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}));

export default withStyles(tableStyle)(HistoryTable);
