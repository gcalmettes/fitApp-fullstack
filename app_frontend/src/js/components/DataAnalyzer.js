import React from 'react';
import { connect } from 'react-redux'
import { dataActions as datac } from './../redux/actionTypes';

import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { ClippedDrawer, drawerWidth } from './ClippedDrawer'
import { FileLoader } from './FileLoader'
import { GraphDataContext } from './GraphDataContext'
import { GraphDataFocus } from './GraphDataFocus'
import { NumberTag } from './NumberTag'

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
    formControl: {
      margin: `${theme.spacing.unit*3}px ${theme.spacing.unit*3}px 0 ${theme.spacing.unit*3}px`,
    },
    group: {
      margin: 0,
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
  <FormControlLabel key={`radio${i}`} value={d} control={<Radio color="primary"/>} label={d} />
)

const fitOptions = [
  'DbleExponential', 
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

  loadFile(event) {
    const file = event.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      const dataUrl = evt.target.result;
      // console.log(file.name, dataUrl)
      // send redux action for loading data
    };
    reader.readAsDataURL(file);
    }
  }

  selectFitOption(event) {
    this.setState({ fitOptionsValue: event.target.value })
  }

  render() {
    const { data, message, classes } = this.props
    return (
      <React.Fragment>
        <ClippedDrawer>
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
        <Button variant="contained" className={classes.button}>
          <ShareIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Fit
        </Button>
        <Divider />
        <Button variant="contained" color="primary" className={classes.button}>
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
              <GraphDataContext 
                focusRange={[
                  {name: 'start', x: 0}, 
                  {name: 'end', x: 0}
                ]}
                onBrush={() => console.log('brushed')} 
              />
            </Grid>
            <Grid item xs={12}>
              <GraphDataFocus 
                dataFit={[]}
                xRange={[]}
                fitBounds={[]}
                refBounds={[]}
                onSelect={() => console.log('selected')}
                focusRange={[
                  {name: 'start', x: 0}, 
                  {name: 'end', x: 0}
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.paper}>xs=12 sm=6</Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>xs=12</Paper>
            </Grid>
          </Grid>

        </div>
      </React.Fragment>
    );
  }
}



const mapStateToProps = ({ dataset }) => (
  { 
    message: dataset.message,
    data: dataset.data  
  })
const connectedAnalyzer = connect(mapStateToProps)(withStyles(styles)(DataAnalyzer));
export { connectedAnalyzer as DataAnalyzer }; 