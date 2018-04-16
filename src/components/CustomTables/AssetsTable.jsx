import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Grid,
} from 'material-ui';

import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import { inject, observer } from 'mobx-react';
import { Close } from 'material-ui-icons';
import IconButton from '../CustomButtons/IconButton';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';
import RemovePortfolioWrapped from '../Modal/RemovePortfolio';


const styles = () => ({
  container: {
    width: '100%',
    margin: '40px 40px 0',
    padding: '20px 25px',
  },
});


// TODO add Inject PortfolioStore and Remake function to const = () =>{}
@inject('PortfolioStore')
@observer
class AssetsTable extends React.Component {
  state = {
    direction: 'row',
  };

  render() {
    const {
      classes,
      tableHead,
      tableData,
      tableHeaderColor,
      PortfolioStore,
    } = this.props;

    const { assets } = PortfolioStore.selectedPortfolio;

    const tableHeader = (
      <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
        <TableRow>
          {tableHead.map((prop, key) => (
            <TableCell
              className={`${classes.tableCell} ${classes.tableHeadCell}`}
              key={key}
            >
              {prop}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
    const filteredItems = assets.map(obj => [
      obj.currency,
      obj.balance,
      obj.origin,
      obj.lastBTCEquivalent,
      null,
    ]);

    const tableInfo = filteredItems.map((prop, key) => (

      <TableRow key={key}>
        {prop.map((item, ind) => {
          // if () {
          //   return;
          // }
          console.log(assets[key]);
          if (ind === 4) {
            return (
              <TableCell className={classes.tableCell} key={ind}>
                {item}
                <UpdatePortfolioModal />
                {/* <RemovePortfolioWrapped
                  onClick={() => this.handleRemove(portfolios[key].id)} /> */}
                <IconButton
                  onClick={() => this.handleRemove(assets[key].id)}
                  color="primary"
                  customClass="remove"
                >
                  <Close />
                </IconButton>
              </TableCell>
            );
          }
          return (
            <TableCell className={classes.tableCell} key={ind}>
              {item}
            </TableCell>
          );
        })}
      </TableRow>
    ));

    return (
      <Grid container>
        <Paper className={classes.container}>
          All Assets
          <Table className={classes.table}>
            {tableHead !== undefined ? tableHeader : null}
            <TableBody>{tableInfo}</TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(AssetsTable);
