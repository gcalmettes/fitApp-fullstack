import json

from utils import register, login, logout
from app_server.models import User, Log


def test_register_user(app):
    """Ensure a new user can be added to the database."""
    
    # ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser = ['John', 'Doe', 'jdoe', 'password']
      
    with app.test_client() as client:
        response = register(client, *testUser)
        data = json.loads(response.data.decode())

    assert data['status'] == 'success'
    assert data['message'] == 'Successfully registered.'
    assert not data.get('access_token')
    assert response.content_type == 'application/json'
    assert response.status_code == 201
    assert not data['error']
    assert len(User.query.all()) == 1
    assert len(Log.query.all()) == 0 # no log should be written


def test_register_already_registered_user(app):
    """Ensure a new user cannot be registered if name already taken."""
    
    # ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser = ['John', 'Doe', 'jdoe', 'password']
      
    with app.test_client() as client:
        # register a user
        register(client, *testUser)
        assert len(User.query.all()) == 1
        assert len(Log.query.all()) == 0

        # try to register again
        response = register(client, *testUser)
        data = json.loads(response.data.decode())

    assert data['status'] == 'fail'
    assert data['message'] != 'Successfully registered.'
    assert not data.get('access_token')
    assert response.content_type == 'application/json'
    assert response.status_code == 417
    assert data['error'] == f'User name "{testUser[2]}" is already taken.'
    assert len(User.query.all()) == 1
    assert len(Log.query.all()) == 0


def test_login_non_registered_user(app):
    """Ensure a random user cannot log in."""
    
    # ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser = ['jdoe', 'password']
      
    with app.test_client() as client:
        response = login(client, *testUser)
        data = json.loads(response.data.decode())
        
    assert data['status'] == 'fail'
    assert data['message'] != 'Successfully logged in.'
    assert not data.get('access_token')
    assert response.content_type == 'application/json'
    assert response.status_code == 404
    assert data['error'] == 'Wrong credentials.'


def test_login_registered_user(app):
    """Ensure a registered user can log in."""
    
    # ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser = ['John', 'Doe', 'jdoe', 'password']
      
    with app.test_client() as client:
        register(client, *testUser)
        response = login(client, *testUser[2:])
        data = json.loads(response.data.decode())
    
    assert data['status'] == 'success'
    assert data['message'] == 'Successfully logged in.'
    assert data.get('access_token')
    assert response.content_type == 'application/json'
    assert response.status_code == 202  
    assert not data['error']
    assert len(User.query.all()) == 1
    assert len(Log.query.all()) == 1


def test_logout_user(app):
    """Ensure a registered user can log in."""
    
    # ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser = ['John', 'Doe', 'jdoe', 'password']
      
    with app.test_client() as client:
        register(client, *testUser)
        login(client, *testUser[2:])
        response = logout(client, *testUser[2:-1])
        data = json.loads(response.data.decode())
        
    assert response.content_type == 'application/json'
    assert data['status'] == 'success'
    assert data['message'] == 'Successfully logged out.'
    assert not data['error']
    assert response.status_code == 200
    assert len(User.query.all()) == 1
    assert len(Log.query.all()) == 2


