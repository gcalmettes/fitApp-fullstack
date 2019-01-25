import React from 'react';

import { throttle } from './../helpers'

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

const delay = 150

class DataAnalyzer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      width:  800,
      height: 182
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.updateDimensionsPerf = throttle(this.updateDimensions.bind(this), delay)
  }

  // Add event listener
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensionsPerf);
  }

  // Calculate & Update state of new dimensions
  updateDimensions() {
    const w = window,
          d = document,
              documentElement = d.documentElement,
              body = d.getElementsByTagName('body')[0],
              width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
              height = w.innerHeight || documentElement.clientHeight || body.clientHeight

    if(window.innerWidth < 700) {
      this.setState({ width: 700, height });
    } else {
      this.setState({ width, height });
    }
  }

  // Remove event listener
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensionsPerf);
  }

  render(){
    const { classes } = this.props

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
              <GraphDataContext width={this.state.width-drawerWidth}/>
            </Grid>
            <Grid item xs={12}>
              <GraphDataFocus width={this.state.width-drawerWidth}/>
            </Grid>
            <Grid item xs={12}>
              <GraphFitGridComponents />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

const styledDataAnalyzer = withStyles(styles)(DataAnalyzer)
export { styledDataAnalyzer as DataAnalyzer }