import React, { Component } from 'react';
import { connect } from 'react-redux'

import { GraphFitComponent } from './GraphFitComponent'

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    // title: {
    //   color: theme.palette.primary.light,
    // },
    // titleBar: {
    //   background:
    //     'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    // },
  }
)

const GraphFitGridComponents = (props) => {
  let { components, paramValues, classes } = props

  return <div className={classes.root}>
    {components &&
      <GridList className={classes.gridList} cols={3.5}>
        {components.map((component, i) => {
          return (
            <GridListTile key={`component${i}`} style={{ height: 'auto', width: 'auto'}}>
              <GraphFitComponent 
                params={component.params} 
                paramValues={paramValues}
                data={component.data}
              />
              <GridListTileBar
                title={component.name}
                titlePosition="top"
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          )
        })}
      </GridList>
    }
  </div>
}


const mapStateToProps = ({ dataset }) => ({ 
  components: dataset.analysis.components,
  paramValues: dataset.analysis.model && dataset.analysis.model.params,
})
const connectedGridComponents = connect(mapStateToProps)(withStyles(styles)(GraphFitGridComponents));
export { connectedGridComponents as GraphFitGridComponents };