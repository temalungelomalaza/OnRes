from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()

class Config:
    SECRET_KEY = b'***************************************'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://onres:webapp1@localhost/web_dorm.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'jwt123'  
    JWT_ACCESS_TOKEN_EXPIRES = 3600  #web token is pre-set for 60minutes before expiry