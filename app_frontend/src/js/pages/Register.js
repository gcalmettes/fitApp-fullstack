import React from 'react';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import AssignmentIndIcon from '@material-ui/icons/AssignmentIndOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles from '@material-ui/core/styles/withStyles';
import { theme, addToTheme } from './../components/theme';
import blue from '@material-ui/core/colors/blue';

import { TopBar } from './../components';

import { registerUser } from './../redux';


const styles = addToTheme(
  {
    layout: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      // [theme.breakpoints.up('sm')]:{
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
    purpleAvatar: {
      margin: 10,
      color: '#fff',
      backgroundColor: blue[500],
    },
  }
)


class Registration extends React.Component {
  constructor(){
    super()
    this.state = {
      firstname: null,
      lastname: null,
      username: null,
      password: null,
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }
  
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { firstname, lastname, username, password } = this.state;
    
    if (username && password) {
      const { dispatch } = this.props
      dispatch(registerUser( { firstname, lastname, username, password } ));
    } 
  }

  keyPress(e){
    if(e.keyCode == 13){
      this.handleSubmit(e)
    }
  }

  render(){
    
    const { classes } = this.props;
    const { username, password, submitted } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <TopBar />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.purpleAvatar}>
              <AssignmentIndIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form className={classes.form}>
              <FormControl onKeyDown={this.keyPress} margin="normal" fullWidth>
                <TextField
                  autoFocus
                  name="firstname"
                  label="First name"
                  defaultValue=''
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange}
                />
                <TextField
                  name="lastname"
                  label="Last name"
                  defaultValue=''
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  error = {submitted && !username}
                  helperText = {submitted && !username && "User name is required"}
                  name="username"
                  label="User name"
                  defaultValue=''
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  error = {submitted && !password}
                  helperText = {submitted && !password && "Password is required"}
                  name="password"
                  label="Password"
                  type="password"
                  defaultValue=''
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </FormControl>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleSubmit}
              >
                Register
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  } 
}


const Register = withStyles(styles)(Registration);

const mapStateToProps = () => ({})

const connectedRegister = connect(mapStateToProps)(Register);
export { connectedRegister as Register };