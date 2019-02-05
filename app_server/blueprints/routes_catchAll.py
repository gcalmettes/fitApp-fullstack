from pathlib import Path
from flask import (
    Blueprint,
    send_from_directory
)

bp = Blueprint('catch_all', __name__)

########################################
## catch all 
########################################

static_dir = Path.cwd() / 'app_frontend' / 'dist'

@bp.route('/js/<path:filename>')
def serve_static_js(filename):
  return send_from_directory(static_dir / "js", filename)

@bp.route('/styles/<path:filename>')
def serve_static_css(filename):
  return send_from_directory(static_dir / "styles", filename)

@bp.route('/', defaults={'path': ''})
@bp.route("/<string:path>")
@bp.route('/<path:path>')
def catch_all(path):
    return send_from_directory(static_dir, "index.html")




