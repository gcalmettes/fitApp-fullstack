import React from 'react';
import { connect } from 'react-redux';
import { logout } from './../redux'

import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

import { TopBar } from './TopBar'


const styles = addToTheme(
  {
    container: {
      paddingLeft: 0,
      height: '100%', // so we can use full height for flexbox items
    },
    grow: {
      flexGrow: 1,
    },
    buttonStyle: {
      backgroundColor: 'transparent',
      color: 'white',
    }
  }
)

const TabContainer = (props) => {
  const { classes, children } = props
  return (
    <div className={classes.container}>
      {children}
    </div>
  );
}

const getTabs = (props) => {
  const { children } = props
  return children.props.children.map((child, i) => {
    const { path, label } = child.props
    return (
      <Tab 
        key={`tab${i}`}
        value={i} 
        label={label} 
        to={path} 
        component={Link}
      />
    )
  })
}

const getCurrentTabValue = (currentUrl, children) =>
  children.props.children.findIndex(child => child.props.path == currentUrl)
 

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    const currentTab = getCurrentTabValue(this.props.currentUrl, this.props.children)
    this.state = {
      value: currentTab >= 0 ? currentTab : 0,
    };
    this.changeTab = this.changeTab.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  changeTab(event, value) {
    this.setState({ value });
  };

  handleLogout(){
    const { authentication: { username }, dispatch } = this.props
    dispatch(logout({ username }))
  }

  render() {
    const { classes, children } = this.props
    return (
      <React.Fragment>
        <TopBar styles={classes.appBar}>
          <Tabs onChange={this.changeTab} value={this.state.value} className={classes.grow}>
            {getTabs({children: children})}
          </Tabs>
          <Button 
            variant="contained"
            styles={classes.buttonStyle}
            onClick={this.handleLogout}
          >
              Logout
          </Button>
        </TopBar>
        {TabContainer({children: children, classes: classes})}
      </React.Fragment>
    ) 
  }
}

// export const NavBar = withStyles(styles)(Navigation);


const NavBar = withStyles(styles)(Navigation);

const mapStateToProps = ({ authentication }) => ({ authentication })

const connectedNavBar = connect(mapStateToProps)(NavBar);
export { connectedNavBar as NavBar };