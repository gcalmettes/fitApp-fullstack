import argparse
from pathlib import Path

from app_server import create_app


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument("--dev", help="Watch for static files changes", action="store_true")
    parser.add_argument("--host", help="Specify host to serve", default='127.0.0.1')
    parser.add_argument("--port", help="Specify port to serve", type=int, default=5000)
    parser.add_argument("--initdb", help="Initialize database", action="store_true")
    parser.add_argument("--test", help="Run the test suite", action="store_true")
    args = parser.parse_args()

    # initialize new database if needed
    if args.initdb:
      from app_server.database.db_utils import init_engine
      from config import DevelopmentConfig
      init_engine(DevelopmentConfig.SQLALCHEMY_DATABASE_URI, clear_db=True)

    # dev mode: watch file and autoreload
    if args.dev:
      from config import DevelopmentConfig
      app = create_app(config=DevelopmentConfig)


      # watch files and autoreload using livereload
      from livereload import Server
      server = Server(app.wsgi_app)
      static_dir = Path.cwd() / 'app_frontend' / 'dist'
      server.watch((static_dir / 'index.html').as_posix())
      server.watch((static_dir / 'js' / 'bundle.js').as_posix())
      server.watch((static_dir / 'styles' / 'main.css').as_posix())
      server.serve(port=args.port, host=args.host)

  
    elif args.test:
      import pytest
      """Runs the unit tests without test coverage."""
      pytest.main(["-s", "tests"])
      
      
