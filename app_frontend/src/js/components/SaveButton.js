import React from 'react';
import { connect } from 'react-redux'

import { dataActions } from './../redux/actionTypes';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

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
  }
)

class SaveButton extends React.Component {
  
  saveData(){
    const { authentication, metaData, analysis, dispatch } = this.props
    dispatch({
      type: dataActions.SAVE_DATA_TO_DATABASE, 
      data: { 
        fileName: metaData.fileName,
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
  }

  render(){
    const { nTraces, currentTrace, classes } = this.props

    return (
      <Button variant="contained" color="primary" className={classes.button} onClick={this.saveData.bind(this)}>
        <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
        Save
      </Button>
    )
  }
}

const mapStateToProps = ({ authentication, dataset }) => ({ 
  authentication,
  analysis: dataset.analysis,
  metaData: dataset.metaData
})
const connectedSaveButton = connect(mapStateToProps)(withStyles(styles)(SaveButton));
export { connectedSaveButton as SaveButton }; 
