from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users' # Agregue el tablename
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True) # Incluyo el last name
    phone = db.Column(db.String(), unique=False, nullable=True)
    address = db.Column(db.String(), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), default=False)  ## ROLES
    is_customer = db.Column(db.Boolean(), default=False)
    is_vendor = db.Column(db.Boolean(), default=False)

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "email": self.email,
                "is_active": self.is_active,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "phone": self.phone,
                "address": self.address,
                "is_admin": self.is_admin,
                "is_customer": self.is_customer,
                "is_vendor": self.is_vendor}


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    photo = db.Column(db.String(255))
    in_sell = db.Column(db.Boolean, default=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vendor_to = db.relationship('Users', backref=db.backref('product_to', lazy='select'))    

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "category": self.category,
                "description": self.description,
                "price": self.price,
                "photo": self.photo,
                "in_sell": self.in_sell,
                "vendor_id": self.vendor_id}    


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_to = db.relationship('Products', foreign_keys=[product_id], backref=db.backref('comment_to', lazy='select'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('comment_to', lazy='select'))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def serialize(self):
        return {
                "id": self.id,
                "product_id": self.product_id,
                "user_id": self.user_id,
                "title": self.title,
                "description": self.description,
                "date": self.date.strftime('%Y-%m-%d %H:%M:%S')
                }


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_to = db.relationship('Users', backref=db.backref('order_to', lazy='select'))
    status = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_price = db.Column(db.Float, nullable=False)
    address= db.Column(db.String(40), nullable=False)

    def serialize(self):
        return {"id": self.id,
                "customer_id": self.customer_id,
                "status": self.status,
                "date": self.date,
                "total_price": self.total_price,
                "address":self.address}


class OrderItems(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    order_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_items', lazy='select'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_to = db.relationship('Products', foreign_keys=[product_id], backref=db.backref('product_to', lazy='select'))
    price = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {"id": self.id,
                "order_id": self.order_id,
                "product_id": self.product_id,
                "price": self.price}


class FavoriteProducts(db.Model):
    __tablename__ = 'favorite_products'   
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_to = db.relationship('Products', foreign_keys=[product_id], backref=db.backref('favorite_products', lazy='select'))
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_to = db.relationship('Users', foreign_keys=[customer_id], backref= db.backref('customer_to', lazy='select'))

    def serialize(self):
        return {"id": self.id,
                "product_id": self.product_id,
                "customer_id": self.customer_id}
