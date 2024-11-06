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
 
def create_app():   #creates Flask app
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize components
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)   #handles web sessions 
    bcrypt = Bcrypt(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)   #to achieve cross-platform transmission and the access of data

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
        curr_user = get_jwt_identity()
        if curr_user['is_admin']:
            users = User.query.all()
        else:
            users = User.query.all()
        user_data = users_schema.dump(users, many=isinstance(users, list))
        print(user_data)
        return jsonify(user_data)
    elif request.method =='POST':
        data = request.get_json()
        print(data)
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')
        faculty = data.get('faculty')
        year = data.get('year')
        block = data.get('block')
        room = data.get('room')
        new_credit = 0
        
        new_user = User(
            first_name = first_name,
            last_name = last_name,
            email = email,
            faculty = faculty,
            year = year,
            dorm_block = block,
            room = room
        )
        new_user.set_password(password) #hashes input password
        db.session.add(new_user)
        db.session.commit()
        
        new_credit = UserCredit(
            user_id = new_user.id,
            curr_credit = new_credit
        )
        new_user.credit.append(new_credit)
        
        db.session.commit()
        
        user_data = users_schema.dump(new_user, many=isinstance(new_user, list))
        db.session.remove()
        return jsonify(user_data)

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
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity={
            'id': user.id,
            'first_name': user.first_name,
            'is_admin': user.is_admin
        }, expires_delta=timedelta(hours=1))  # 1-hour expiration
        refresh_token = create_refresh_token(identity={'id': user.id, 'first_name': user.first_name, 'is_admin': user.is_admin})
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200

    return jsonify({"error": "Invalid credentials"}), 401  # Ensure proper error response

@app.route('/report', methods=['POST', 'GET', 'PUT'])
@jwt_required()
def reports():
    curr_user = get_jwt_identity()
    if request.method == 'POST':
        if curr_user['is_admin']:
            data = request.get_json()
            type = data.get('type')
            status = data.get('status')
            start_date = data.get('startDate')
            end_date = data.get('endDate')
            print(type)
            
            query = Ticket.query.join(User).filter(User.id == Ticket.user_id)
            
            if type:
                query = query.filter(Ticket.type == type)
            if status:
                query = query.filter(Ticket.status == status)
            if start_date and end_date:
                query = query.filter(Ticket.uploaded.between(start_date, end_date))

            # Fetch the tickets with associated user data
            tickets = query.add_columns(User.dorm_block, User.room).all()

            result = [
                {
                    "ticket": tickets_schema.dump(ticket),
                    "dorm_block": dorm_block,
                    "room": room
                } for ticket, dorm_block, room in tickets
            ]
            print(result)
            return jsonify(result)
    
        else:
            uploaded = datetime.now()
            # uploaded = now.strftime("%d/%m/%Y %H:%M:%S")
            data = request.get_json()
            details = data.get('details')
            type = data.get('type')
            status = 'Submitted'
            
            new_ticket = Ticket(
                user_id = curr_user['id'],
                details = details,
                type = type,
                uploaded = uploaded,
                last_actioned = uploaded,
                status = status
            )
            db.session.add(new_ticket)
            db.session.commit()
            
            ticket = tickets_schema.dump(new_ticket, many=isinstance(new_ticket, list))
            return jsonify(ticket)
        
    elif request.method == 'GET':
        if curr_user['is_admin']:
            query = Ticket.query.join(User).filter(User.id == Ticket.user_id)
            tickets = query.add_columns(User.dorm_block, User.room).all()

            report_data = [
                {
                    "ticket": tickets_schema.dump(ticket),
                    "dorm_block": dorm_block,
                    "room": room
                } for ticket, dorm_block, room in tickets
            ]
            return jsonify(report_data)
        else:
            reports = Ticket.query.filter_by(user_id=curr_user['id']).all()
            print(reports)
            report_data = tickets_schema.dump(reports, many=isinstance(reports, list))
            return jsonify(report_data)
    elif request.method == 'PUT':   # Update ticket status and last_actioned time (admin only)
        
        if curr_user['is_admin']:
            ticket_id = request.args.get('ticket_id')
            data = request.get_json()
            new_status = data.get('status')
            last_actioned = datetime.now()
            
            # Find the ticket by ID
            ticket = Ticket.query.filter_by(id=ticket_id).first()
            
            if not ticket:
                return jsonify({"error": "Ticket not found"}), 404
            
            # Update the status and last_actioned time
            ticket.status = new_status
            ticket.last_actioned = last_actioned
            db.session.commit()
            
            updated_ticket = tickets_schema.dump(ticket)
            return jsonify(updated_ticket)
        
        return jsonify({"error": "Unauthorized"}), 403
      
@app.route('/credit', methods=['POST', 'GET'])
@jwt_required()
def credit():
    current_user = get_jwt_identity()
    if request.method == 'GET':
        if current_user['is_admin']:
            id = request.args.get('userID')
            credit_records = UserCredit.query.filter_by(user_id = id).all()
        else:
            credit_records = UserCredit.query.filter_by(user_id = current_user['id']).all()
        
        result = [
            {
                'user_id': credit.user_id,
                'first_name': credit.user.first_name,
                'last_name': credit.user.last_name,
                'email': credit.user.email,
                'prev_overdraft': credit.prev_overdraft,
                'curr_overdraft': credit.curr_overdraft,
                'overdraft_adj': credit.overdraft_adj,
                'prev_credit': credit.prev_credit,
                'curr_credit': credit.curr_credit,
                'credit_adj': credit.credit_adj,
                'last_updated': credit.last_updated.strftime('%Y-%m-%d')
            }
            for credit in credit_records]
        
        print(result)
        return jsonify(result)
    elif request.method == 'POST':
        if current_user['is_admin']:
            id = request.args.get('userID')
            data = request.get_json()
            new_credit = data.get('newCredit')
            new_overdraft = data.get('newOverdraft')
            new_credit = Decimal(new_credit)
            new_overdraft = Decimal(new_overdraft)
            
            latest_credit = ( UserCredit.query.filter_by(user_id=id).order_by(UserCredit.last_updated.desc()).first())
            print(latest_credit)
            
            credit_record = UserCredit(
                user_id = id,
                prev_overdraft = latest_credit.curr_overdraft,
                curr_overdraft = sum([latest_credit.curr_overdraft, new_overdraft]),
                overdraft_adj = new_overdraft,
                prev_credit = latest_credit.curr_credit,
                curr_credit = sum([latest_credit.curr_credit, new_credit]),
                credit_adj = new_credit
            )
            
            db.session.add(credit_record)
            db.session.commit()
            
            return jsonify('Credit record added!')
        else:
            data = request.get_json()
            start = data.get('startDate')
            end = data.get('endDate')
            start_date = datetime.strptime(start, '%Y-%m-%d')
            end_date = datetime.strptime(end, '%Y-%m-%d')
            query = UserCredit.query.filter_by(user_id = current_user['id'])
            credit_records = query.filter(func.date(UserCredit.last_updated).between(start_date, end_date))
        
            result = [
            {
                'user_id': credit.user_id,
                'first_name': credit.user.first_name,
                'last_name': credit.user.last_name,
                'email': credit.user.email,
                'prev_overdraft': credit.prev_overdraft,
                'curr_overdraft': credit.curr_overdraft,
                'overdraft_adj': credit.overdraft_adj,
                'prev_credit': credit.prev_credit,
                'curr_credit': credit.curr_credit,
                'credit_adj': credit.credit_adj,
                'last_updated': credit.last_updated.strftime('%Y-%m-%d')
            }
            for credit in credit_records]
        
        print(result)
        return jsonify(result)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Automatically create tables when the app starts
    app.run(port=5555, debug=True)