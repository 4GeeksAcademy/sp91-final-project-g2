"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Comments, Products
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


user = Blueprint('user', __name__)
CORS(user)  # Allow CORS requests to this API


@user.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


# Obtengo todos los usuarios, no importa el rol que tengan
@user.route('/users', methods=['GET'])
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
@user.route('/login', methods=['POST'])
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
@user.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity() # Email
    additional_claims = get_jwt() # Claims definidos en el login
    response_body['message'] = 'Token valido'
    return response_body, 200

   
@user.route('/signup', methods=['POST'])
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


@user.route('users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user_account(id):
    response_body = {}
    additional_claims = get_jwt()
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not row:
        response_body['message'] = f'Usuario con id:{id} no encontrado'
        return response_body, 400
    if id != additional_claims['user_id']:
        response_body['message'] = 'No tiene autorización para esta acción'
        return response_body, 401
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.first_name = data.get('first_name')
        row.last_name = data.get('last_name')
        row.phone = data.get('phone')
        row.address = data.get('address')
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    elif request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        return response_body, 200
    

# Endpoints para el rol de administrador
# Permite al Administrador obtener los datos de los vendedores y clientes y a la vez editarlos y/o darlos de baja.
@user.route('/admin/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def admin_user_management(id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalars()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        return response_body, 200
    if response_body == 'PUT':
        data = request.json
        row.first_name = data.get('first_name', row.first_name)
        row.last_name = data.get('last_name', row.last_name)
        row.phone = data.get('phone', row.phone)
        row.address = data.get('address', row.address)
        row.is_customer = data.get('is_customer', row.is_customer)
        row.is_vendor = data.get('is_vendor', row.is_vendor)
        row.is_active = data.get('is_active', row.is_active)
        db.session.commit()
        response_body['message'] = 'Usuario actualizado existosamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = 'Usuario eliminado'
        return response_body, 200


# Permite al Administrador obtener los comentarios de un usuario especifico.
@user.route('/admin/user-comments/<int:user_id>', methods=['GET'])
@jwt_required()
def admin_get_comments_management(user_id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    comments = db.session.execute(db.select(Comments).where(Comments.user_id == user_id)).scalars()
    comments_list = [comment.serialize() for comment in comments]
    response_body['message'] = f'Comentarios del usuario {user_id}'
    response_body['results'] = comments_list
    return response_body, 200

# Permite al Administrador editar o eliminar un comentario de un usuario especifico.
@user.route('/admin/user-comments/<int:user_id>/<int:comment_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def admin_user_comments_management(user_id, comment_id):
    response_body = {}
    aditional_claims = get_jwt()
    if not aditional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    comment = db.session.execute(db.select(Comments).where(Comments.id == comment_id, Comments.user_id == user_id)).scalar()
    if not comment:
        response_body['message'] = 'Comentario no encontrado'
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        comment.title = data.get('title', comment.title)
        comment.description = data.get('description', comment.description)
        # Media va para la versión 2.0
        db.session.commit()
        response_body['message'] = 'Comentario editado'
        response_body['results'] = comment.serialize()
        response_body, response_body, 200
    if request.method == 'DELETE':
        db.session.delente(comment)
        db.session.commit()
        response_body['message'] = 'Comentario eliminado'
        return response_body, 200


# Permite al Administrador obtener los productos publicados por un usuario con rol de vendedor.
@user.route('/admin/user-products/<int:user_id>', methods=['GET'])
@jwt_required()
def admin_get_products_management(user_id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    vendor = db.session.execute(db.select(Users).where(Users.id == user_id, Users.is_vendor == True)).scalar
    if not vendor:
        response_body['message'] = 'El usuario no es un vendedor'
        return response_body, 404
    products = db.session.execute(db.select(Products).where(Products.vendor_id == user_id)).scalars()
    product_list = [product.serialize() for product in products]
    response_body['message'] = f'Productos publicados por el vendedor {user_id}'
    response_body['results'] = product_list
    return response_body, 200


# Permite al Administrador editar o eliminar un producto publicado por un usuario con rol vendor.
@user.route('/admin/user-products/<int:user_id>/<int:product_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def admin_user_products_management(user_id, product_id):
    response_body = {}
    aditional_claims = get_jwt()
    if not aditional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    product = db.session.execute(db.select(Products).where(Products.id == product_id, Products.vendor_id == user_id)).scalar()
    if not product:
        response_body['message'] = 'Producto no encontrado'
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        product.name = data.get('name', product.name)
        product.category = data.get('category', product.category)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.photo = data.get('photo', product.photo)
        product.in_sell = data.get('in_sell', product.in_sell)
        db.session.commit()
        response_body['message'] = 'Producto editado'
        response_body['results'] = product.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        response_body['message'] = 'Producto eliminado'
        return response_body, 200


# Endpoints de Order y Order Items
# Permite a un user con rol de customer el poder ver sus perdidos.

