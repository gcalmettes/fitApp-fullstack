from pathlib import Path
from flask import (
    Blueprint,
    send_from_directory, render_template, current_app
)

bp = Blueprint('catch_all', __name__)

########################################
## catch all 
########################################

@bp.route('/js/<path:filename>')
def serve_static_js(filename):
  static_dir = ( Path(current_app.instance_path).parent /
                 current_app.config.get('FRONTEND_FOLDER_NAME') / 'dist')
  return send_from_directory(static_dir / "js", filename)

@bp.route('/styles/<path:filename>')
def serve_static_css(filename):
  static_dir = ( Path(current_app.instance_path).parent /
                 current_app.config.get('FRONTEND_FOLDER_NAME') / 'dist')
  return send_from_directory(static_dir / "styles", filename)

@bp.route('/', defaults={'path': ''})
@bp.route("/<string:path>")
@bp.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")




