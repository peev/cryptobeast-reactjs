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
import UpdateTradeModal from '../Modal/UpdateTrade';
import tableStyle from '../../variables/styles/tableStyle';
import ConfirmationModal from '../../components/Cards/History/ConfirmationModal';

type Props = {
  classes: Object,
  tableHead: Array<Object>,
  tableData: Array<Object>,
  tableHeaderColor: string,
};

const HistoryTable = inject('PortfolioStore', 'AssetStore')(observer(({ ...props }: Props) => {
  const { classes, tableHead, tableData, tableHeaderColor, PortfolioStore } = props;

  const handleRemove = (id: string) => {
    PortfolioStore.removeTrade(id);
  };
  const trades = PortfolioStore.currentPortfolioTrades;

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
          {tableData.map((prop: Object, i: number) => (
            <TableRow key={uuid()} >
                {Object.keys(prop).map((el: Object, ind: number) => {
                  if (ind === 10 && prop[2] === 'Manually Added' && i === tableData.length - 1) {
                    return (
                      <TableCell className={classes.tableCellBuy} key={uuid()}>
                        {prop[el]}
                        <ConfirmationModal onSave={() => handleRemove(trades[i].id)} />
                      </TableCell>
                    );
                  }
                  if (ind === 9 && prop[2] === 'Manually Added' && i === tableData.length - 1) {
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
