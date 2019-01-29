import React from 'react';
import { connect } from 'react-redux'
import { dataActions } from './../redux/actionTypes';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import TextField from '@material-ui/core/TextField';

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
  }
)

class CommentBox extends React.Component {

  handleListItemClick(event, index){
    const { dispatch } = this.props
    this.setState({ selectedIndex: index });
    dispatch({
      type: dataActions.SET_FIT_COMMENT,
      analysis: { 
        comments: {
          selectedIndex: index,
        } 
      }
    })
  };

  handleInputChange(event){
    if(event.key === "Enter"){
      const { itemList, selectedIndex, dispatch } = this.props
      dispatch({
        type: dataActions.SET_FIT_COMMENT,
        analysis: { 
          comments: {
            list: new Set([...itemList, event.target.value]),
            selectedIndex: [...itemList].length
          }
        }
      })
      // erase text
      event.target.value = ''
    }
  }

  render() {
    const { itemList, selectedIndex, classes } = this.props;

    return (
      <div>
      <TextField
          id="outlined-full-width"
          label="New Comment"
          style={{ margin: 8 }}
          placeholder="Enter here"
          margin="normal"
          variant="outlined"
          InputLabelProps={{ shrink: true, }}
          onKeyDown={this.handleInputChange.bind(this)}
        />
      <List className={classes.root}>
        {[...itemList].map((comment, i) => (
          <ListItem 
            key={`item-${i}`}
            button
            selected={selectedIndex === i}
            onClick={event => this.handleListItemClick(event, i)}
          >
            <ListItemText primary={`${comment}`} />
          </ListItem>
        ))}
      </List>
      </div>
    )
  }
}

const mapStateToProps = ({ dataset }) => ({
  itemList: dataset.analysis.comments ? dataset.analysis.comments.list : [],
  selectedIndex: dataset.analysis.comments && dataset.analysis.comments.selectedIndex,
})
const connectedCommentBox = connect(mapStateToProps)(withStyles(styles)(CommentBox));

export { connectedCommentBox as CommentBox}