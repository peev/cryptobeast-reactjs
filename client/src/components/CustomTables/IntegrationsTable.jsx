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
import { inject, observer } from 'mobx-react';
import IconButton from '../CustomButtons/IconButton';
import UpdatePortfolioModal from '../Modal/UpdatePortfolio';
import tableStyle from '../../variables/styles/tableStyle';

type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  tableData: Array<Array<string>>,
};

const IntegrationsTable = inject('ApiAccountStore')(observer(({ ...props }: Props) => {
  const {
    classes, tableHead, tableHeaderColor, ApiAccountStore,
  } = props;

  const handleDelete = (id: string) => {
    ApiAccountStore.deleteApiAccount(id);
  };


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
          {ApiAccountStore.userApis.map((rows: Array<Object>) => {
            if (rows[0]) { // if its not empty array
              return (
                <TableRow key={uuid()}>
                  {rows.map((col: Object, key: number) => {
                    if (key === 5) {
                      return (
                        <TableCell className={classes.tableCell} key={uuid()}>
                          <UpdatePortfolioModal />
                          <IconButton color="primary" customClass="remove" id={col} onClick={() => handleDelete(col)}>
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
              );
            }
            return null;
          })}
        </TableBody>
      </Table>
    </div>
  );
}));


export default withStyles(tableStyle)(IntegrationsTable);
