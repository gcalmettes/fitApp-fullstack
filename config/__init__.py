class BaseConfig(object):
    FRONTEND_FOLDER_NAME = 'app_frontend'
    ENV='production'
    TESTING = False
    # sqlite :memory: identifier is the default if no filepath is present
    SQLALCHEMY_DATABASE_URI = 'sqlite://' 
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = False
    # should be overridden with a random value when deploying e.g.:
    # import os
    # os.urandom(24)
    SECRET_KEY = "let's get more gold" 
    JWT_SECRET_KEY = 'jwt-super-secret-string'
    SQLALCHEMY_DATABASE_URI = 'sqlite:////Users/gcalmettes/Git/whydah/instance/treasure.sqlite3' 

class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SECRET_KEY = "let's get more gold"