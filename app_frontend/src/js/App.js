import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './components'

import { browserHistory } from './helpers'
import { Login, Register, Dashboard} from './pages';
import { PrivateRoute, AlertDialog } from './components';

export const AppName = 'FitApp'

export const App = () => {
  return <MuiThemeProvider theme={theme}>
    <AlertDialog />
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/analysis/interface" />}/>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/test" component={() => <h1>test</h1>} />
        <PrivateRoute path="/analysis" component={Dashboard} />
        <Route render={() => <h1>Wrong url</h1>} />
      </Switch>
    </Router>
  </MuiThemeProvider>
}

// <Route exact path="/" render={() => <Redirect to="/analysis/interface" />}/>
//         <Route exact path="/test" component={() => <h1>test</h1>} />
//         <Route path="/analysis" component={Dashboard} />
//         <Route render={() => <h1>Wrong url</h1>} />