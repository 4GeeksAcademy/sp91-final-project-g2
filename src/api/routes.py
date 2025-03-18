"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models import db, Users, Products, Orders, OrderItems, Comments, FavoriteProducts
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from datetime import datetime


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


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
    ##  aca buscamos el order id del usuario en caso de tenerla, si no lo tiene, devolvemos order id con none
    row_order = db.session.execute(db.select(Orders).where(Orders.customer_id == user['id'])).scalar()
    user['order_id'] = row_order.serialize()['id'] if row_order else None
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
        response_body['message'] = 'User already exist'
        return response_body, 400
    row = Users(email = data.get('email'),
                password = data.get('password'),
                first_name = data.get('first_name'),
                last_name = data.get('last_name'),
                address = data.get('address'),
                is_active = True,
                is_customer= True if role == 'customer' else False,
                is_vendor= True if role == 'vendor' else False,
                is_admin= True if role == 'admin' else False)
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
    response_body['message'] = 'Register success'
    response_body['results'] = user
    return response_body, 200    


# Endpoints para el rol de administrador
# Obtengo todos los usuarios, no importa el rol que tengan
@api.route('/users', methods=['GET'])
@jwt_required()
def users():
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [ row.serialize() for row in rows]
        response_body['message'] = 'Listado de usuarios'
        response_body['results'] = result
        return response_body, 200


# Permite al Administrador obtener los datos de los vendedores y clientes y a la vez editarlos y/o darlos de baja.
# Permite al usuario, sea vendedor o cliente, ver y editar su datos y se puede dar de baja (Desactivar).
@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user_management(id):
    response_body = {}
    additional_claims = get_jwt()
    user_id = additional_claims.get('user_id', None)
    is_admin = additional_claims.get('is_admin', False)
    if not (is_admin or user_id == id):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403   
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    if request.method == 'GET':
        if not row.is_active and not is_admin:
            response_body['message'] = 'Usuario no activo'
            return response_body, 404
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.first_name = data.get('first_name', row.first_name)
        row.last_name = data.get('last_name', row.last_name)
        row.phone = data.get('phone', row.phone)
        row.address = data.get('address', row.address)
        row.is_active = data.get('is_active', row.is_active)
        if is_admin:
            row.is_customer = data.get('is_customer', row.is_customer)
            row.is_vendor = data.get('is_vendor', row.is_vendor)
            row.is_active = data.get('is_active', row.is_active)
        db.session.commit()
        response_body['message'] = 'Usuario actualizado existosamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        # Pasar a estado inactivo
        if not is_admin:
            response_body['message'] = 'Solo administrador puede eliminar usuarios'
            return response_body, 403
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Usuario {id} eliminado'
        return response_body, 200


@api.route('/order/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def order(id):
    response_body = {}
    additional_claims = get_jwt()
    row = db.session.execute(db.select(Orders).where(Orders.id == id)).scalar()
    if not row:
        response_body['message'] = f'La orden con id: {id} no existe en nuestros registros'
        response_body['results'] = None
        return response_body, 400
    # Solo el cliente que hizo la orden puede acceder
    if additional_claims.get('user_id') != row.customer_id:
        response_body['message'] = 'Acceso Denegado'
        response_body['results'] = None
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.status = data['status']
        row.address = data['address']
        db.session.commit()
        response_body['message'] = 'Orden actualizada correctamente'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = 'Orden eliminada correctamente'
        response_body['results'] = None
        return response_body, 200


# COMMENTS
# Permite al Administrador obtener los comentarios de un usuario especifico.
@api.route('/users/<int:user_id>/comments', methods=['GET'])
@jwt_required()
def admin_get_comments_management(user_id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    comments = db.session.execute(db.select(Comments).where(Comments.user_id == user_id).order_by(Comments.date.desc())).scalars()
    comments_list = [comment.serialize() for comment in comments]
    response_body['message'] = f'Comentarios del usuario {user_id}'
    response_body['results'] = comments_list
    return response_body, 200


# Permite al Administrador eliminar un comentario de un usuario especifico.
@api.route('/users/<int:user_id>/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def admin_user_comments_management(user_id, comment_id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    comment = db.session.execute(db.select(Comments).where(Comments.id == comment_id, Comments.user_id == user_id)).scalar()
    if not comment:
        response_body['message'] = 'Comentario no encontrado'
        return response_body, 404
    db.session.delete(comment)
    db.session.commit()
    response_body['message'] = 'Comentario eliminado'
    return response_body, 200


# Permite a un usuario crear un comentario y este se asocia a su ID
@api.route('/comments', methods=['POST'])
@jwt_required()
def user_post_comments():
    response_body = {}
    additional_claims = get_jwt()
    if not (additional_claims.get('is_customer') or additional_claims.get('is_vendor')):
        response_body['message'] = 'Debe tener una cuenta activa para poder comentar'
        return response_body, 401
    # Obtener el id del usuario para asociarlo
    user_id = additional_claims.get('user_id')
    if not user_id:
        response_body['message'] = f'Usuario con id: {user_id} no encontrado'
        return response_body, 401
    data = request.json
    # Verificar si el producto existe
    product = db.session.execute(db.select(Products).where(Products.id == data.get('product_id'))).scalar()
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404  # Producto no existe
    new_comment = Comments(
        product_id=data.get('product_id'),
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        date=datetime.utcnow()
    )
    db.session.add(new_comment)
    db.session.commit()
    response_body['message'] = 'Comentario creado'
    response_body['comment'] = new_comment.serialize()
    return response_body, 201


# Permite al Administrador obtener los productos publicados por un usuario con rol de vendedor.
@api.route('/users/<int:user_id>/products', methods=['GET'])
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


# Permite al Administrador editar o eliminar un producto publicado por un usuario con rol vendor / Deshabilitar el producto / 
@api.route('/users/<int:user_id>/products/<int:product_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def users_product_management(user_id, product_id):
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
    

# PRODUCTOS
#Permite a un usuario con role de vendedor, el obtener todos los productos publicados con su ID
@api.route('/vendor/<int:vendor_id>/products', methods=['GET'])
@jwt_required()
def vendor_get_products(vendor_id):
    response_body = {}
    aditional_claims = get_jwt()
    user_vendor_id = aditional_claims.get('vendor_id') 
    if not aditional_claims.get('is_vendor', False) or user_vendor_id != vendor_id:
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    products = db.session.execute(db.select(Products).where(Products.vendor_id == id)).scalars()
    product_list = [product.serialize() for product in products]
    response_body['message'] = f'Productos publicados por el vendedor {vendor_id}'
    response_body['results'] = product_list
    return response_body, 200


# Permite a un vendedor publicar un producto el cual se encuentra asociado a su ID
@api.route('/vendors/<int:id>/products', methods=['POST'])
@jwt_required()
def vendor_post_products(id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_vendor', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    vendor_id = additional_claims.get('user_id')
    if vendor_id != id:
        response_body['message'] = f'Usuario con id: {id} no coincide, Acceso Denegado'
        return response_body, 403
    print("hgajkshdjkahsjkdj")
    data = request.json
    print(data)
    if not data:
        response_body['message'] = 'Datos de entrada inválidos'
        return response_body, 400
    row = Products(name=data.get('name'),
                    category=data.get('category'),
                    description=data.get('description'),
                    price=float(data.get('price')),
                    photo=data.get('photo'),
                    vendor_id=(vendor_id))
    db.session.add(row)
    db.session.commit()
    response_body['message'] = f'El producto ha sido publicado correctamente'
    response_body['results'] = row.serialize()
    return response_body, 200


# Permite a un vendedor, buscar un producto que se encuentre asociado a su ID y modificarlo o eliminarlo
@api.route('/vendors/<int:id>/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def product(id, product_id):
    response_body = {}
    aditional_claims = get_jwt()
    if not aditional_claims.get('is_vendor', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    vendor_id = aditional_claims.get('user_id')
    if vendor_id != id:
        response_body['message'] = 'No puede modificar producto de otro vendedor'
        return response_body, 404
    row = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
    if not row:
        response_body['message'] =  f'El producto con id: {product_id} no existe en nuestro registos'
        return response_body, 400
    if row.vendor_id != vendor_id:
        response_body['message'] = f'Producto no se encuentra asociado al vendedor'
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Listado de productos publicado por el vendedor con id: {id}'
        response_body['results'] = row.serialize()
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
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        return response_body, 200


# Permite a un usuario no importa el rol, ver todo el listado de productos
@api.route('/products', methods=['GET'])
def products():
    response_body = {}
    products = db.session.execute(db.select(Products)).scalars()
    product_list = [product.serialize() for product in products]
    response_body['message'] = 'Listado de todos los productos'
    response_body['results'] = product_list
    return jsonify(response_body), 200


# Permite pasar a un producto a estado inactivo y obtener información de un producto especifico - NUEVO
@api.route('/products/<int:id>', methods=['GET', 'PUT'])
@jwt_required()
def update_product(id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_admin', False):
        response_body['message'] = 'Acceso Denegado'
        return jsonify(response_body), 403
    row = db.session.execute(db.select(Products).where(Products.id == id)).scalar()
    if not row:
        response_body['message'] = 'Producto no encontrado'
        return response_body, 404
    if request.method == 'GET':
        response_body['message'] = 'Detalle del producto'
        response_body['results'] = row.serialize()
        return jsonify(response_body), 200
    if request.method == 'PUT':   
        data = request.json
        row.name = data.get('name', row.name)
        row.category = data.get('category', row.category)
        row.description = data.get('description', row.description)
        row.price = data.get('price', row.price)
        row.photo = data.get('photo', row.photo)
        row.in_sell = data.get('in_sell', row.in_sell)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method} para el id: {id}'
        response_body['results'] = row.serialize()
        return jsonify(response_body), 200    


# Productos favoritos
# SEPARAR EL DELETE CON UN ID - el id debe llegar en el endpoint
@api.route('/favorites', methods=['GET', 'POST'])
@jwt_required()
def customer_favorites():
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    customer_id = additional_claims.get('user_id')
    if request.method == 'GET':
        rows = db.session.execute(db.select(FavoriteProducts).where(FavoriteProducts.customer_id == customer_id)).scalars()
        favorite_list = [{"favorite_id": row.id,
                          "product": row.product_to.serialize()} for row in rows]
        response_body['message'] = 'Lista de productos favoritos'
        response_body['results'] = favorite_list
        return response_body, 200
    data = request.json
    product_id = data.get('product_id')
    if not product_id:
        response_body['message'] = 'Falta incluir el ID del producto'
        return response_body, 400
    product = db.session.get(Products, product_id)
    if not product:
        response_body['message'] = f'El producto con ID {product_id} no existe'
        return response_body, 404
    if request.method == 'POST':
        existing_favorite = db.session.execute(db.select(FavoriteProducts).where(FavoriteProducts.customer_id == customer_id, FavoriteProducts.product_id == product_id)).scalar()
        if existing_favorite:
            response_body['message'] = 'Este producto ya está en la lista de favoritos'
            return response_body, 409
        new_favorite = FavoriteProducts(product_id = product_id,
                                        customer_id = customer_id)
        db.session.add(new_favorite)
        db.session.commit()
        response_body['message'] = 'Producto incluido con éxito'
        response_body['results'] = new_favorite.serialize()
        return response_body, 200


@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return response_body, 403
    customer_id = additional_claims.get('user_id')
    delete_favorite = db.session.execute(db.select(FavoriteProducts).where(FavoriteProducts.customer_id == customer_id, FavoriteProducts.id == id)).scalar()
    if not delete_favorite:
        response_body['message'] = 'El producto no se encuentra incluido en su lista de favoritos'
        return response_body, 404
    db.session.delete(delete_favorite)
    db.session.commit()
    response_body['message'] = 'Producto eliminado de la lista de favoritos'
    return response_body, 200   


## CRUD para Comments
# Permite a un user crear un comments y este se asocia su ID
@api.route('/comments', methods=['GET'])
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


# Permite a un User, editar o eliminar un comentario que haya creado y se encuentre vinculado a su ID
@api.route('/comments/<int:comment_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def user_edit_comment(comment_id):
    response_body = {}
    additional_claims = get_jwt()
    if not (additional_claims.get('is_customer') or additional_claims.get('is_vendor')):
        response_body['message'] = 'Debe tener una cuenta activa para poder comentar'
        return response_body, 401
    user_id = additional_claims.get('user_id')
    if not user_id:
        response_body['message'] = f'Usuario con id: {id} no encontrado'
        return response_body, 401
    comment = db.session.get(Comments, comment_id)
    if not comment:
        response_body['message'] = f'Comentario con id: {id} no encontrado'
        return response_body, 404
    if comment.user_id != user_id:
        response_body['message'] = 'No tiene permiso para modificar o eliminar este comentario'
        return response_body, 403
    if request.method == 'PUT':
        data = request.json
        if 'title' in data:
            comment.title = data['title']
        if 'description' in data:
            comment.description = data['description']
        comment.date = int(datetime.timestamp(datetime.now()))
        db.session.commit()
        response_body['message'] = 'Cometario actualizado'
        response_body['comment'] = comment.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        response_body['message'] = f'Comentario con id: {comment_id} fue eliminado'
        return response_body, 200


## CRUD para ORDERS
@api.route('/orders', methods=['GET', 'POST'])
@jwt_required()
def orders():
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return jsonify(response_body), 403
    user_id = additional_claims.get('user_id')
    if request.method == 'GET':
        rows = db.session.execute(db.select(Orders).where(Orders.customer_id == user_id)).scalars()
        response_body['message'] = 'Listado de órdenes'
        response_body['results'] = [row.serialize() for row in rows]
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        new_order = Orders(
            customer_id=user_id,
            status=data.get('status', 'Pendiente'),  # Estado por defecto "pendiente"
            address=data.get('address', ''),
            total_price=data.get('total_price', 0.0))  # Default en caso de no recibirlo
        db.session.add(new_order)
        db.session.commit()
        response_body['message'] = 'Pedido creado exitosamente'
        response_body['order_id'] = new_order.id
        return jsonify(response_body), 201
    

@api.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    response_body = {}
    additional_claims = get_jwt()   
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return jsonify(response_body), 403
    user_id = additional_claims.get('user_id')
    order = db.session.get(Orders, order_id)
    if not order:
        response_body['message'] = 'Orden no encontrada'
        return jsonify(response_body), 404
    if order.customer_id != user_id:
        response_body['message'] = 'No puedes modificar esta orden'
        return jsonify(response_body), 403
    data = request.json
    if 'status' in data:
        # Validar que el status sea uno de los permitidos
        if data['status'] not in ["Pendiente", "Vendida"]:
            response_body['message'] = 'Estado no válido. Usa "Pendiente" o "Vendida".'
            return jsonify(response_body), 400
        order.status = data['status']
    if 'address' in data:
        order.address = data['address']
    db.session.commit() ## Estaba dentro del IF por eso no actualizaba.
    response_body['message'] = 'Dirección de la orden actualizada correctamente'
    response_body['order_id'] = order.id
    return jsonify(response_body), 200
    

## OBTENER Y POSTEAR ORDERITEMS
@api.route('/orderitems', methods=['GET', 'POST'])
@jwt_required()
def orderitems():
    response_body = {}
    additional_claims = get_jwt()
    if not additional_claims.get('is_customer', False):
        response_body['message'] = 'Acceso Denegado'
        return jsonify(response_body), 403
    if request.method == 'GET':
        rows = db.session.execute(db.select(OrderItems)).scalars()
        response_body['message'] = 'Listado de todos los items de orden'
        response_body['results'] = [row.serialize() for row in rows]
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        # Validaciones: Existen la orden y el producto?
        product = db.session.get(Products, data.get('product_id'))
        if not product:
            response_body['message'] = 'El producto especificado no existe'
            return jsonify(response_body), 404
        
        order_id = data.get('order_id')  # Si viene, se asocia a esa orden
        user_id = additional_claims['user_id']
        
        if order_id: 
            # determinamos si la orden existe
            row_order = db.session.execute(
                db.select(Orders).where(Orders.id == order_id, Orders.customer_id == user_id)
            ).scalar()
            if not row_order:
                response_body['message'] = 'No autorizado o la orden no existe'
                return response_body, 404
        else: 
            # creamos la orden
            row_order = Orders(
                customer_id=user_id,
                status="Pendiente",
                total_price=0, 
                address=data.get('address', '')
            )
            db.session.add(row_order)
            db.session.commit()
            order_id = row_order.id

        # Crear el OrderItem
        new_item = OrderItems(
            order_id=order_id,
            product_id=product.id,
            price=product.price  
        )
        db.session.add(new_item)
        db.session.commit()
        response_body['message'] = f'Producto {product.id} añadido a la orden {order_id}'
        response_body['results'] = new_item.serialize()
        return jsonify(response_body), 201
    

@api.route('/orderitems/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def orderitem(id):
    response_body = {}
    additional_claims = get_jwt()
    row = db.session.get(OrderItems, id)
    if not row:
        response_body['message'] = f'El item de orden con id: {id} no existe'
        return jsonify(response_body), 404
    # Validar permisos: Solo el cliente que hizo la orden o el vendedor del producto pueden modificarlo
    user_id = additional_claims.get('user_id')
    if user_id != row.order_to.customer_id and user_id != row.product_to.vendor_id:
        response_body['message'] = 'Acceso denegado: No tienes permisos para modificar este item'
        return jsonify(response_body), 403
    if request.method == 'GET':
        response_body['message'] = f'Item de orden con id: {id} obtenido correctamente'
        response_body['results'] = row.serialize()
        return jsonify(response_body), 200
    if request.method == 'PUT':
        data = request.json
        # Validar si la orden y el producto existen antes de actualizar
        order = db.session.get(Orders, data.get('order_id'))
        product = db.session.get(Products, data.get('product_id'))
        if not order:
            response_body['message'] = 'La orden especificada no existe'
            return jsonify(response_body), 404
        if not product:
            response_body['message'] = 'El producto especificado no existe'
            return jsonify(response_body), 404
        row.order_id = order.id
        row.product_id = product.id
        row.price = data.get('price', row.price)
        db.session.commit()
        response_body['message'] = 'Item de orden actualizado correctamente'
        response_body['results'] = row.serialize()
        return jsonify(response_body), 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = 'El item de orden ha sido eliminado correctamente'
        return jsonify(response_body), 200


@api.route('/pendingorders', methods=['GET', 'POST'])
@jwt_required()
def pendingorders():
    response_body = {}
    additional_claims = get_jwt() 
    user_id = additional_claims.get('user_id')    
    pending_order = db.session.execute(db.select(Orders).where(Orders.customer_id == user_id, Orders.status == 'pendiente')).scalar()
    if not pending_order:
        pending_order = Orders(
            customer_id=user_id,
            status='pendiente',
            address="",
            total_price=0
        )
        db.session.add(pending_order)
        db.session.commit()
    order_serialized = pending_order.serialize()
    if request.method == 'GET':
        rows = db.session.execute(
            db.select(OrderItems).where(OrderItems.order_id == order_serialized['id'])).scalars()
        order_items_list = [item.serialize() for item in rows]
        if not order_items_list:
            response_body['message'] = 'Orden sin artículos'
            response_body['results'] = []
            return jsonify(response_body), 200
        response_body['message'] = 'Items de la orden pendiente'
        response_body['results'] = order_items_list
        return jsonify(response_body), 200
    if request.method == 'POST':
        data = request.json
        product_row = db.session.execute(db.select(Products).where(Products.id == data.get('product_id'))).scalar()
        if not product_row:
            response_body['message'] = 'El producto especificado no existe'
            return jsonify(response_body), 404
        product_serialized = product_row.serialize()
        # Creamos el OrderItem
        order_item = OrderItems(
            order_id=order_serialized['id'],
            product_id=product_serialized['id'],
            price=product_serialized['price']
        )
        db.session.add(order_item)
        db.session.commit()
        response_body['message'] = 'El item de orden ha sido añadido correctamente'
        response_body['results'] = order_item.serialize()
        return response_body, 200


@api.route('/createfirstadmin', methods=['POST'])
def createfirstadmin():
    response_body = {}
    data = request.json
    row = Users(email = 'admin@cafetaleros.com',
                password = 'cafe1234',
                is_admin = True,
                is_active = True,
                is_customer = False,
                is_vendor = False)
    db.session.add(row)
    db.session.commit()
    response_body['message'] = "Admin create"
    response_body['results'] = row.serialize()
    return response_body, 200
