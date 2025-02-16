"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


# Obtengo todos los usuarios, no importa el rol que tengan
@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [ row.serialize() for row in rows]
        response_body['message'] = 'Listado de usuarios'
        response_body['results'] = result
        return response_body, 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route('/login', methods=['POST'])
def login():
    response_body = {}
    data = request.json
    email = data.get('email', None)
    password = data.get('password', None)
    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if not row:
        response_body['role'] = 'User not found'
        return response_body, 401
    user = row.serialize()
    if user['is_admin']:
        response_body['role'] = 'Administrador'
    elif user['is_vendor']:
        response_body['role'] = 'Vendedor'
    elif user['is_costumer']:
        response_body['role'] = 'Cliente'
    else:
        response_body['message'] = 'Invitado'    
    claims = {'user_id': user['id'],
              'is_active': user['is_active'],
              'is_admin': user['is_admin'],
              'is_vendor': user['is_vendor'],
              'is_customer': user['is_customer']}
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['access_token'] = access_token
    response_body['message'] = 'User logged'
    response_body['results'] = user
    return response_body, 200

# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity() # Email
    additional_claims = get_jwt() # Claims definidos en el login
    response_body['message'] = 'Token valido'
    return response_body, 200

   
@api.route('/signup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password:
        response_body['message'] = 'Email or password are required'
        return response_body, 400
    
    user_register = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if user_register:
        response_body['message'] = 'User alredy exist'
        return response_body, 400
    
    row = Users(email = data.get('email'),
                password = data.get('password'),
                first_name = data.get('first_name'),
                last_name = data.get('last_name'),
                address = data.get('address'),
                is_active = True,
                is_customer= True if role == 'customer' else False,
                is_vendor= True if role == 'vendor' else False)
    
    db.session.add(row)
    db.session.commit()
    user = row.serialize()
    claims = {'user_id': user['id'],
              'first_name': user['first_name'],
              'last_name': user['last_name'],
              'phone': user['phone'],
              'address': user['address'],
              'is_customer': user['is_customer'],
              'is_vendor': user['is_vendor']}
    
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['access_token'] = access_token
    response_body['message'] = 'Usuario registrado'
    response_body['results'] = user
    return response_body, 200    

# CRUD del rol Is_admin
