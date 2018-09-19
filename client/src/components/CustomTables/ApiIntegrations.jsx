// @flow
import React from 'react';
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import uuid from 'uuid/v4';
import { inject, observer } from 'mobx-react';

import UpdateApiAccount from '../Modal/ApiAccountModals/UpdateApiAccount';
import ConfirmationModal from '../Modal/ConfirmationModal';
import tableStyle from '../../variables/styles/tableStyle';

type Props = {
  classes: Object,
  tableHeaderColor: 'warning' | 'primary' | 'danger' | 'success' | 'info' | 'rose' | 'gray',
  tableHead: Array<string>,
  tableData: Array<Array<string>>,
};

const IntegrationsTable = inject('ApiAccountStore', 'PortfolioStore')(observer(({ ...props }: Props) => {
  const {
    classes, tableHead, tableHeaderColor, ApiAccountStore, PortfolioStore,
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
          {ApiAccountStore.convertUserApis.map((rows: Array<Object>) => {
            // if its not empty array and portfolio is selected
            if (rows[0] &&
              PortfolioStore.selectedPortfolioId === rows[6]) {
              return (
                <TableRow key={uuid()}>
                  {rows.map((col: Object, key: number) => {
                    if (key === 5) {
                      return (
                        <TableCell className={classes.tableCell} key={uuid()}>
                          <UpdateApiAccount apiId={col} />
                          <ConfirmationModal
                            onSave={() => handleDelete(col)}
                            message={`Are you shure you want to delete this ${rows[0]} API?`}
                          />
                        </TableCell>
                      );
                    } else if (key > 5) {
                      return null;
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
