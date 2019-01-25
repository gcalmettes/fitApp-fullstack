import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class SimpleSnackbar extends React.Component {

  // render() {
  //   const { classes, open, onClose, message } = this.props;
  //   return (
  //     <div>
  //       <Snackbar
  //         anchorOrigin={{
  //           vertical: 'bottom',
  //           horizontal: 'left',
  //         }}
  //         open={open}
  //         autoHideDuration={3000}
  //         onClose={onClose}
  //         ContentProps={{
  //           'aria-describedby': 'message-id',
  //         }}
  //         message={<span id="message-id">{message}</span>}
  //         action={[
  //           <IconButton
  //             key="close"
  //             aria-label="Close"
  //             color="inherit"
  //             className={classes.close}
  //             onClick={onClose}
  //           >
  //             <CloseIcon />
  //           </IconButton>,
  //         ]}
  //       />
  //     </div>
  //   );
  // }
  render() {
    const { classes, open, onClose, message, specialStyles, icon, iconStyles, anchor } = this.props;
    const Icon = icon
    const anchorPosition = anchor 
      ? anchor 
      : { vertical: 'bottom', horizontal: 'left',} 
    
    return (
      <div>
        <Snackbar
          anchorOrigin={anchorPosition}
          open={open}
          autoHideDuration={3000}
          onClose={onClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
        <SnackbarContent
          className={specialStyles}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              {Icon && <Icon className={iconStyles} />}
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>,
          ]} 
        />
        </Snackbar>
      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);