from flask import (
    Blueprint, request, jsonify
)

import json

from app_server.security.authorization import authorization_required

from data_processing import utils, fitmethods
from app_server.models import User, DataFit

bp = Blueprint('data', __name__)

@bp.route('/data/process', methods=['POST'])
def get_Data():
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

@bp.route('/data/fit', methods = ['POST'])
def fit_data():
    data = request.json.get('data')
    fit_type = request.json.get('type')

    data = utils.convertJSONtoDF(data)
    fit_data = fitmethods.fitModel(data.x.values, data.y.values, model=fit_type)

    response = jsonify({
      'data': fit_data,
      'message': 'Fitting process executed.'
    }), 200
    return response

@bp.route('/data/save', methods=['POST'])
@authorization_required
def save_Data():
    data = request.json.get('data')
    username = request.json.get('username')

    error = None
    message = 'An error occured. '

    # fetch the user data
    user = User.query.filter_by(username=username).first()
    if not user:
        error = 'User unknown.'
        message += error
    if not data:
        error = 'Data not received.'
        message += error

    if not error:
        # save data to db
        newData = DataFit(
            filename=data['fileName'], trace_number=data['traceNumber'], 
            fit_method=data['fitModel'], fit_lowerLim=data['fitRange'][0], 
            fit_upperLim=data['fitRange'][1], fit_model=data['model']['components'],
            fit_params=json.dumps(data['model']['params']),
            comment=data['comment'], user_id=user.id
        ).save()

        message = f'Data from {user.username} received and saved in database.'

    response = jsonify({ 
      'status': 'success' if not error else 'fail',
      'message': message,
      'error': error,
    }), 200 if not error else 404
    return response