/* eslint-disable no-restricted-globals */
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
import { inject, observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import uuid from 'uuid/v4';
import AssetStore from '../../stores/AssetStore';
import BigNumberService from '../../services/BigNumber';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

type Props = {
  classes: Object,
};

const VolatilityTable = inject('AssetStore')(observer(({ ...props }: Props) => {
  const { classes } = props;
  const data = AssetStore.assetsVariance;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>TICKER</TableCell>
            <TableCell className={classes.right}>ALPHA</TableCell>
            <TableCell className={classes.right}>BETA</TableCell>
            <TableCell className={classes.right}>R^2</TableCell>
            <TableCell className={classes.right}>ADJUSTED R</TableCell>
            <TableCell className={classes.right}>EST.VARIANCE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((ROW: Object) => (
            <TableRow key={uuid()}>
              <TableCell>{ROW.ticker}</TableCell>
              <TableCell numeric>{isNaN(ROW.alpha) ? 0 : BigNumberService.floor(ROW.alpha)}%</TableCell>
              <TableCell numeric>{isNaN(ROW.beta) ? 0 : BigNumberService.floor(ROW.beta)}</TableCell>
              <TableCell numeric>N/A</TableCell>
              <TableCell numeric>N/A</TableCell>
              <TableCell numeric>{isNaN(ROW.variance) ? 0 : BigNumberService.floor(ROW.variance)}</TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}));

export default withStyles(styles)(VolatilityTable);
