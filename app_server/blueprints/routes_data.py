from flask import (
    Blueprint, request, jsonify
)

import json

from app_server.security.authorization import authorization_required

from data_processing import utils, fitmethods, trendcorrection
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

@bp.route('/data/fit', methods=['POST'])
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

@bp.route('/data/correct', methods=['POST'])
def correct_trend():
    data = request.json.get('data')
    startIdx = request.json.get('startIdx', 0)

    data = utils.convertJSONtoDF(data).transpose()
    corrected_data = trendcorrection.correct_data(data.x.values, data.y.values, startIdx=startIdx)

    response = jsonify({
      'data': corrected_data,
      'message': 'Trend correction applied.'
    }), 200
    return response

@bp.route('/data/view', methods=['POST'])
@authorization_required
def view_Data():
    # User is the name of table that has a column name
    all_Data = DataFit.query.all()
    formatted_data = [{
        'id': data.id,
        'fileName': data.filename,
        'traceNumber': data.trace_number,
        'fitMethod': data.fit_method,
        'fitRange': [data.fit_lowerLim, data.fit_upperLim],
        'fitModel': data.fit_model,
        'fitParams': data.fit_params,
        'comment': data.comment,
        } for data in all_Data]

    response = jsonify({ 
      'status': 'success',
      'message': f'{len(all_Data)} rows have been retrieved.',
      'data': formatted_data,
      'error': None,
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
    if not data.get('comment'):
        error = 'A comment needs to be associated with the data.'
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


@bp.route('/data/delete', methods=['POST'])
@authorization_required
def delete_Data():
    idToDelete = request.json.get('id')

    # fetch the user data
    row = DataFit.query.filter_by(id=idToDelete).first()
    row.delete()

    return view_Data()

@bp.route('/data/modify_comment', methods=['POST'])
@authorization_required
def modify_Data():
    idToModify = request.json.get('id')
    new_comment = request.json.get('newComment')

    # fetch the user data
    row = DataFit.query.filter_by(id=idToModify).first()
    row.update(comment= new_comment)

    return view_Data()

@bp.route('/data/export', methods=['POST'])
@authorization_required
def export_Data():
    # cols = [c.name for c in DataFit.__table__.columns]
    # pk = [c.name for c in DataFit.__table__.primary_key]
    # tuplefied_list = [(getattr(item, col) for col in cols) for item in DataFit.query.all()]
    # df = pd.DataFrame.from_records(tuplefied_list, index=pk, columns=cols)
    import pandas as pd
    df = pd.read_sql_table('datafit', DataFit.query.session.get_bind())
    # df['user'] = [record.user.username for record in DataFit.query.all()]
    data = df.to_json(orient='records')

    response = jsonify({ 
      'status': 'success',
      'data': data,
      'message': 'The data have been exported.',
    }), 200
    return response
