// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  TableCell,
  TablePagination,
  Tooltip,
  TableSortLabel,
} from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
import moment from 'moment';
import UpdateTradeModal from './elements/UpdateTrade';
import TablePaginationActions from './elements/TablePaginationActions';
import tableStyle from '../../../variables/styles/tableStyle';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';

type Props = {
  classes: Object,
  PortfolioStore: Object,
  TradeHistoryStore: Object,
  tableHead: Array<Object>,
  tableHeaderColor: string,
};

type State = {
  page: number,
  rowsPerPage: numbere,
  order: string,
  orderBy: string,
};

function getSorting(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Object, b: Object) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a: Object, b: Object) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

function getTransationSortableObject(transationAsArray: Object) {
  if (transationAsArray.length === 11) {
    return Object.assign({}, {
      tradeDate: transationAsArray[0],
      entryDate: transationAsArray[1],
      source: transationAsArray[2],
      pair: transationAsArray[3],
      type: transationAsArray[4],
      price: transationAsArray[5],
      filled: transationAsArray[6],
      fee: transationAsArray[7],
      total: transationAsArray[8],
      edit: transationAsArray[9],
      remove: transationAsArray[10],
    });
  }
  return null;
}


const TableHeader = ({
  onRequestSort,
  order,
  orderBy,
  classes,
  tableHead,
  tableHeaderColor,
}: {
  onRequestSort: Function,
  order: string,
  orderBy: string,
  classes: Object,
  tableHead: Array<Object>,
  tableHeaderColor: string,
}) => {
  const createSortHandler = (property: string) => (event: Object) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
      <TableRow>
        {tableHead.map((headerItem: Object, index: number) => (
          <TableCell
            className={`${classes.tableCell} ${classes.tableHeadCell}`}
            key={headerItem.id}
            numeric={headerItem.numeric}
            padding={headerItem.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headerItem.id ? order : false}
          >
            {(() => {
              if (index > 8) {
                return headerItem.label;
              }
              return (
                <Tooltip
                  title="Sort"
                  placement={headerItem.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === headerItem.id}
                    direction={order}
                    onClick={createSortHandler(headerItem.id)}
                  >
                    {headerItem.label}
                  </TableSortLabel>
                </Tooltip>
              );
            })()}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

@inject('PortfolioStore', 'TradeHistoryStore')
@observer
// eslint-disable-next-line
class HistoryTable extends React.Component<Props, State> {
  state = {
    page: 0,
    rowsPerPage: 20, // starting table size
    order: 'desc',
    orderBy: 'tradeDate',
  };

  handleRequestSort = (event: Object, property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleRemove = (trade: Object) => {
    this.props.PortfolioStore.deleteTrade(trade);
  };

  handleChangePage = (event: Event, page: number) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event: Event) => {
    this.setState({ rowsPerPage: event.target.value });
  };
  render() {
    const { classes, tableHead, tableHeaderColor, PortfolioStore, TradeHistoryStore } = this.props;
    const { tradeHistory } = TradeHistoryStore;
    const trades = PortfolioStore.currentPortfolioTrades;
    const { order, orderBy } = this.state;


    const header = (
      <TableHeader
        order={order}
        orderBy={orderBy}
        onRequestSort={this.handleRequestSort}
        tableHead={tableHead}
        classes={classes}
        tableHeaderColor={tableHeaderColor}
      />
    );

    // fills the table up with empty rows upto rowsPerPage
    // const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, tradeHistory.length - (this.state.page * this.state.rowsPerPage));
    const emptyRows = 0;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? header : null}
          <TableBody>
            {tradeHistory
              .map(getTransationSortableObject)
              .sort(getSorting(order, orderBy))
              .map((obj: Object) => Object.values(obj))
              .slice(this.state.page * this.state.rowsPerPage, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage)
              .map((transaction: Object, i: number, allTransactions: Array) => {
                const restOfTableRows = allTransactions.filter((t: Array, ti: number) => ti > i);
                const displayDeleteButton = restOfTableRows.reduce((trueOrFalse: boolean, tArray: Array) => {
                  if (tArray.includes('Manually Added')) {
                    return false;
                  }
                  return true;
                }, true);
                return (
                  <TableRow key={uuid()} >
                    {Object.keys(transaction).map((el: Object, ind: number) => {
                      if (ind === 10 && transaction.includes('Manually Added') && displayDeleteButton) {
                        return (
                          <TableCell className={`${classes.tableCellBuy} ${classes.buttonsWidth}`} key={uuid()}>
                            {transaction[el]}
                            <ConfirmationModal onSave={() => this.handleRemove(trades[i])} message="Are you sure you want to delete this transaction?" />
                          </TableCell>
                        );
                      }
                      if (ind === 9 && transaction.includes('Manually Added') && displayDeleteButton) {
                        return (
                          <TableCell className={`${classes.tableCellBuy} ${classes.buttonsWidth}`} key={uuid()}>
                            {transaction[el]}
                            <UpdateTradeModal trade={trades[i]} />
                          </TableCell>
                        );
                      } else if (ind === 9 && transaction[2] !== 'Manually Added') {
                        return (
                          <TableCell className={classes.tableCellBuy} key={uuid()}>
                            {transaction[el]}
                          </TableCell>
                        );
                      } else if (transaction[4] === 'BUY') {
                        if (ind === 0 || ind === 1) {
                          return (
                            <TableCell className={classes.tableCellBuy} key={uuid()}>
                              {moment(transaction[el]).format('LLL')}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell className={classes.tableCellBuy} key={uuid()}>
                            {transaction[el]}
                          </TableCell>
                        );
                      } else {
                        if (ind === 0 || ind === 1) {
                          return (
                            <TableCell className={classes.tableCellSell} key={uuid()}>
                              {moment(transaction[el]).format('LLL')}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell className={classes.tableCellSell} key={uuid()}>
                            {transaction[el]}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} />
              <TablePagination
                colSpan={3}
                count={tradeHistory.length}
                page={this.state.page}
                rowsPerPage={this.state.rowsPerPage}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[20, 50, 100]}
                labelDisplayedRows={({ to, count }: Object) => `${to} of ${count}`} // { from, to, count }: Object
                className={classes.selectRoot}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

export default withStyles(tableStyle)(HistoryTable);
