import React from 'react';
import { connect } from 'react-redux'

import { dataActions } from './../redux/actionTypes';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import SimpleSnackbar from './SimpleSnackBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    button: {
      margin: theme.spacing.unit*3,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
    snackbar: {
      backgroundColor: green[600],
    },
    iconSnackbar: {
      fontSize: 20,
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
  }
)

class SaveButton extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      openSnackbar: false,
    }
  }

  closeSnackbar(event, reason){
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackbar: false })
  }

  saveData(){
    const { authentication, metaData, analysis, dispatch } = this.props
    dispatch({
      type: dataActions.SAVE_DATA_TO_DATABASE, 
      data: { 
        fileName: metaData.fileName,
        traceNumber: metaData.currentTrace,
        fitModel: analysis.fitModel,
        fitRange: analysis.fitRange,
        comment: [...analysis.comments.list][analysis.comments.selectedIndex],
        model: {
          components: analysis.model.name,
          params: analysis.model.params,
        }
      },
      authentication,
    })
    this.setState({ openSnackbar: true })
  }

  render(){
    const { nTraces, currentTrace, classes } = this.props

    return (
      <React.Fragment>
        <Button variant="contained" color="primary" className={classes.button} onClick={this.saveData.bind(this)}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
        <SimpleSnackbar 
          open={this.state.openSnackbar} 
          onClose={this.closeSnackbar.bind(this)}
          message={'Data saved!'}
          specialStyles={classes.snackbar}
          icon={CheckCircleIcon}
          iconStyles={classes.iconSnackbar}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ authentication, dataset }) => ({ 
  authentication,
  analysis: dataset.analysis,
  metaData: { ...dataset.metaData, currentTrace: dataset.display.currentTrace },
})
const connectedSaveButton = connect(mapStateToProps)(withStyles(styles)(SaveButton));
export { connectedSaveButton as SaveButton }; 
