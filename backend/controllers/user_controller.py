from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.user_model import get_user_by_id

user_bp = Blueprint('user', __name__)

@user_bp.route('/users/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    user_info = {
        'id': str(user['_id']),
        'username': user['username'],
        'role': user['role'],
        'team': user.get('team', [])
    }
    return jsonify(user_info), 200

@user_bp.route('/team', methods=['GET'])
@jwt_required()
def get_team():
    claims = get_jwt()
    if claims.get('role') != 'manager':
        return jsonify({'msg': 'Only managers can access this endpoint'}), 403
    user_id = get_jwt_identity()
    manager = get_user_by_id(user_id)
    if not manager:
        return jsonify({'msg': 'Manager not found'}), 404
    team_ids = manager.get('team', [])
    team_members = []
    for emp_id in team_ids:
        emp = get_user_by_id(emp_id)
        if emp:
            team_members.append({'id': str(emp['_id']), 'username': emp['username']})
    return jsonify({'team': team_members}), 200 