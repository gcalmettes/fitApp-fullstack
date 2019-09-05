import React from 'react';
import { connect } from 'react-redux'

import { dataActions } from './../redux/actionTypes';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ShareIcon from '@material-ui/icons/Share';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
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
    button: {
      margin: theme.spacing.unit*3,
      minHeight: '36px',
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
  }
)

const fitOptions = [
  'DbleExponentialDown', 
  'SingleExponentialUp',
  'SingleExponentialDown',
  'SingleExponentialUnconstrained',
  'Reference'
]

const getFitOptions = opts => opts.map((d,i) => 
  <FormControlLabel styles={{ 'display': 'block'}} key={`radio${i}`} value={d} control={<Radio color="primary"/>} label={d} />
)

class FitOptions extends React.Component {
  constructor(props){
    super(props)
    const { fitModel, dispatch } = props
    if (!fitModel){
      dispatch({
        type: dataActions.SET_FIT_OPTIONS, 
        analysis: { fitModel: fitOptions[0] }
      })
    }
  }

  selectFitOption(event) {
    const { dispatch } = this.props
    dispatch({
      type: dataActions.SET_FIT_OPTIONS, 
      analysis: { fitModel: event.target.value }
    })
  }

  sendToFit(){
    const { data, currentTrace , fitRange, fitModel, dispatch } = this.props
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
        fitSettings: { dataToFit, type: fitModel }
      })
    }
  }

  render(){
    const { fitModel, classes } = this.props
    
    const selectedFitModel = fitModel 
      ? fitModel
      : fitOptions[0]

    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Fitting Options</FormLabel>
          <RadioGroup
            name="fittingOptions"
            className={classes.group}
            value={selectedFitModel}
            onChange={this.selectFitOption.bind(this)}
          >
            {getFitOptions(fitOptions)}
          </RadioGroup>
        </FormControl>
        <Button variant="contained" className={classes.button} onClick={this.sendToFit.bind(this)}>
          <ShareIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Fit
        </Button>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ dataset }) => ({ 
  currentTrace: dataset.display.currentTrace,
  data: dataset.metaData.data,
  fitRange: dataset.analysis.fitRange,
  fitModel: dataset.analysis.fitModel,
})
const connectedFitOptions = connect(mapStateToProps)(withStyles(styles)(FitOptions));
export { connectedFitOptions as FitOptions }; 
