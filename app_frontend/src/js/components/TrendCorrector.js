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
import SyncIcon from '@material-ui/icons/Sync';
import AdbIcon from '@material-ui/icons/Adb';

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


class Corrector extends React.Component {

  sendToCorrection(){
    const { data, currentTrace , fitRange, dispatch } = this.props
    const trace = data[`trace${currentTrace-1}`]


    if (fitRange) {
      const [minLim, maxLim] = fitRange
      dispatch({
        type: dataActions.SEND_DATA_TO_CORRECTION, 
        correctionSettings: { trace, startIdx: minLim, endIdx: maxLim }
      })
    }
  }

  revertCorrection(){
    const { currentTrace , dispatch } = this.props
    const traceName = `trace${currentTrace-1}`

    dispatch({
      type: dataActions.REVERT_CORRECTION, 
      metaData: { traceName }
    })
  }

  render(){
    const { classes } = this.props

    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Linear trend correction</FormLabel>
        </FormControl>
        <Button variant="contained" className={classes.button} onClick={this.sendToCorrection.bind(this)}>
          <AdbIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Correct
        </Button>
        <Button variant="contained" className={classes.button} onClick={this.revertCorrection.bind(this)}>
          <SyncIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Revert
        </Button>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ dataset }) => ({ 
  currentTrace: dataset.display.currentTrace,
  data: dataset.metaData.data,
  fitRange: dataset.analysis.fitRange,
})
const connectedCorrector = connect(mapStateToProps)(withStyles(styles)(Corrector));
export { connectedCorrector as TrendCorrector }; 
