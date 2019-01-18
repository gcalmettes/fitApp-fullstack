import React from 'react';
import { connect } from 'react-redux';
import { loginAttempt } from './../redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import pink from '@material-ui/core/colors/pink';
import withStyles from '@material-ui/core/styles/withStyles';
import { theme, addToTheme } from './../components/theme';

import { TopBar } from './../components';



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
      backgroundColor: pink[500],//theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  }
)


class SignIn extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
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

    const { username, password } = this.state;
    
    if (username && password) {
      const { dispatch } = this.props
      dispatch(loginAttempt( { username, password } ));
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
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form}>
              <FormControl onKeyDown={this.keyPress} margin="normal" required fullWidth>
                <TextField
                  required
                  autoFocus
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
                Sign in
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  } 
}


const Login = withStyles(styles)(SignIn);

const mapStateToProps = () => ({})

const connectedLogin = connect(mapStateToProps)(Login);
export { connectedLogin as Login };