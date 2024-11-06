from config import db, ma
import bcrypt
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer(), primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)    # hashed with bcrypt
    faculty = db.Column(db.String(80), nullable=False)
    year = db.Column(db.String(80), nullable=False)
    dorm_block = db.Column(db.String(80), nullable=False)
    room = db.Column(db.String(80), nullable=False)     # may need to change to integer, depending on naming convention
    is_admin = db.Column(db.Boolean, default=False)
    
    def set_password(self, raw_password):
        """Hashes the password using bcrypt."""
        self.password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, raw_password):
        """Verifies the password using bcrypt."""
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))
    
    credit = db.relationship('UserCredit', cascade="all, delete-orphan", single_parent=True, passive_deletes=True, backref= 'user')

class UserCredit(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    prev_overdraft = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)  #overdraft before new adjustment
    curr_overdraft = db.Column(db.Numeric(10, 2), nullable=False, default=0.00) #how much you currently owe
    overdraft_adj = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)  #new overdraft adjustment
    prev_credit = db.Column(db.Numeric(10, 2), nullable=False, default=0.00) #credit before new adjustment
    curr_credit = db.Column(db.Numeric(10, 2), nullable=False, default=0.00) #how much currently available in acc
    credit_adj = db.Column(db.Numeric(10, 2), nullable=False, default=0.00) #new credit adjustment
    last_updated = db.Column(db.DateTime, nullable=False, default=db.func.now())

class CreditShema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('user_id', 'prev_overdraft', 'curr_overdraft', 'overdraft_adj', 'prev_credit', 'curr_credit', 'credit_adj', 'last_updated')
        
credits_schema = CreditShema()

class UsersShema(ma.Schema):
    credit = ma.Nested(credits_schema, many=True)
    class Meta:
        # Fields to expose
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'faculty', 'year', 'dorm_block', 'room', 'is_admin', 'credit')
        
users_schema = UsersShema()
    
class Ticket(db.Model):
    id = db.Column(db.Integer(), primary_key=True)   
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    details = db.Column(db.String(320), nullable=False)
    type = db.Column(db.String(20), nullable=False) #selection menu (flooring,plumbing, electrical, furniture, other)
    status = db.Column(db.String(20), nullable=False)   #updated on admin side (pending, accepted, in progress, completed)
    uploaded = db.Column(db.DateTime, nullable=False, default=db.func.now())
    last_actioned = db.Column(db.DateTime, nullable=False, default=db.func.now())

class TicketSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'user_id', 'details', 'type', 'status', 'uploaded', 'last_actioned')
        
tickets_schema = TicketSchema()