from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()

class Config:
    SECRET_KEY = b'***************************************'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///web_dorm.db?check_same_thread=False'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'jwt123'  
    JWT_ACCESS_TOKEN_EXPIRES = 3600  #sets 1-hour expiration