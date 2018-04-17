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
  container: {
    width: '18%',
    marginTop: '20px',
  },
  containerIcon: {
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
  cardTitle: {
    height: '40px',
  },
  cardDescription: {
    textAlign: 'right',
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
    iconColor,
  } = props;

  return (
    <Card className={classes.container}>
      <CardHeader
        className={classes.containerIcon}
        avatar={<props.icon className={classes.icon} />}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.cardTitle}>
          {title}
        </Typography>

        <Typography
          type="headline"
          component="h2"
          className={classes.cardDescription}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles, statsCardStyle)(SummaryCard);
