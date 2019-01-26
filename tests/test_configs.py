from config import TestingConfig, DevelopmentConfig

def test_development_config(app):
    app.config.from_object(DevelopmentConfig)
    assert not app.config['TESTING']
    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite:////Users/gcalmettes/Git/fitApp-fullstack/instance/treasure.sqlite3'


def test_testing_config(app):
    app.config.from_object(TestingConfig)
    assert app.config['DEBUG']
    assert app.config['TESTING']
    assert not app.config['PRESERVE_CONTEXT_ON_EXCEPTION']
    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite://' 