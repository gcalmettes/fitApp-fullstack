from functools import wraps
from flask import request, current_app, jsonify
import jwt

def get_payload():
    response = None
    payload = None
    authorization = request.headers.get('Authorization')
    if not authorization:
        response = jsonify({
            'error': 'Missing authorization header.'
        }), 401
    else:
        token = authorization.replace('Bearer ','')#.encode('ascii','ignore')
        try:
            payload = jwt.decode(token, current_app.config.get('SECRET_KEY'), algorithms=['HS256'])
            response = jsonify({
              'error': None
              }), 200
        except jwt.ExpiredSignatureError:
            response = jsonify({
                'error': 'Signature expired. Please log in again.'
            }), 401
        except jwt.InvalidTokenError:
            response = jsonify({
                'error': 'Invalid token. Please log in again.'
            }), 401
    return (response, payload)

def authorization_required(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        (response, code),payload = get_payload()
        error = response.get_json().get('error')
        if not error:
          try:
              user = payload['sub']
              return f(*args, **kws)
          except:
              import sys
              return jsonify({
                  'error': f"Unexpected error: {sys.exc_info()[0]}"
                }), 401
        else:
          return response,code
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kws):
        (response, code),payload = get_payload()
        error = response.get_json().get('error')
        if not error:
          try:
              admin = 'admin' in payload['context']['scopes']
              if admin:
                  return f(*args, **kws)
              else:
                  return jsonify({
                      'error': 'You are not authorized to access this ressource.'
                  }), 401
          except:
              import sys
              error = sys.exc_info()
              return jsonify({
                  'error': f"Unexpected error. {error[0].__name__}: {sys.exc_info()[1]}"
                }), 401
        else:
          return response,code
    return decorated_function