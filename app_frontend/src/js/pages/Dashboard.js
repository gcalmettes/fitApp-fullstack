import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { 
  NavBar, 
  DataAnalyzer, 
  ClippedDrawer, 
  drawerWidth,
  DataTable
} from './../components';
import { Route, Switch } from 'react-router-dom';


//////////////////////////////////
// NAVBAR TABS
//////////////////////////////////

const tabPanels = [
  { 
    label: 'Analysis',
    path: '/interface', 
    component: <DataAnalyzer />//() => (<DataAnalyzer />)
  },
  { 
    label: 'Database',
    path: '/db',
    component: <DataTable />//() => <h1>The database view</h1>
  },
  { 
    label: 'Another tab',
    path: '/other', 
    component: <h1>Another view</h1>//() => <h1>Another view</h1>
  }
]

const getRoutes = (globalPath, tabPanels) => 
  tabPanels.map((tab, i) => 
    <Route 
      key = {`route${i}`}
      path = {`${globalPath}${tab.path}`} 
      component = {() => <div style={{marginTop: 65}}>{tab.component}</div>}
      label = {tab.label}
    />
  )


export const Dashboard = (props) => {
  const { classes } = props
  const { path } = props.match
  const url = props.location.pathname
  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar currentUrl = {url}>
        <Switch>
          {getRoutes(path, tabPanels)}
        </Switch>
      </NavBar>
    </React.Fragment>
  )
}
