import React from 'react';
import { connect } from 'react-redux'

import { postData } from '../helpers'
import { VirtualizedTable } from './VirtualizedTable'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SimpleSnackbar from './SimpleSnackBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    panelDetails: {
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    button: {
      width: '50%',
      marginTop: '10px',
    },
    snackbarSuccess: {
      backgroundColor: green[600],
    },
    snackbarError: {
      backgroundColor: red[600],
    },
    iconSnackbar: {
      fontSize: 20,
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
  }
)

const SnackVariants = {
  success: {
    icon: CheckCircleIcon,
    style: 'snackbarSuccess', 
  },
  error: {
    icon: ErrorIcon,
    style: 'snackbarError', 
  }
};


class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      idToDelete: null,
      enteredId: null,
      enteredComment: null,
      alert: null,
      openSnackbar: false,
      snackbarVariant: 'success',
      snackbarMessage: ''
    };

    this.showConfirmationId = this.showConfirmationId.bind(this)
    this.hideAlert = this.hideAlert.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
    this.deleteDbEntry = this.deleteDbEntry.bind(this)
    this.modifyCommentDbEntry = this.modifyCommentDbEntry.bind(this)
  }

  componentDidMount(){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/view', {}, access_token)
      .then(response => this.setState({data: response.data}))
  }

  deleteDbEntry(id){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/delete', { id }, access_token)
      .then(response => this.setState({
        data: response.data,
        idToDelete: null,
        enteredId: null,
        alert: null,
        openSnackbar: true,
        snackbarVariant: 'success',
        snackbarMessage: `Entry #${this.state.idToDelete} was deleted.`,
      }))
  }

  modifyCommentDbEntry(id, newComment){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/modify_comment', { id, newComment }, access_token)
      .then(response => this.setState({
        data: response.data,
        idToDelete: null,
        enteredId: null,
        alert: null,
        openSnackbar: true,
        snackbarVariant: 'success',
        snackbarMessage: `The comment of entry #${this.state.idToDelete} was modified.`,
      }))
  }

  hideAlert(){
    this.setState({alert: null, idToDelete: null})
  }

  showConfirmationId(id){
    const { classes } = this.props
    this.setState({
      idToDelete: id,
      alert: (
        <Dialog
          open={true}
          onClose={this.hideAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`You selected entry #${id}`}</DialogTitle>
          <DialogContent>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Delete entry</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="id"
                  label="Confirm id to delete"
                  fullWidth
                  onChange={e => this.setState({ enteredId: e.target.value })}
                  onKeyDown={e => (e.keyCode == 13) && this.onConfirm()}
                />
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={this.onConfirm} 
                  color="primary"
                  className={classes.button}
                >
                  Confirm
                </Button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Modify entry comment</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="id"
                  label="Enter new comment"
                  fullWidth
                  onChange={e => this.setState({ enteredComment: e.target.value })}
                  onKeyDown={e => (e.keyCode == 13) && this.modifyCommentDbEntry(this.state.idToDelete, this.state.enteredComment)}
                />
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => this.modifyCommentDbEntry(this.state.idToDelete, this.state.enteredComment)}
                  color="primary"
                  className={classes.button}
                  >
                  Confirm
                </Button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideAlert} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )
    })
  }

  onConfirm() {
    if (Number(this.state.enteredId) === Number(this.state.idToDelete)){
      this.deleteDbEntry(this.state.enteredId)
    } else {
      this.setState({
        enteredId: null,
        alert: null,
        openSnackbar: true,
        snackbarVariant: 'error',
        snackbarMessage: `ID ${this.state.enteredId} was given but ${this.state.idToDelete} was expected.`,
      })
    } 
  }

  closeSnackbar(event, reason){
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackbar: false })
  }
  
  render(){
    const { classes } = this.props

    const rows = this.state.data
      .map((d, i) => {
        const params = (
          <div key={`row-${i}`}>
            {Object.entries(JSON.parse(d.fitParams))
              .map(([key, value], j) => {
                const innerText = `${key}: ${value.toFixed(4)}`
                return key !== 'c' ? <div key={`row-${i}-param-${j}`}>{innerText}</div> : null
              })
            }
          </div>
        )
        return {
          ...d,
          fitParams: params
        }
      })

    return (
      <React.Fragment>
        {this.state.alert}
        <Paper style={{ height: 600, width: '100%' }}>
          <VirtualizedTable
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            onRowDoubleClick={event => this.showConfirmationId(event.rowData.id)}
            columns={[
              {
                width: 60,
                label: 'ID',
                dataKey: 'id',
              },
              {
                width: 200,
                flexGrow: 1.0,
                label: 'File name',
                dataKey: 'fileName',
              },
              {
                width: 50,
                label: 'Trace',
                dataKey: 'traceNumber',
                numeric: true,
              },
              {
                width: 150,
                flexGrow: 0.4,
                label: 'Parameters',
                dataKey: 'fitParams',
              },
              {
                width: 170,
                label: 'Method',
                dataKey: 'fitMethod',
              },
              {
                width: 150,
                label: 'Comment',
                dataKey: 'comment',
              },
            ]}
          />
        </Paper>
        <SimpleSnackbar 
          open={this.state.openSnackbar} 
          onClose={this.closeSnackbar.bind(this)}
          message={this.state.snackbarMessage}
          specialStyles={classes[SnackVariants[this.state.snackbarVariant].style]}
          icon={SnackVariants[this.state.snackbarVariant].icon}
          iconStyles={classes.iconSnackbar}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ authentication }) => ({ 
  authentication,
})
const connectedDataTable = connect(mapStateToProps)(withStyles(styles)(DataTable));
export { connectedDataTable as DataTable }; 