from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.feedback_model import insert_feedback, get_feedback_by_employee, update_feedback, acknowledge_feedback as ack_feedback
from models.user_model import get_user_by_username
from schemas.feedback_schema import feedback_schema

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    claims = get_jwt()
    if claims.get('role') != 'manager':
        return jsonify({'msg': 'Only managers can submit feedback'}), 403
    data = request.get_json()
    manager_id = get_jwt_identity()
    employee_username = data.get('employee_id')
    strengths = data.get('strengths')
    improvements = data.get('improvements')
    sentiment = data.get('sentiment')
    tags = data.get('tags', [])
    if not employee_username or not strengths or not improvements or sentiment not in ['positive', 'neutral', 'negative']:
        return jsonify({'msg': 'Missing or invalid fields'}), 400
    emp = get_user_by_username(employee_username)
    if not emp:
        return jsonify({'msg': f'Employee username {employee_username} not found'}), 404
    feedback = feedback_schema(manager_id, str(emp['_id']), strengths, improvements, sentiment, tags)
    insert_feedback(feedback)
    return jsonify({'msg': 'Feedback submitted'}), 201

@feedback_bp.route('/feedback/<employee_id>', methods=['GET'])
@jwt_required()
def get_feedback_history(employee_id):
    claims = get_jwt()
    user_id = get_jwt_identity()
    # Employees can only see their own feedback, managers can see their team's
    if claims.get('role') == 'employee' and user_id != employee_id:
        return jsonify({'msg': 'Forbidden'}), 403
    feedbacks = get_feedback_by_employee(employee_id)
    for fb in feedbacks:
        fb['id'] = str(fb['_id'])
        del fb['_id']
        # Convert timestamp to ISO string for proper JSON serialization
        if 'timestamp' in fb and fb['timestamp']:
            fb['timestamp'] = fb['timestamp'].isoformat()
    return jsonify({'feedback': feedbacks}), 200

@feedback_bp.route('/feedback/<feedback_id>', methods=['PUT'])
@jwt_required()
def edit_feedback(feedback_id):
    claims = get_jwt()
    if claims.get('role') != 'manager':
        return jsonify({'msg': 'Only managers can edit feedback'}), 403
    data = request.get_json()
    update_fields = {k: v for k, v in data.items() if k in ['strengths', 'improvements', 'sentiment', 'tags']}
    update_feedback(feedback_id, update_fields)
    return jsonify({'msg': 'Feedback updated'}), 200

@feedback_bp.route('/feedback/<feedback_id>/ack', methods=['POST'])
@jwt_required()
def acknowledge_feedback(feedback_id):
    claims = get_jwt()
    if claims.get('role') != 'employee':
        return jsonify({'msg': 'Only employees can acknowledge feedback'}), 403
    ack_feedback(feedback_id)
    return jsonify({'msg': 'Feedback acknowledged'}), 200 