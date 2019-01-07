from flask import (
    Blueprint, request, jsonify
)

from sqlalchemy import func
from sqlalchemy.exc import OperationalError

from sqlalchemy.ext.automap import automap_base
from app_server.database.db_utils import myBase, engine

from data_processing import utils, fitmethods

autoBase = automap_base(myBase)
# reflect the tables
autoBase.prepare(engine, reflect=True)

bp = Blueprint('data', __name__)

@bp.route('/data/process', methods=['POST'])
def getData():
    file_name = request.json.get('fileName')
    file_data = request.json.get('fileData')
    
    if not file_data:
      response = jsonify({ 
        'message': 'No data associated with this file.',
        'data': None
      }), 200

    else:
      data = utils.processFile(file_data)
      response = jsonify({ 
        'message': 'Data received.',
        'dataset': data
      }), 200
    return response