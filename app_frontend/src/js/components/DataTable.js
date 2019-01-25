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


class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      idToDelete: null,
      enteredId: null,
      enteredComment: null,
      alert: null
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
        alert: (
          <Dialog
            open={true}
            onClose={this.hideAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`Entry #${this.state.idToDelete} was deleted`}</DialogTitle>
          </Dialog>
        )
      }))
  }

  modifyCommentDbEntry(id, newComment){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/modify_comment', { id, newComment }, access_token)
      .then(response => this.setState({
        data: response.data,
        idToDelete: null,
        enteredId: null,
        alert: (
          <Dialog
            open={true}
            onClose={this.hideAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`The comment of entry #${this.state.idToDelete} was modified.`}</DialogTitle>
          </Dialog>
        )
      }))
  }

  hideAlert(){
    this.setState({alert: null, idToDelete: null})
  }

  showConfirmationId(id){
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
              <ExpansionPanelDetails>
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
                <Button onClick={this.onConfirm} color="primary">
                  Confirm
                </Button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Modify entry comment</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
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
                <Button onClick={() => this.modifyCommentDbEntry(this.state.idToDelete, this.state.enteredComment)} color="primary">
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
        alert: (
          <Dialog
            open={true}
            onClose={this.hideAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`ID ${this.state.enteredId} was given but ${this.state.idToDelete} was expected.`}</DialogTitle>
            <DialogContent>
              
            </DialogContent>
          </Dialog>
        )
      })
    } 
  }
  
  render(){

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
                width: 50,
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ authentication }) => ({ 
  authentication,
})
const connectedDataTable = connect(mapStateToProps)(DataTable);
export { connectedDataTable as DataTable }; 