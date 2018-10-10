import os

from flask import Flask

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend/dist')
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend/dist')

def create_app(test_config=None):
    '''
      create and configure the app
    '''
    app = Flask(__name__, instance_relative_config=True, template_folder=tmpl_dir, static_folder=static_dir)
    app.config.from_mapping(
        SECRET_KEY='dev', # should be overridden with a random value when deploying
        DATABASE=os.path.join(app.instance_path, 'fitappdb.sqlite3'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from .database import db_utils
    db_utils.init_app(app)

    from .blueprints import fitapp_routes
    app.register_blueprint(fitapp_routes.bp)

    return app