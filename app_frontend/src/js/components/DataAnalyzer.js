import React from 'react';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { ClippedDrawer, drawerWidth } from './ClippedDrawer'
import { FileLoader } from './FileLoader'
import { GraphDataContext } from './GraphDataContext'
import { GraphDataFocus } from './GraphDataFocus'
import { NumberTag } from './NumberTag'
import { GraphFitGridComponents } from './GraphFitGridComponents'
import { FitOptions } from './FitOptions'
import { SaveButton } from './SaveButton'
import { CommentBox } from './CommentBox'

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';


const styles = addToTheme(
  {
    root: {
      display: "flex",
      marginLeft: drawerWidth,
      flexgrow: 1,
    },
    drawer:{
      overflow: 'hidden',
    },
    font: {
      fontFamily: 'sans-serif'
    },
    numberTagComponent: {
      minWidth: '135px',
    },
    gridContainer: {
      minWidth: '600px',
      overflow: 'hidden',
    }
  }
)

export const DataAnalyzer = withStyles(styles)(props => {
    const { classes } = props
    return (
      <React.Fragment>
        <ClippedDrawer className={classes.drawer}>
          <FitOptions />
        <Divider />
        <CommentBox />
        <SaveButton />
        </ClippedDrawer>
        <div className={classes.root}>
          <Grid container spacing={0} className={classes.gridContainer}>
            <Grid item xs={9}>
              <FileLoader />
            </Grid>
            <Grid item xs={3} className={classes.numberTagComponent}>
              <NumberTag />
            </Grid>
            <Grid item xs={12}>
              <GraphDataContext />
            </Grid>
            <Grid item xs={12}>
              <GraphDataFocus />
            </Grid>
            <Grid item xs={12}>
              <GraphFitGridComponents />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
})