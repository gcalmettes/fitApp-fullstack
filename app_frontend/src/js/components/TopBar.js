import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

import { AppName } from './../App'


const styles = addToTheme(
  {
    titleLab: {
      flexGrow: 0.2,
      minWidth: '100px'
    },
    appBar: {
      flexWrap: 'wrap',
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 100,
    },
    grow: {
      flexGrow: 1,
    },
  }
)

export const TopBar = withStyles(styles)((props) => {
  const { classes } = props
  return (
    <AppBar className={classes.appBar} component="div">
      <Toolbar className={classes.grow}>
        <Typography variant="h6" color="inherit" className={classes.titleLab}>
          { AppName }
        </Typography>
        {props.children}
      </Toolbar>
    </AppBar>
  )
})


