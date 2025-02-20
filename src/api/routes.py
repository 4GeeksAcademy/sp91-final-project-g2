"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Comments, Orders, Products, Users
from datetime import datetime


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
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
    

@api.route('/orders', methods=['GET', 'POST', 'PUT'])
def handle_orders():
    """
    Endpoint para manejar solicitudes GET, POST y PUT en la ruta /orders.

    - GET: Obtiene todas las órdenes.
    - POST: Crea una nueva orden.
    - PUT: Actualiza el campo 'total_price' de una orden existente (solo para vendedores).

    Returns:
        tuple: Un diccionario de respuesta con los datos de las órdenes y un código de estado HTTP 200.
    """
    if request.method == 'GET':
        # Obtener todas las órdenes de la base de datos
        orders = Orders.query.all()
        # Serializar las órdenes
        orders_serialized = [order.serialize() for order in orders]
        # Devolver las órdenes serializadas en formato JSON
        return jsonify(orders_serialized), 200
    
    if request.method == 'POST':
        # Obtener el cuerpo de la solicitud en formato JSON
        request_body = request.get_json()
        # Crear una nueva orden con los datos proporcionados
        order = Orders(
            customer_id=request_body['customer_id'],
            status=request_body['status'],
            date=request_body['date'],
            date_order=request_body['date_order'],
            date_delivery=request_body['date_delivery'],
            total_price=request_body['total_price']
        )
        # Agregar la nueva orden a la sesión de la base de datos
        db.session.add(order)
        # Confirmar la transacción
        db.session.commit()
        # Devolver la orden recién creada en formato JSON
        return jsonify(order.serialize()), 200
    
    if request.method == 'PUT':
        # Obtener el cuerpo de la solicitud en formato JSON
        request_body = request.get_json()
        # Verificar si el usuario es un vendedor
        user = Users.query.get(request_body['user_id'])
        if not user or not user.is_vendor:
            return jsonify({"error": "Acceso denegado. Solo los vendedores pueden editar las órdenes."}), 403
        # Buscar la orden existente en la base de datos usando el ID proporcionado
        order = Orders.query.get(request_body['id'])
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404
        # Actualizar solo el campo 'total_price' de la orden con el nuevo valor proporcionado
        order.total_price = request_body['total_price']
        # Confirmar la transacción
        db.session.commit()
        # Devolver la orden actualizada en formato JSON
        return jsonify(order.serialize()), 200
    
