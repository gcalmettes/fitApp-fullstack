import React from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { raise } = nextProps
    this.setState({open: raise || false });
  }
  
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { raise, message } = this.props
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = ( { alert } ) => (alert)
const connectedAlertDialog = connect(mapStateToProps)(AlertDialog);
export { connectedAlertDialog as AlertDialog }; 