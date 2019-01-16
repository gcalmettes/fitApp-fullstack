import React from 'react';
import { connect } from 'react-redux'

import { dataActions as datac } from './../redux/actionTypes';

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
      minHeight: '20px',
    },
    label: {
      fontSize: 17,
    }
  }
)

class NumberTag extends React.Component {

  goNext(){
    if (
      this.props.metaData.size != 0 
      && this.props.display.currentTrace < this.props.metaData.size 
    ){
      const { dispatch } = this.props
      dispatch({ type: datac.NEXT_TRACE} );
    }
  }

  goPrevious(){
    if (
      this.props.metaData.size != 0 
      && this.props.display.currentTrace > 1 
    ){
      const { dispatch } = this.props
      dispatch({ type: datac.PREVIOUS_TRACE} );
    }
  }

  render(){
    const { classes, metaData, display } = this.props

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
              {metaData.size == 0 ? 0 : display.currentTrace}/{metaData.size}
            </Typography>
          </div>
        </div> 
      </div>
    )
  }
}

const mapStateToProps = ({ dataset }) => ({ ...dataset })
const connectedNumberTag = connect(mapStateToProps)(withStyles(styles)(NumberTag));
export { connectedNumberTag as NumberTag }; 
