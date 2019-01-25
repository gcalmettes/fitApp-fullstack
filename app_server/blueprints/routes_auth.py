from flask import (
    Blueprint, request, jsonify
)

from app_server.models import User, Log

bp = Blueprint('user', __name__)

########################################
## catch all 
########################################

@bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user.

    Validates that the username is not already taken. Hashes the
    password for security.
    """
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    username = request.json.get('username')
    password = request.json.get('password')

    error = None
    message = 'Some error occured. '

    if not username:
        error = 'Username is required.'
        message += error
    elif not password:
        error = 'Password is required.'
        messge += error
    elif User.query.filter_by(username=username).first():
        error = f'User name "{username}" is already taken.'
        message += error

    if not error:
        # the name is available, store user in the database and go to
        # the login page
        newUser = User(
          firstname=firstname, 
          lastname=lastname, 
          username=username, 
          password=password
        ).save()
        message = 'Successfully registered.'

    return jsonify({ 
      'status': 'success' if not error else 'fail',
      'message': message,
      'error': error
    }), 201 if not error else 417


@bp.route('/auth/login', methods=['POST'])
def login():
    """Log in a registered user by adding the user id to the session."""
    username = request.json.get('username')
    password = request.json.get('password')

    error = None
    access_token = None
    message = 'An error occured. '  
    # fetch the user data
    user = User.query.filter_by(username=username).first()

    if not user:
        error = 'Wrong credentials.' #'Incorrect user name.'
        message += error
    elif not user.verify_pwd(password):
        error = 'Wrong credentials.' #'Incorrect password.'
        message += error
    elif not error:
        # save activity to db
        newLog = Log(type='login', user_id=user.id).save()
        message = 'Successfully logged in.'
        access_token = user.encode_auth_token().decode()

    return jsonify({ 
      'status': 'success' if not error else 'fail',
      'message': message,
      'access_token': access_token,
      'error': error
    }), 202 if not error else 404


@bp.route('/auth/logout', methods=['POST'])
def logout():
    """Log in a registered user by adding the user id to the session."""
    username = request.json.get('username')
    # access_token = request.json.get('access_token')
    # fetch the user data
    user = User.query.filter_by(username=username).first()

    # save activity to db
    newLog = Log(type='logout', user_id=user.id).save()

    return jsonify({ 
      'status': 'success',
      'message': 'Successfully logged out.',
      'error': None
    }), 200
