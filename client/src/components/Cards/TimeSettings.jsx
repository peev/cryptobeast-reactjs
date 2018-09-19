// @flow
import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { inject, observer } from 'mobx-react';

import ChangeTime from '../Modal/ChangeTime';

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: '60px',
  },
  marginBottom: {
    marginBottom: '18px',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  text: {
    fontSize: '15px',
  },
});

type Props = {
  classes: Object,
};

const Portfolio = inject('UserStore')(observer(({ ...props }: Props) => {
  const { classes, UserStore } = props;

  const handleSetTimeType = () => {
    UserStore.setTimeType();
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} className={`${classes.container} ${classes.marginBottom}`}>
        <Typography
          variant="title"
          id="title"
          className={classes.title}
        >
          Trade Closing Time:
        </Typography>

        <div className={`${classes.container} ${classes.marginLeft}`}>
          <Typography
            variant="title"
            id="title"
            className={classes.text}
          >
            {UserStore.timeValue}
          </Typography>

          <ChangeTime />
        </div>

        <div className={`${classes.container} ${classes.marginLeft}`}>
          <Typography
            variant="subheading"
            className={classes.text}
          >
            Default
          </Typography>

          <Checkbox
            color="primary"
            onChange={() => handleSetTimeType()}
            checked={UserStore.timeType}
          />
        </div>
      </Grid>
    </Grid>
  );
}));

export default withStyles(styles)(Portfolio);
