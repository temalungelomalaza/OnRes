from datetime import timedelta, datetime
from decimal import Decimal
from flask import Flask, jsonify, request
from flask_jwt_extended import ( # type: ignore
    JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS # type: ignore
from flask_migrate import Migrate, upgrade # type: ignore
from flask_bcrypt import Bcrypt # type: ignore
from sqlalchemy import func # type: ignore
from config import db, Config
from models import *
 
def create_app():   #creating flask app
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize components
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)   #handles web sessions 
    bcrypt = Bcrypt(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)   #for cross-platform transmission/access of data

    with app.app_context():
        upgrade()

    return app

app = create_app()

@app.route('/')
def index():
    return jsonify('app is running')

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Ensure this route requires the refresh token
def refresh():
    try:
        identity = get_jwt_identity()
        new_access_token = create_access_token(identity=identity)
        return jsonify(access_token=new_access_token), 200
    except Exception as e:
        return jsonify({"error": "Invalid refresh token"}), 401

@app.route('/users', methods=['POST', 'GET'])
@jwt_required()
def users():    
    if request.method == 'GET':
        print('get')
    if request.method == 'POST':
         print('post')

@app.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    identity = get_jwt_identity()
    user = User.query.get(identity["id"])
    if user:
        return jsonify({"id": user.id, "first_name": user.first_name, "is_admin": user.is_admin}), 200
    return jsonify({"error": "User not found"}), 404
        
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'GET':
        print('get')
    if request.method == 'POST':
         print('post')

@app.route('/report', methods=['POST', 'GET', 'PUT'])
@jwt_required()
def reports():
    if request.method == 'GET':
        print('get')
    if request.method == 'POST':
         print('post')
      
@app.route('/credit', methods=['POST', 'GET'])
@jwt_required()
def credit():
    current_user = get_jwt_identity()
    if request.method == 'GET':
        print('get')
    if request.method == 'POST':
         print('post')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Automatically create tables when the app starts
    app.run(port=5555, debug=True)