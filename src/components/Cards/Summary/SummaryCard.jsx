import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from 'material-ui';

import statsCardStyle from 'variables/styles/statsCardStyle';

const styles = () => ({
  cardContainer: {
    width: '18%',
    marginTop: '20px',
  },
  cardHeader: {
    float: 'left',
    margin: '0 10px',
    marginTop: '-10px',
    backgroundColor: '#272B3F',
    '& :first-child': {
      height: '24px',
      margin: '0 auto',
    },
  },
  icon: {
    color: 'white',
  },
  cardContent: {
    paddingTop: '10px',
    textAlign: 'right',
  },
  cardTitle: {
    height: '40px',
  },
  cardDescriptionNormal: {
    paddingTop: '7px',
  },
  cardDescriptionPositive: {
    paddingTop: '7px',
    color: '#70A800',
  },
  cardDescriptionNegative: {
    paddingTop: '7px',
    color: '#B94A48',
  },
  input: {
    width: '100%',
  },
});


function SummaryCard({ ...props }) {
  const {
    classes,
    title,
    description,
    // iconColor,
  } = props;

  /**
   * converts the given percent of profit/loss and makes it into number
   * depends if its positive or negative, return appropriate class name
   */
  const totalProfitLoss = () => {
    const result = parseFloat(description.slice(0, description.length - 1));

    if (title === 'Total profit/loss' && result > 0) {
      return classes.cardDescriptionPositive;
    } else if (title === 'Total profit/loss' && result < 0) {
      return classes.cardDescriptionNegative;
    }

    return classes.cardDescriptionNormal;
  };


  return (
    <Card className={classes.cardContainer}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<props.icon className={classes.icon} />}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.cardTitle}>
          {title}
        </Typography>

        <Typography
          type="headline"
          component="h2"
          className={title === 'Total profit/loss' ? totalProfitLoss() : classes.cardDescriptionNormal}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles, statsCardStyle)(SummaryCard);
