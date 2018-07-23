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
} from 'material-ui';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid/v4';
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

@inject('PortfolioStore', 'TradeHistoryStore')
@observer
// eslint-disable-next-line
class HistoryTable extends React.Component<Props, State> {
  state = {
    page: 0,
    rowsPerPage: 20, // starting table size
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
    const { tradeHistory, mapApiTradeHistory } = TradeHistoryStore;
    const trades = PortfolioStore.currentPortfolioTrades;

    // fills the table up with empty rows upto rowsPerPage
    // const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, tradeHistory.length - (this.state.page * this.state.rowsPerPage));
    const emptyRows = 0;

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
            {tradeHistory
              .slice(this.state.page * this.state.rowsPerPage, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage)
              .map((prop: Object, i: number) => (
                <TableRow key={uuid()} >
                  {Object.keys(prop).map((el: Object, ind: number) => {
                    if (ind === 10
                      && prop[2] === 'Manually Added'
                      && i === ((tradeHistory.length - 1) - (mapApiTradeHistory.length))) {
                      return (
                        <TableCell className={classes.tableCellBuy} key={uuid()}>
                          {prop[el]}
                          {/* <ConfirmationModal onSave={() => this.handleRemove(trades[i])} message="Are you sure you want to delete this transaction?" /> */}
                        </TableCell>
                      );
                    }
                    if (ind === 9
                      && prop[2] === 'Manually Added'
                      && i === ((tradeHistory.length - 1) - (mapApiTradeHistory.length))) {
                      return (
                        <TableCell className={classes.tableCellBuy} key={uuid()}>
                          {prop[el]}
                          {/* <UpdateTradeModal trade={trades[i]} /> */}
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
                labelDisplayedRows={({ from, to, count }: Object) => `${to} of ${count}`}
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
