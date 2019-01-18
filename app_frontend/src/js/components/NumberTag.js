import React from 'react';
import { connect } from 'react-redux'

import { dataActions } from './../redux/actionTypes';

import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    container: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightgray',
    },
    buttonContainer: {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    parent: {
      display: "table",
      height: '100%',
      width: '100%',
    },
    child: {
      display: 'table-cell',
      verticalAlign: 'middle',
      textAlign: 'center',
    },
    iconSmall: {
      fontSize: 20,
    },
    button: {
      margin: 2,
      padding: 0,
      minHeight: '21px',
    },
    label: {
      fontSize: 17,
    }
  }
)

class NumberTag extends React.Component {

  goNext(){
    if (
      this.props.nTraces != 0 
      && this.props.currentTrace < this.props.nTraces 
    ){
      const { dispatch } = this.props
      dispatch({ type: dataActions.NEXT_TRACE} );
    }
  }

  goPrevious(){
    if (
      this.props.nTraces != 0 
      && this.props.currentTrace > 1 
    ){
      const { dispatch } = this.props
      dispatch({ type: dataActions.PREVIOUS_TRACE} );
    }
  }

  render(){
    const { nTraces, currentTrace, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <Button variant="contained" color="primary" 
            className={classes.button} onClick={this.goPrevious.bind(this)}
          >
            <KeyboardArrowLeft className={classes.iconSmall} />
          </Button>
          <Button variant="contained" color="primary" 
            className={classes.button} onClick={this.goNext.bind(this)}
          >
            <KeyboardArrowRight className={classes.iconSmall} />
          </Button>
        </div>
        <div className={classes.parent}>
          <div className={classes.child}>
            <Typography noWrap className={classes.label}>
              {nTraces == 0 ? 0 : currentTrace}/{nTraces}
            </Typography>
          </div>
        </div> 
      </div>
    )
  }
}

const mapStateToProps = ({ dataset }) => ({ 
  nTraces: dataset.metaData.size,
  currentTrace: dataset.display.currentTrace
})
const connectedNumberTag = connect(mapStateToProps)(withStyles(styles)(NumberTag));
export { connectedNumberTag as NumberTag }; 
