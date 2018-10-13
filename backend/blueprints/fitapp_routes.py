from flask import (
    Blueprint, g, request, jsonify, 
    send_from_directory, render_template, current_app
)
import pandas as pd
import json

from backend.database.db_utils import addRecord, deleteRecord, get_db, execute_query, get_db_name
from models import utils, fitmethods

bp = Blueprint('data_processing', __name__)

@bp.route('/readdata', methods = ['POST'])
def readdata():
    jsdata = request.get_json()['data']
    json = utils.processFile(jsdata)
    return jsonify(json)


@bp.route('/savedata', methods = ['POST'])
def savedata():
    jsdata = request.get_json()['data']
    dataDict = {k: jsdata[i] for i,k in enumerate([
      'filename', 'trace', 'fit_param_d1', 'fit_param_a1', 'fit_param_d2',
      'fit_param_a2', 'fit_param_c', 'fit_idx_xstart', 'fit_idx_xend',
      'fit_value_ystart', 'fit_value_yend', 'ref_idx_xstart', 'ref_idx_xend',
      'ref_value_ystart', 'ref_value_yend'])}
    print('Received data:\n', dataDict)
    addRecord(jsdata)
    return jsonify({ 'response': 'record saved!', 'data': dataDict})


@bp.route('/sendtofit', methods = ['POST'])
def fit_data():
    jsdata = request.get_json()
    data = jsdata['data']
    dataRange = jsdata['fitRange']

    data = utils.convertJSONtoDF(data)
    outParams, outComponents = fitmethods.fitModel(data.x.values, data.y.values, dataRange)

    globalModel = outComponents[0]
    modelDf = pd.DataFrame({'x0': globalModel[0],
                            'x': globalModel[1],
                            'y': globalModel[2]})
    expo1Model = outComponents[1]
    expo1Df = pd.DataFrame({'x': expo1Model[1],
                            'y': expo1Model[2]})
    expo2Model = outComponents[2]
    expo2Df = pd.DataFrame({'x': expo2Model[1],
                            'y': expo2Model[2]})
    constantModel = outComponents[3]
    constantDf = pd.DataFrame({'x': constantModel[1],
                               'y': [constantModel[2] for i in range(len(constantModel[1]))]})
    return jsonify({
      'model': {
        'data': json.loads(modelDf.to_json(orient='records')),
        'params': {}
      },
      'expo1': {
        'data': json.loads(expo1Df.to_json(orient='records')),
        'params': {
          'decay': outParams.params['exp1_decay'].value,
          'amplitude': outParams.params['exp1_amplitude'].value
        }
      },
      'expo2': {
        'data': json.loads(expo2Df.to_json(orient='records')),
        'params': {
          'decay': outParams.params['exp2_decay'].value,
          'amplitude': outParams.params['exp2_amplitude'].value
        }
      },
      'constant': {
        'data': json.loads(constantDf.to_json(orient='records')),
        'params': {
          'c': outParams.params['c'].value
        }
      }
    })

########################################
## database
########################################

@bp.route("/viewdb", methods = ['POST'])
def viewall(dbname=get_db_name()):
    db = get_db()
    rows = execute_query(f"""SELECT * FROM {dbname}""")
    results = []
    for row in rows:
      results.append({
        'id': row[0],
        'name': row[1],
        'trace': row[2],
        'fit_d1': row[3],
        'fit_a1': row[4],
        'fit_d2': row[5],
        'fit_a2': row[6],
        'fit_c': row[7],
        'fit_amp': row[10]-row[11],
        'ref_amp': row[14]-row[15]
      })
    return jsonify({'data': results})

@bp.route("/deletedbentry", methods = ['POST'])
def delete_entry(dbname=get_db_name()):
    jsdata = request.get_json()
    id_to_delete =  jsdata['id']
    deleteRecord(id_to_delete)
    print(f'Row associated with id {id_to_delete} was deleted from {dbname}')
    rows = execute_query(f"""SELECT * FROM {dbname}""")
    results = []
    for row in rows:
      results.append({
        'id': row[0],
        'name': row[1],
        'trace': row[2],
        'fit_d1': row[3],
        'fit_a1': row[4],
        'fit_d2': row[5],
        'fit_a2': row[6],
        'fit_c': row[7],
        'fit_amp': row[10]-row[11],
        'ref_amp': row[14]-row[15]
      })
    return jsonify({'data': results, 'deletedID': id_to_delete})

########################################
## catch all 
########################################

@bp.route('/js/<path:filename>')
def serve_static_js(filename):
  static_dir = f"{current_app.instance_path}/../frontend/dist/js"
  return send_from_directory(static_dir, filename)

@bp.route('/css/<path:filename>')
def serve_static_css(filename):
  static_dir = f"{current_app.instance_path}/../frontend/dist/css"
  return send_from_directory(static_dir, filename)

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


