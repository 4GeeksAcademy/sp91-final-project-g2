"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models import db, Users, Products, Orders, OrderItems, Comments
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    """
    Endpoint para manejar solicitudes GET en la ruta /hello.

    Este endpoint devuelve un mensaje de saludo en formato JSON.

    Returns:
        tuple: Un diccionario de respuesta con un mensaje y un código de estado HTTP 200.
    """
    # Crear un diccionario vacío para la respuesta
    response_body = {}
    # Agregar un mensaje al diccionario de respuesta
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    # Devolver el diccionario de respuesta y el código de estado 200
    return response_body, 200     


@api.route('/comments', methods=['GET', 'POST'])
def handle_comments():
    """
    Endpoint para manejar solicitudes GET y POST en la ruta /comments.
    
    - GET: Obtiene todos los comentarios.
    - POST: Añade un nuevo comentario.
    """
    if request.method == 'GET':
        # Obtener todos los comentarios de la base de datos
        comments = Comments.query.all()
        # Serializar los comentarios
        comments_serialized = [comment.serialize() for comment in comments]
        # Devolver los comentarios serializados en formato JSON
        return jsonify(comments_serialized), 200
    
    if request.method == 'POST':
        # Obtener el cuerpo de la solicitud en formato JSON
        request_body = request.get_json()
        # Verificar si el producto existe
        product = Products.query.get(request_body['product_id'])
        if not product:
            return jsonify({"error": "Producto no encontrado"}), 404  # Producto no existe
        # Crear un nuevo comentario con los datos proporcionados
        comment = Comments(
            product_id=request_body['product_id'],
            user_id=request_body['user_id'],
            title=request_body['title'],
            description=request_body['description'],
            date=datetime.now(datetime.timezone.utc)  # Asignar la fecha actual automáticamente
        )
        # Agregar el nuevo comentario a la sesión de la base de datos
        db.session.add(comment)
        # Confirmar la transacción
        db.session.commit()
        # Devolver el comentario recién creado en formato JSON
        return jsonify(comment.serialize()), 200
     

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

    #Hay que validar más cosas practicamente todo lo que se manda desde el front
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
    #Hacemos el insert
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


@api.route('users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
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
# CRUD del rol Is_admin
## CRUD DE PRODUCTOS

@api.route('/products', methods=['GET', 'POST'])
def products():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Products)).scalars()
        result = [ row.serialize() for row in rows ]
        response_body['message'] = 'Listado de todos los prodtos (de todos los usuarios)'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        print(data)
        row = Products(name=data.get('name'),
                       category=data.get('category'),
                       description=data.get('description'),
                       price=data.get('price'),
                       photo=data.get('photo'),
                       in_sell=data.get('in_sell'),
                       vendor_id=data.get('vendor_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'El producto ha sido publicado correctamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product(id):
    response_body = {}
    row = db.session.execute(db.select(Products).where(Products.id == id)).scalar()
    if not row:
        response_body['message'] =  f'El producto con id: {id} no existe en nuestro registos'
        return response_body, 400
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name = data['name']
        row.category = data['category']
        row.description = data['description']
        row.price = data['price']
        row.photo = data['photo']
        row.in_sell = data['in_sell']
        row.vendor_id = data['vendor_id']
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
@api.route('/admin/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
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


@api.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    response_body = {}
    additional_claims = get_jwt()   
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    if request.method == 'GET':
        rows = db.session.execute(db.select(Orders).where(Orders.customer_id == additional_claims.get('user_id'))).scalars()
        return {'message': 'Listado de órdenes', 'results': [row.serialize() for row in rows]}, 200
    if request.method == 'POST':
        if not additional_claims.get('is_customer', False):
            return {'message': 'Solo los clientes pueden crear órdenes'}, 403       
        data = request.json
        row = Orders(
            customer_id=additional_claims.get('user_id'),
            status=data.get('status'),
            date=data.get('date'),
            address=data.get('address'),
            total_price=data.get('total_price'))
        db.session.add(row)
        db.session.commit()
        return {'message': 'Orden añadida correctamente', 'results': row.serialize()}, 200


@api.route('/orders/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def order(id):
    response_body = {}
    additional_claims = get_jwt()
    row = db.session.execute(db.select(Orders).where(Orders.id == id)).scalar()  
    if not row:
        return {'message': f'La orden con id: {id} no existe en nuestros registros'}, 400  
    if additional_claims.get('user_id') != row.customer_id:
        return {'message': 'Acceso Denegado'}, 403  
    if request.method == 'GET':
        return {'results': row.serialize(), 'message': f'Respuesta desde el {request.method} para el id: {id}'}, 200   
    if request.method == 'PUT':
        data = request.json
        row.status = data['status']
        row.address = data['address']
        db.session.commit()
        return {'message': f'Orden actualizada correctamente', 'results': row.serialize()}, 200   
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        return {'message': 'Orden eliminada'}, 200


# Permite al Administrador obtener los comentarios de un usuario especifico.
@api.route('/admin/user-comments/<int:user_id>', methods=['GET'])
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
@api.route('/admin/user-comments/<int:user_id>/<int:comment_id>', methods=['PUT', 'DELETE'])
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
@api.route('/admin/user-products/<int:user_id>', methods=['GET'])
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
@api.route('/admin/user-products/<int:user_id>/<int:product_id>', methods=['PUT', 'DELETE'])
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
  

## OBTENER Y POSTEAR ORDERITEMS
@api.route('/orderitems', methods=['GET', 'POST'])
def orderitems():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(OrderItems)).scalars()
        result = [ row.serialize() for row in rows ]
        response_body['message'] = 'Listado de todos los items de orden'
        response_body['results'] = result
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        print(data)
        row = OrderItems(order_id=data.get('order_id'),
                         product_id=data.get('product_id'),
                         price=data.get('price'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'El item de orden ha sido añadido correctamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    

@api.route('/orderitems/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def orderitem(id):
    response_body = {}
    additional_claims = get_jwt()
    row = db.session.execute(db.select(OrderItems).where(OrderItems.id == id)).scalar() 
    if not row:
        return {'message': f'El item de orden con id: {id} no existe en nuestros registros'}, 400   
    if additional_claims.get('user_id') != row.order.customer_id and additional_claims.get('user_id') != row.product.vendor_id:
        return {'message': 'Acceso Denegado'}, 403  
    if request.method == 'GET':
        return {'results': row.serialize(), 'message': f'Respuesta desde el {request.method} para el id: {id}'}, 200   
    if request.method == 'PUT':
        data = request.json
        row.order_id = data['order_id']
        row.product_id = data['product_id']
        row.price = data['price']
        db.session.commit()
        return {'message': f'Actualizado correctamente', 'results': row.serialize()}, 200   
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        return {'message': 'Item eliminado'}, 200
    
