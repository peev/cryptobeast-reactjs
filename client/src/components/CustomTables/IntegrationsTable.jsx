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
import uuid from 'uuid/v4';
import { Close } from '@material-ui/icons';
import IconButton from '../CustomButtons/IconButton';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';

type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  tableData: Array<Array<string>>,
};

function IntegrationsTable({ ...props }: Props) {
  const {
    classes, tableHead, tableData, tableHeaderColor,
  } = props;
  const tableHeader = (
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
  );

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? tableHeader : null}
        <TableBody>
          {tableData.map((rows: Array<Object>) => (
            <TableRow key={uuid()}>
              {rows.map((col: Object, key: number) => {
                  if (key === 2) {
                    return (
                      <TableCell className={classes.tableCell} key={uuid()}>
                        {col}
                        {/* TODO: Replace modal with update api modal */}
                        <UpdatePortfolioModal />
                      </TableCell>
                    );
                  }
                  if (key >= 3) {
                    return (
                      <TableCell className={classes.tableCell} key={uuid()}>
                        {col}
                        <IconButton color="primary" customClass="remove" >
                          <Close />
                        </IconButton>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell className={classes.tableCell} key={uuid()}>
                      {col}
                    </TableCell>
                  );
                })}
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default withStyles(tableStyle)(IntegrationsTable);
