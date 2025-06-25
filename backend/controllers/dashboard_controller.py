from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.user_model import get_user_by_id
from models.feedback_model import get_feedback_by_employee

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/manager', methods=['GET'])
@jwt_required()
def manager_dashboard():
    claims = get_jwt()
    if claims.get('role') != 'manager':
        return jsonify({'msg': 'Only managers can access this endpoint'}), 403
    user_id = get_jwt_identity()
    manager = get_user_by_id(user_id)
    if not manager:
        return jsonify({'msg': 'Manager not found'}), 404
    team = manager.get('team', [])
    team_feedback = {}
    sentiment_trends = {'positive': 0, 'neutral': 0, 'negative': 0}
    total_feedback = 0
    for emp_id in team:
        feedbacks = get_feedback_by_employee(emp_id)
        team_feedback[emp_id] = len(feedbacks)
        for fb in feedbacks:
            sentiment_trends[fb.get('sentiment', 'neutral')] += 1
            total_feedback += 1
    return jsonify({'feedback_count': team_feedback, 'sentiment_trends': sentiment_trends, 'total_feedback': total_feedback}), 200

@dashboard_bp.route('/dashboard/employee', methods=['GET'])
@jwt_required()
def employee_dashboard():
    claims = get_jwt()
    if claims.get('role') != 'employee':
        return jsonify({'msg': 'Only employees can access this endpoint'}), 403
    user_id = get_jwt_identity()
    feedbacks = get_feedback_by_employee(user_id)
    timeline = []
    for fb in feedbacks:
        timeline.append({
            'id': str(fb['_id']),
            'manager_id': fb['manager_id'],
            'strengths': fb['strengths'],
            'improvements': fb['improvements'],
            'sentiment': fb['sentiment'],
            'timestamp': fb['timestamp'].isoformat() if fb['timestamp'] else None,
            'acknowledged': fb.get('acknowledged', False),
            'tags': fb.get('tags', [])
        })
    return jsonify({'timeline': timeline}), 200 