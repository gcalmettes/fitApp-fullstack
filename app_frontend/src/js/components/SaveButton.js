import React from 'react';
import { connect } from 'react-redux'

import { dataActions } from './../redux/actionTypes';

import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import SimpleSnackbar from './SimpleSnackBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';

import { drawerWidth } from './ClippedDrawer'

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    root: {
      width: '100%',
      maxWidth: drawerWidth,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      height: 175,
      maxHeight: 175,
    },
    listItem: {
      color: 'blue',
      fontSize: '12px',
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
      currentId: '',
      saved: []
    }
  }

  componentDidMount(){
    const { metaData: { fileName, currentTrace } } = this.props
    const id = `${fileName}-${currentTrace}`
    this.setState({ currentId: id, saved: [] })
  }

  componentDidUpdate(){
    const { metaData: { fileName, currentTrace } } = this.props
    const id = `${fileName}-${currentTrace}`
    if (id !== this.state.currentId) {
      this.setState({ currentId: id, saved: [] })
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
    this.setState({ openSnackbar: true, saved: [...this.state.saved, `${[...analysis.comments.list][analysis.comments.selectedIndex]} | ${analysis.fitModel}`] })
  }

  render(){
    const { analysis, classes } = this.props
    return (
      <React.Fragment>
        <Button variant="contained" color="primary" className={classes.button} onClick={this.saveData.bind(this)}>
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save
        </Button>
        <List className={classes.root}>
          {this.state.saved.map((item, i) => (
            <ListItem dense key={`item-${i}`}>
              <ListItemText primary={`${item}`} classes={{ primary: classes.listItem }} />
            </ListItem>
          ))}
        </List>
        <SimpleSnackbar 
          open={this.state.openSnackbar} 
          onClose={this.closeSnackbar.bind(this)}
          message={`${analysis.fitModel} data saved!`}
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
