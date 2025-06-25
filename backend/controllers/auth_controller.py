from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from models.user_model import get_user_by_username, insert_user
from schemas.user_schema import user_schema, verify_password
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    team_usernames = data.get('team', []) if role == 'manager' else None

    if not username or not password or role not in ['manager', 'employee']:
        return jsonify({'msg': 'Missing or invalid fields'}), 400

    if get_user_by_username(username):
        return jsonify({'msg': 'Username already exists'}), 409

    team_ids = []
    if role == 'manager' and team_usernames:
        for uname in team_usernames:
            emp = get_user_by_username(uname)
            if not emp:
                return jsonify({'msg': f'Employee username {uname} not found'}), 404
            team_ids.append(str(emp['_id']))

    user = user_schema(username, password, role, team_ids if role == 'manager' else None)
    insert_user(user)
    return jsonify({'msg': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'msg': 'Missing username or password'}), 400

    user = get_user_by_username(username)
    if not user or not verify_password(user['password'], password):
        return jsonify({'msg': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user['_id']), additional_claims={'role': user['role']})
    return jsonify({'access_token': access_token, 'role': user['role']}), 200 