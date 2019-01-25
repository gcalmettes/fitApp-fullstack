from pathlib import Path
from flask import Flask
from flask_jwt_extended import JWTManager

from sqlalchemy.exc import DatabaseError
from app_server.database.db_utils import init_engine, db_session


tmpl_dir = Path.cwd() / 'app_frontend' / 'dist'


def create_app(config=None, clear_db=False):
    '''
      create and configure the app
    '''
    app = Flask(__name__, instance_relative_config=True, template_folder=tmpl_dir)

    if config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_object(config)

    # connect the JWTmanager
    jwt = JWTManager(app)

    # initialize the db engine with config url
    init_engine(app.config.get('SQLALCHEMY_DATABASE_URI') or 'sqlite://', clear_db=clear_db)

    # ensure the instance folder exists
    Path.mkdir(Path(app.instance_path), parents=True, exist_ok=True)

    from .blueprints import routes_catchAll, routes_auth, routes_data
    app.register_blueprint(routes_auth.bp)
    app.register_blueprint(routes_data.bp)
    app.register_blueprint(routes_catchAll.bp)

    @app.teardown_appcontext
    def shutdown_session(exception_or_response=None):
        # if flushed change(s) in db, commit thoses change(s)
        if db_session.info.get('to_commit'):
            try:
                db_session.commit()
            except DatabaseError:
                db_session.rollback()
                print('Session has been rolled back...')
                return exception_or_response
        # close session
        db_session.remove()
        return exception_or_response


    return app