import React from 'react';
import { connect } from 'react-redux';
import { logout } from './../redux'

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Drawer from '@material-ui/core/Drawer';


import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

export const drawerWidth = 240;

const styles = addToTheme(
  {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
  }
)


class LeftDrawer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes, children } = this.props
    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          {children}
        </Drawer>
      </React.Fragment>
    ) 
  }
}

const ClippedDrawer = withStyles(styles)(LeftDrawer);

const mapStateToProps = ({ authentication }) => ({ authentication })

const connectedClippedDrawer = connect(mapStateToProps)(ClippedDrawer);
export { connectedClippedDrawer as ClippedDrawer };