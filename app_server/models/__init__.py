import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from flask import current_app
from app_server.database.db_utils import myBase

import jwt
from app_server.security.encryption import pwd_context

class User(myBase):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    firstname = Column(String(255), unique=False)
    lastname = Column(String(255), unique=False)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    registered_on = Column(DateTime, nullable=False)
    admin = Column(Boolean, nullable=False, default=False)
    logs = relationship('Log')

    def __init__(self, firstname=None, lastname=None, 
                 username=None, password=None, admin=False):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password = self.encode_pwd(password)
        self.registered_on = datetime.datetime.now()
        self.admin = admin

    def __repr__(self):
        return f'<User {self.username!r}>'

    ##########################
    ## encryption
    ##########################
    @staticmethod
    def encode_pwd(password):
      return pwd_context.hash(password)

    def verify_pwd(self, password, hash_to_compare_to=None):
      hash_to_compare_to = hash_to_compare_to or self.password
      return pwd_context.verify(password, hash_to_compare_to)

    ##########################
    ## jwt authentication
    ##########################
    def get_token_content(self):
      """ return subject informations to be encoded in token """
      scopes = {
        'admin': self.admin
      }
      content = {
        'sub': self.username,
        'context': {
            'user': {
                'key': self.username,
                'displayName': self.firstname
            },
            'scopes': [k for (k,v) in scopes.items() if v]
        }
      }
      return content


    def encode_auth_token(self, sub=None):
      """
      Generates the Auth Token. Use user-generated subject by default.
      :return: string
      """
      sub = sub or self.get_token_content()
      try:
          payload = {
              'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, hours=3),
              # 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=10),
              'iat': datetime.datetime.utcnow(),
              **sub
          }
          return jwt.encode(
              payload,
              current_app.config.get('SECRET_KEY'),
              algorithm='HS256'
          )
      except Exception as e:
          print('error')
          return e

      @staticmethod
      def decode_auth_token(auth_token):
          """
          Decodes the auth token
          :param auth_token:
          :return: integer|string
          """
          try:
              payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
              return payload['sub']
          except jwt.ExpiredSignatureError:
              return 'Signature expired. Please log in again.'
          except jwt.InvalidTokenError:
              return 'Invalid token. Please log in again.'
      

class Log(myBase):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(255), unique=False)
    timestamp = Column(DateTime, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User')

    def __init__(self, type=None, user_id=None):
        self.type = type
        self.user_id = user_id
        self.timestamp = datetime.datetime.now()

    def __repr__(self):
        return f'<Log {self.type} ({self.user.username})>'
