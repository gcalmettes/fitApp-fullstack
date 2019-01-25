import json

from utils import register, login, logout
from app_server.models import User, Log
from flask import current_app


def test_encode_auth_token(app):
    """Ensure a new user can be added to the database."""
    
    #ensure db is empty to start width
    assert len(User.query.all()) == 0
    assert len(Log.query.all()) == 0

    testUser1 = ['John', 'Doe', 'jdoe', 'password']
    testUser2 = ['Karl', 'Smith', 'ksmith', 'pwd']

    user = User(*testUser1).save()
    otheruser = User(*testUser2).save()

    assert len(User.query.all()) == 2
    assert len(Log.query.all()) == 0

    user_retrieved = User.query.filter_by(username=testUser1[2]).first()
    otheruser_retrieved = User.query.filter_by(username=testUser2[2]).first()

    with app.app_context():
      token1 = user_retrieved.encode_auth_token()
      token2 = user.encode_auth_token(user_retrieved.get_token_content())
      token3 = otheruser.encode_auth_token()
      token4 = otheruser.encode_auth_token(user_retrieved.get_token_content())
      assert isinstance(token1, bytes)
      assert isinstance(token2, bytes)
      assert isinstance(token3, bytes)
      assert token1 == token2
      assert token1 != token3
      assert token1 == token4