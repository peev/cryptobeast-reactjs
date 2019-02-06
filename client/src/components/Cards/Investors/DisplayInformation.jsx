// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
  containerStyle: {
    boxSizing: 'border-box',
    width: '100%',
    border: '1px solid #afb3bb',
    padding: '5px 10px 0 10px',
    marginTop: '20px',
    color: '#afb3bb',
    '& p': {
      margin: '0',
    },
    '& p:first-child': {
      fontSize: '17px',
    },
    '& p:last-child': {
      fontSize: '13px',
      textTransform: 'lowercase',
    },
  },
});

type Props = {
  value: number,
  placeholderText: string,
  classes: Object,
};

const DisplayInformation = ({ ...props }: Props) => {
  const { classes, value, placeholderText } = props;

  return (
    <div className={classes.containerStyle} >
      <p >{value}</p>
      <p >{placeholderText}</p>
    </div>
  );
};

export default withStyles(styles)(DisplayInformation);
