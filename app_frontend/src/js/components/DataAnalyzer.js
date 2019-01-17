import React from 'react';
import { connect } from 'react-redux'
import { dataActions } from './../redux/actionTypes';

import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';

import { ClippedDrawer, drawerWidth } from './ClippedDrawer'
import { FileLoader } from './FileLoader'
import { GraphDataContext } from './GraphDataContext'
import { GraphDataFocus } from './GraphDataFocus'
import { NumberTag } from './NumberTag'
import { GraphFitGridComponents } from './GraphFitGridComponents'

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ShareIcon from '@material-ui/icons/Share';


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
    formControl: {
      margin: `${theme.spacing.unit*3}px ${theme.spacing.unit*3}px 0 ${theme.spacing.unit*3}px`,
    },
    group: {
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      flexShrink: 0,
    },
    font: {
      fontFamily: 'sans-serif'
    },
    button: {
      margin: theme.spacing.unit*3,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
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

//////////////////////////////////
// DRAWER
//////////////////////////////////

 
const getFitOptions = opts => opts.map((d,i) => 
  <FormControlLabel styles={{ 'display': 'block'}} key={`radio${i}`} value={d} control={<Radio color="primary"/>} label={d} />
)

const fitOptions = [
  'DbleExponentialDown', 
  'SingleExponentialUp',
  'SingleExponentialDown',
  'Reference'
]

class DataAnalyzer extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      fitOptionsValue: fitOptions[0],
    }
  }

  selectFitOption(event) {
    this.setState({ fitOptionsValue: event.target.value })
  }

  sendToFit(){
    const { data, currentTrace , fitRange, dispatch } = this.props
    const trace = data[`trace${currentTrace-1}`]
    if (fitRange) {
      const [minLim, maxLim] = fitRange
      const dataToFit = trace.slice(minLim, maxLim+1)
        .reduce((acc, point) => {
          acc.x.push(point.x)
          acc.y.push(point.y)
          return acc
        }, {x:[], y: []})
      dispatch({
        type: dataActions.SEND_DATA_TO_FIT, 
        fitSettings: { dataToFit, type: this.state.fitOptionsValue }
      })
    }
  }

  saveData(){
    const { data, currentTrace , fitRange, dispatch } = this.props
    console.log(currentTrace, dispatch)
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <ClippedDrawer className={classes.drawer}>
          <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Fitting Options</FormLabel>
          <RadioGroup
            name="fittingOptions"
            className={classes.group}
            value={this.state.fitOptionsValue}
            onChange={this.selectFitOption.bind(this)}
          >
            {getFitOptions(fitOptions)}
          </RadioGroup>
        </FormControl>
        <Button variant="contained" className={classes.button} onClick={this.sendToFit.bind(this)}>
          <ShareIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Fit
        </Button>
        <Divider />
        <Button variant="contained" color="primary" className={classes.button} onClick={this.saveData.bind(this)}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
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
  }
}


const mapStateToProps = ({ dataset }) => ({ 
  currentTrace: dataset.display.currentTrace,
  data: dataset.metaData.data,
  fitRange: dataset.analysis.fitRange
})
const connectedAnalyzer = connect(mapStateToProps)(withStyles(styles)(DataAnalyzer));
export { connectedAnalyzer as DataAnalyzer }; 