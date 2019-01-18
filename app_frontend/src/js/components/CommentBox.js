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
      height: 150,
      maxHeight: 150,
    },
  }
)

class CommentBox extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      selectedIndex: 0,
      commentList: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleListItemClick(event, index){
    const { dispatch } = this.props
    this.setState({ selectedIndex: index });
    dispatch({
      type: dataActions.SET_FIT_COMMENT,
      analysis: { comment: this.state.commentList[index]}
    })
  };

  handleInputChange(event){
    if(event.key === "Enter"){
      this.setState({ commentList: [...this.state.commentList, event.target.value] });
      if (this.state.commentList.length == 0) {
        const { dispatch } = this.props
        // if it was first comment, set the comment in global state
        dispatch({
          type: dataActions.SET_FIT_COMMENT,
          analysis: { comment: event.target.value}
        })
      }
      event.target.value = ''
     }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
      <TextField
          id="outlined-full-width"
          label="New Comment"
          style={{ margin: 8 }}
          placeholder="Enter here"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          onKeyDown={this.handleInputChange}
        />
      <List className={classes.root}>
            {this.state.commentList.map((comment, i) => (
              <ListItem 
                key={`item-${i}`}
                button
                selected={this.state.selectedIndex === i}
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

const mapStateToProps = ({ }) => ({ })
const connectedCommentBox = connect(mapStateToProps)(withStyles(styles)(CommentBox));

export { connectedCommentBox as CommentBox}